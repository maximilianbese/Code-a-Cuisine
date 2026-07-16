# n8n lokal betreiben – 100% kostenlos, ohne Kreditkarte

Diese Anleitung ersetzt n8n Cloud. Alles läuft auf deinem Rechner und kostet
nichts. Nachteil: n8n ist nur erreichbar, solange dein Rechner (bzw. Docker)
läuft – für Test und Abgabe/Vorführung reicht das.

> Der ganze Stack bleibt kartenfrei: **Gemini** (Google AI Studio) und
> **Firebase Firestore** (Spark-Plan) sind ebenfalls gratis und ohne Kreditkarte.

## 1. Docker installieren (gratis)

**Docker Desktop** herunterladen und installieren: <https://www.docker.com/products/docker-desktop/>
Keine Kreditkarte, kein Account-Zwang für die private Nutzung.

## 2. n8n starten

Im Projektordner im Terminal:

```bash
docker compose -f n8n/docker-compose.local.yml up -d
```

Nach ~30 Sekunden ist n8n unter <http://localhost:5678> erreichbar. Beim ersten
Aufruf legst du **lokal** ein Owner-Konto an (nur E-Mail + Passwort, keine Zahlung).

## 3. Workflow importieren

In n8n: **Workflows → Import from File** → `n8n/code-a-cuisine-recipe-generation.json`.

## 4. Gemini-Key eintragen (gratis)

1. Key holen auf <https://aistudio.google.com/app/apikey> (Google-Login, kein Karte).
2. Node **„Generate with Gemini"** öffnen → `YOUR_GEMINI_API_KEY` durch den Key ersetzen.

## 5. Firestore verbinden (gratis, Spark-Plan)

1. Firebase-Projekt `code-a-cuisine-8fb95` (oder neu) → **Firestore-Datenbank** anlegen.
2. In n8n ein Credential **„Google Firebase Cloud Firestore API"** (Service Account) hinterlegen.
3. Bei **„Save to Firestore"** und **„Read Firestore Library"** jeweils die `projectId`
   setzen und das Credential zuweisen; den Node „Save to Firestore" aktivieren
   (Rechtsklick → Activate).

## 6. CORS für die lokale App

Beide Webhook-Nodes (**Webhook** und **Webhook Library**) → Options →
**Allowed Origins (CORS)** → `http://localhost:4200` eintragen (oder testweise `*`).

## 7. Workflow aktivieren & App verbinden

1. Workflow oben rechts **aktivieren**. Die lokalen URLs sind dann:
   - `http://localhost:5678/webhook/generate-recipes`
   - `http://localhost:5678/webhook/library`
2. Für den lokalen Test in `src/app/core/config/app-config.ts` beide URLs auf
   `http://localhost:5678/...` setzen. (Für ein späteres Live-Hosting trägst du dort
   wieder die öffentliche n8n-Adresse ein.)
3. App starten: `ng serve` → <http://localhost:4200>, einmal generieren.

## Stoppen / später wieder starten

```bash
docker compose -f n8n/docker-compose.local.yml down   # stoppt n8n, Daten bleiben erhalten
docker compose -f n8n/docker-compose.local.yml up -d  # wieder starten
```

Ist n8n aus, zeigt die App automatisch die Beispiel-Rezepte als Fallback –
sie bleibt also immer funktionsfähig.
