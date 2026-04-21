# TonerManager

TonerManager ist eine lokale Web‑App zur Tonerverwaltung mit Node.js‑Backend und SQLite.

## Lokal entwickeln

1. Abhängigkeiten installieren:

```
npm install
```

2. (Optional) `.env.local` erstellen:

```
VITE_API_BASE_URL=http://localhost:3000
```

3. Backend starten (Terminal 1):

```
npm run server
```

4. Frontend starten (Terminal 2):

```
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:3000`

## Datenimport (sampleDataDB)

Beim ersten Start seeden wir automatisch, wenn die DB leer ist
und der Ordner `sampleDataDB` existiert. Alternativ:

```
SEED_DIR=/pfad/zu/sampleDataDB npm run server
```

Die CSVs werden nach SQLite übernommen (`data/toner.db`).

Hinweis zu Standorten:
- Wenn keine `Location.csv` vorhanden ist, wird automatisch **„Standort A“** angelegt.
- Optional kannst du `Location.csv` hinzufügen und in `Printer.csv`/`Cabinet.csv` `location_id` setzen.

## Microsoft Entra ID (Auth)

Auth ist nur für die Verwaltung aktiv. Alle anderen Seiten bleiben öffentlich.

### App Registration (einmalig)
1. Azure Portal → **Entra ID** → **App registrations** → **New registration**
2. Name z. B. `TonerManager`
3. **Supported account types**: Single tenant
4. **Redirect URI (Web)**:
   - `http://localhost:3000/api/auth/callback`
5. Nach dem Anlegen die **Application (client) ID** kopieren

### App Roles anlegen
App roles (Tab **App roles**):
- `admin`
- `user`

Danach Benutzer/Gruppen zuweisen:
Entra ID → **Enterprise applications** → deine App → **Users and groups**.

### Client Secret
Unter **Certificates & secrets** ein **Client Secret** erstellen und notieren.

### Backend-Umgebungsvariablen
Das Backend liest die Entra-Einstellungen aus der Umgebung:

```
AAD_TENANT_ID=da9f3a3f-cdc0-436e-9bf9-80f913676d42
AAD_CLIENT_ID=your_client_id
AAD_CLIENT_SECRET=your_client_secret
AAD_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

## Lokales Login (ohne Entra)

Lokales Login ist immer verfügbar (auch wenn Entra aktiviert ist).
Zugangsdaten werden in SQLite gespeichert.

Default Admin:
- E-Mail: `admin@local`
- Passwort: `admin`

Login erfolgt über die Verwaltung (`/Admin`) → Login-Formular.

### Hybrid-Login (E-Mail entscheidet)
- `benutzername` oder `benutzername@local` → lokales Passwort
- alles andere → Microsoft Entra (Redirect, `login_hint`)

### Benutzer verwalten (Admin UI)
In der Verwaltung gibt es einen Tab **Benutzer**, um User anzulegen und zu löschen.

### Benutzer per CLI anlegen
```
npm run user:add -- --email user@example.com --password secret --role user
```

## Produktion (lokal)

```
npm run build
npm run start
```

Dann läuft alles unter `http://localhost:3000` (Backend + statisches Frontend aus `dist`).

## Docker

```
docker compose up --build
```

Danach: `http://localhost:3000`

Die Datenbank + Uploads werden nach `./data` gemountet.

Für Entra ID im Docker:
- **Runtime env** (Backend): `AAD_*` in `.env`

Für den Seed im Docker wird `sampleDataDB` als `/seed` gemountet (oder per `SEED_DIR` setzen).

## Bedienungsanleitung (Kurz)

### 1) Toner finden
- Öffne **Toner finden** in der Sidebar.
- Suche nach Druckername, Standort oder Modell.
- Wähle einen Drucker, um die passenden Toner zu sehen.
- Ein Klick auf eine Position hebt die Schrank‑Position hervor (blinkend).

### 2) Schränke verwalten (Toner ein-/auslagern)
- Öffne **Schränke**.
- Klicke ein freies Fach, um einen Toner zu **belegen**.
- Klicke ein belegtes Fach, um einen Toner zu **entnehmen**.
- Ob Entnahme/Ablage eine Anmeldung erfordert, stellst du im Admin‑Bereich ein.

### 3) Toner‑Übersicht
- Unter **Toner‑Übersicht** siehst du alle Toner inkl. Bestand, Minimalbestand und Fehlmenge.
- Filter: **Bestand 0**, **Über Minimum**, **Unter Minimum**.
- Über den **Drucken**‑Button kannst du die Liste kompakt ausgeben.

### 4) Verwaltung (Admin)
Im **Verwaltung**‑Bereich kannst du:
- Standorte, Schränke, Hersteller, Modelle, Toner und Drucker pflegen
- Benutzer anlegen und Rollen vergeben
- Standard‑Sprache und Auth‑Pflicht für Entnahme/Ablage setzen
