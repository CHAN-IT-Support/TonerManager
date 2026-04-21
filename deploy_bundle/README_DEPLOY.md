# TonerManager Deployment Bundle (Docker)

## 1) Vorbereitung
- Docker + Docker Compose installiert
- Ports 80/443 sind frei
- DNS zeigt auf den Server (DOMAIN)

## 2) Konfiguration
1. Kopiere `.env.example` zu `.env`
2. Trage Domain + E-Mail ein (für Let's Encrypt)
3. Optional: Entra-Variablen setzen

Beispiel:
```
DOMAIN=toner.example.com
EMAIL=admin@example.com
ENABLE_HTTPS=on
```

Wenn du **nur HTTP** willst, setze:
```
ENABLE_HTTPS=off
```

## 3) Start
```
docker compose up -d
```

App läuft dann unter:
- https://DOMAIN (wenn ENABLE_HTTPS=on und DNS korrekt)
- http://DOMAIN (Fallback oder wenn HTTPS aus)

## 4) Daten & Persistenz
Die SQLite-DB liegt im Ordner `./data` und bleibt erhalten.

## 5) Image laden (falls nicht vorhanden)
Dieses Bundle enthält ein Image-Archiv `tonermanager_image.tar.gz`.
Lade es vor dem Start:
```
docker load < tonermanager_image.tar.gz
```

