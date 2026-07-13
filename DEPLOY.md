# Code a Cuisine – dauerhaft & kostenlos online (Cloudflare Pages)

Ziel: Die App läuft rund um die Uhr im Netz – auch wenn dein Rechner aus ist –
komplett gratis, ohne „Einschlafen" und ohne Kaltstarts.

## Warum dieser Weg

Deine App ist im Kern **statisch**: Die eigentliche Rezept-Generierung läuft
über deinen **n8n-Webhook** (auf `n8n.cloud`, der ist ohnehin schon dauerhaft
gehostet). Der Angular-Server (SSR) wurde nur zum Ausliefern von HTML gebraucht
und ist nicht nötig. Deshalb wurde die App auf eine **statische Single-Page-App**
umgestellt und wird über ein CDN ausgeliefert.

Vorteil gegenüber einem Node-Server (z. B. Render Free): Ein statisches CDN ist
**wirklich immer an**, hat **keine Kaltstarts** und ist bei Cloudflare Pages
**unbegrenzt gratis** (kommerzielle Nutzung erlaubt, keine Kreditkarte nötig).

## Was bereits geändert wurde (erledigt)

- SSR entfernt: `server.ts`, `main.server.ts`, `app.config.server.ts`,
  `app.routes.server.ts` gelöscht; `angular.json` und `app.config.ts` bereinigt.
- Ungenutzte Abhängigkeiten raus: `@angular/ssr`, `@angular/platform-server`,
  `express` (+ `@types/express`); `package-lock.json` passend aktualisiert.
- `public/_redirects` ergänzt (SPA-Fallback, damit Deep-Links wie
  `/recipe/5` beim Neuladen funktionieren).
- Build lokal verifiziert – erzeugt statische Dateien in
  `dist/code-a-cuisine/browser`.

## Schritt 1 – Änderungen zu GitHub pushen

Auf deinem Rechner im Projektordner (z. B. in der Git-Bash oder im Terminal):

```bash
git add -A
git commit -m "Build as static SPA for free always-on hosting (Cloudflare Pages)"
git push origin master
```

> Hinweis: Der Commit muss von deinem Rechner kommen – die vorbereitete
> Arbeitskopie liegt bereits fertig im Ordner, `git status` zeigt genau diese
> Änderungen.

## Schritt 2 – Cloudflare Pages einrichten (einmalig)

1. Gehe auf **https://dash.cloudflare.com** und lege einen kostenlosen Account an
   (oder logge dich ein). Keine Kreditkarte nötig.
2. Links im Menü: **Compute (Workers & Pages)** → **Create** →
   Reiter **Pages** → **Connect to Git**.
3. GitHub verbinden und das Repository **`maximilianbese/Code-a-Cuisine`** auswählen.
4. Build-Einstellungen setzen:
   - **Framework preset:** Angular (oder „None")
   - **Build command:** `npm run build`
   - **Build output directory:** `dist/code-a-cuisine/browser`
   - Branch: `master`
5. **Save and Deploy** klicken.

Cloudflare installiert die Pakete, baut die App und veröffentlicht sie unter einer
Adresse wie `https://code-a-cuisine.pages.dev`. Ab jetzt löst **jeder Push** auf
`master` automatisch ein neues Deployment aus.

## Schritt 3 – (optional) Eigene Domain

Im Pages-Projekt unter **Custom domains** eine eigene Domain hinzufügen. Kostenlos
für die Domain selbst zahlst du nur die Domain-Registrierung; Cloudflare-Hosting
und SSL bleiben gratis.

## Wichtig: n8n-Webhook & CORS

Die App ruft den Webhook
`https://maximilianbese.app.n8n.cloud/webhook/generate-recipesng` **aus dem
Browser** auf. Auf der echten Domain (nicht mehr `localhost`) muss n8n den Zugriff
per **CORS** erlauben, sonst schlägt die Generierung fehl und die App zeigt die
Beispiel-Rezepte als Fallback.

In n8n beim betroffenen Webhook-Node unter **Options → Allowed Origins (CORS)**
entweder deine Pages-Domain eintragen (z. B. `https://code-a-cuisine.pages.dev`)
oder testweise `*`. Danach den Workflow neu aktivieren.

## Kosten- & Verfügbarkeits-Fazit

- Cloudflare Pages: statisches Hosting, unbegrenzte Bandbreite, immer online,
  keine Kaltstarts, dauerhaft gratis.
- n8n.cloud: läuft unabhängig von deinem Rechner (dein bestehender Plan).
- Dein Rechner darf jederzeit aus sein – die Seite bleibt erreichbar.
