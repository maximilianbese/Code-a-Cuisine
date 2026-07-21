# n8n von außen erreichbar machen (Tailscale Funnel)

Die deployte Seite läuft auf `https://code-a-cuisine.maximilian-bese.de`. Damit
sie deinen n8n-Container ansprechen kann, braucht der eine **öffentliche
HTTPS-Adresse**. `localhost` reicht nicht: das ist im Browser eines Besuchers
dessen eigener Rechner. Und `http://` blockiert Chrome von einer HTTPS-Seite aus
komplett als Mixed Content.

Warum nicht Cloudflare Tunnel: der setzt voraus, dass die Domain bei Cloudflare
liegt — `maximilian-bese.de` liegt bei netcup. Tailscale Funnel braucht keine
eigene Domain und fasst deine DNS-Einträge nicht an.

```
Browser (https://code-a-cuisine.maximilian-bese.de)
        │  POST /webhook/generate-recipes
        ▼
Tailscale Funnel  (https://<rechner>.<tailnet>.ts.net, Zertifikat automatisch)
        ▼
n8n im Docker-Container auf deinem Rechner (Port 5678)
```

---

## Schritt 1 – Tailscale installieren

<https://tailscale.com/download> herunterladen, installieren, mit Google-Konto
anmelden. Der Rechner taucht danach in deinem Tailnet auf.

## Schritt 2 – Funnel freischalten

Funnel ist per Voreinstellung gesperrt. Im Admin-Panel unter
**Access Controls** muss der Rechner das Attribut `funnel` bekommen:

```jsonc
"nodeAttrs": [
  { "target": ["autogroup:member"], "attr": ["funnel"] }
]
```

Speichern nicht vergessen.

## Schritt 3 – n8n mit öffentlicher Adresse starten

Zuerst den Hostnamen herausfinden:

```bash
tailscale status          # zeigt <rechner>.<tailnet>.ts.net
```

Dann `n8n/.env.example` nach `n8n/.env` kopieren und eintragen:

```
N8N_PUBLIC_URL=https://<rechner>.<tailnet>.ts.net/
```

Container neu starten, damit er die Variable liest:

```bash
docker compose -f n8n/docker-compose.local.yml up -d --force-recreate
```

## Schritt 4 – Funnel starten

```bash
tailscale funnel --bg 5678
```

`--bg` lässt ihn im Hintergrund weiterlaufen, auch nach Schließen des Terminals.
Prüfen mit `tailscale funnel status`. Beenden mit `tailscale funnel --https=443 off`.

> Funnel kann nur auf 443, 8443 und 10000 lauschen — 443 ist die richtige Wahl,
> dann steht kein Port in der URL.

## Schritt 5 – Workflow prüfen

In n8n (<http://localhost:5678>) den Workflow öffnen. Bei beiden Webhook-Nodes
ist unter **Options → Allowed Origins (CORS)** bereits eingetragen:

```
https://code-a-cuisine.maximilian-bese.de,http://localhost:4200
```

Ohne diesen Eintrag scheitert schon der Preflight-Request des Browsers, und die
App fällt kommentarlos auf die Beispielrezepte zurück. Workflow **aktivieren**.

## Schritt 6 – Verbindung testen

Vor dem Eintragen in die App einmal von außen prüfen:

```bash
curl -i -X POST https://<rechner>.<tailnet>.ts.net/webhook/generate-recipes \
  -H "Content-Type: application/json" \
  -d '{"ingredients":[{"name":"Pasta","amount":200,"unit":"gram"}],
       "preferences":{"portions":2,"cooks":2,"cuisine":"italian","diet":"none","time":"quick"}}'
```

Erwartet: HTTP 200 und ein JSON-Array mit Rezepten. Kommt 404, ist der Workflow
nicht aktiv. Kommt gar nichts, läuft der Funnel nicht.

## Schritt 7 – In die App eintragen

`src/environments/environment.ts`:

```ts
n8nWebhookUrl: 'https://<rechner>.<tailnet>.ts.net/webhook/generate-recipes',
n8nLibraryUrl: 'https://<rechner>.<tailnet>.ts.net/webhook/library',
```

Dann neu bauen und hochladen.

---

## Wenn der Rechner aus ist

Dann antwortet der Webhook nicht, und die App zeigt die 12 mitgelieferten
Rezepte. Die Konsole bleibt sauber, es gibt keine roten Fehler — die Seite wirkt
vollständig, nur ohne frische KI-Rezepte. Für eine Abgabe heißt das: der
Reviewer sieht die KI nur, wenn dein Rechner in dem Moment läuft. Energiesparmodus
und Ruhezustand solltest du dafür abschalten.
