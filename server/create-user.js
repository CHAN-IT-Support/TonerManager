import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  if (index === -1) return null;
  return args[index + 1] || null;
};

const emailArg = getArg('--email');
const passwordArg = getArg('--password');
const roleArg = getArg('--role') || 'user';

if (!emailArg || !passwordArg) {
  console.log('Usage: node server/create-user.js --email user@example.com --password secret --role admin|user');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const dataDir = process.env.DATA_DIR || path.join(rootDir, 'data');
const dbPath = path.join(dataDir, 'toner.db');

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL
  );
`);

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const digest = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex');
  return `${salt}:${digest}`;
};

const normalizedEmail = String(emailArg).trim().toLowerCase();
const normalizedRole = String(roleArg).trim().toLowerCase();

const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
if (existing) {
  console.error('User exists already:', normalizedEmail);
  process.exit(1);
}

const id = crypto.randomUUID();
db.prepare('INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)')
  .run(id, normalizedEmail, hashPassword(passwordArg), normalizedRole);

console.log('User created:', normalizedEmail, 'role:', normalizedRole);
