# Checklisten-Status – Code à Cuisine

Legende: ✅ erfüllt · 🟡 fertig, kleiner Live-Rest · ⏳ Deployment-Schritt

Frontend (Angular), n8n-Workflow und die Live-Infrastruktur (Gemini + Firestore)
laufen lokal end-to-end getestet: echte Rezepte werden generiert, in Firestore
gespeichert und die Bibliothek liest live aus Firestore.

---

## Allgemeine Anforderungen

- ✅ Angular-Frontend (Standalone, Signals, Lazy Routes), statischer Build
- ✅ GitHub-Repo + `README.md` + `.gitignore`
- ✅ Funktionen ≤14 Zeilen · Dateien <400 Zeilen · JSDoc auf allen Funktionen (45 Fn geprüft)
- ✅ Semantisches HTML inkl. `<nav>`/`<footer>`-Elementen
- ✅ Font-Size: kleinste Schrift = 16px (Desktop-Minimum eingehalten)
- ✅ Layout: Inhalt max. 1440px zentriert, Hintergründe vollflächig, kein horizontales Scrollen
- ✅ Rezepte in Firebase gespeichert – live getestet (Firestore-Schreiben aktiv)

## n8n-Anforderungen

- ✅ n8n-Projekt in Git, aussagekräftige Node-Namen
- ✅ Datenvalidierung im Workflow (Validate & Build Prompt)
- ✅ Rate-Limiting: IP-Quota (3/IP/Tag, 12/Tag), Antwort HTTP 429
- ✅ Klare JSON-Datenverträge (Request/Response passen zum Frontend-Modell)
- 🟡 Fehlerbehandlung: Error-Trigger → „Send Error Email" verdrahtet; sendet erst,
  wenn ein SMTP-Credential hinterlegt ist (sonst nur Struktur vorhanden)

## User Experience / Responsive

- ✅ Ladezeit überbrückt (Loading-Screen)
- ✅ Responsive Desktop/Tablet, einspaltig ab Mobile-Breakpoints (Figma-Mobile-Layout)
- ✅ Nährwerte klar auf kleinen Bildschirmen (umgebrochene Zellen)

## User Stories

- ✅ US1–US8 (Eingabe, Portionen, Zeit, Kochstil, Diät, Helfer, 3 Vorschläge, Schritte)
- ✅ US9 ToDo-Liste pro Kochhelfer (Detailansicht)
- ✅ US10 Nährwerte pro Portion **und** gesamt, inkl. Makro-Prozente
- ✅ US11 Quota-Anzeige im Frontend + Sperre
- ✅ US12 Bibliothek (live aus Firestore) + Paginierung (20/Seite)
- ✅ US13 Klickbare Kategorie-Filter
- ✅ US14 Rezept-Detail aus Bibliothek
- ✅ Impressum-Seite (`/impressum`, per URL) + 404-Seite

---

## Live getestet (Block C – erledigt)

- ✅ Gemini-Generierung (`gemini-2.5-flash`) – echte Rezepte, passend zu Eingabe/Küche
- ✅ Firestore-Speicherung (Service-Account) aktiv
- ✅ Bibliothek liest live aus Firestore (`/webhook/library`)
- ✅ Webhook-URLs in `app-config.ts` gesetzt, CORS am Webhook freigegeben

## Offen fürs Online-Stellen (Deployment)

- ⏳ Frontend auf Netcup hochladen (statischer Build) — siehe `NETCUP-DEPLOY.md`
- ⏳ n8n öffentlich erreichbar machen, damit die Generierung auch remote läuft
  (lokal läuft es; für einen öffentlichen Link braucht n8n eine öffentliche Adresse)
- 🟡 optional: SMTP-Credential für die Fehler-E-Mail

Anleitungen: `NETCUP-DEPLOY.md`, `n8n/LOCAL-N8N.md`, `N8N-ORACLE-SETUP.md`, `n8n/N8N-SETUP.md`.
