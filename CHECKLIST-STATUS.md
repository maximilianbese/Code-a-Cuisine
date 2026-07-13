# Checklisten-Status – Code à Cuisine

Legende: ✅ erfüllt · 🟡 code fertig, braucht Live-Infrastruktur · ⏳ Live-Schritt

Der komplette Frontend-Code (Block A) und der n8n-Workflow (Block B) sind fertig
und der Production-Build läuft grün. Offen sind nur noch die Schritte, die deine
Accounts brauchen (Block C) und die wir live zusammen erledigen.

---

## Allgemeine Anforderungen

- ✅ Angular-Frontend (Standalone, Signals, Lazy Routes), statischer Build
- ✅ GitHub-Repo + `README.md` (echter Link) + `.gitignore`
- ✅ Funktionen ≤14 Zeilen · Dateien <400 Zeilen · JSDoc auf allen Funktionen
- ✅ Semantisches HTML inkl. globalem `<footer>`/`<nav>` mit Impressum-Link
- ✅ Font-Size ≥16px, Kleingedrucktes ≥14px (geprüft: nichts <14px)
- 🟡 Rezepte in Firebase gespeichert – Workflow-Node + Modell fertig; scharf
  schalten mit deinem Firebase-Projekt (Block C)

## n8n-Anforderungen

- ✅ n8n-Projekt in Git, aussagekräftige Node-Namen
- ✅ Datenvalidierung im Workflow
- ✅ **Fehlerbehandlung**: Error-Trigger → E-Mail-Benachrichtigung
- ✅ **Rate-Limiting**: IP-Quota (3/IP/Tag, 12/Tag) mit 429-Antwort
- ✅ Klare JSON-Datenverträge

## User Experience / Responsive

- ✅ Ladezeit überbrückt (Loading-Screen)
- ✅ Responsive Desktop/Tablet/Smartphone, touch-freundlich
- ✅ Nährwerte klar auf kleinen Bildschirmen (umgebrochene Zellen)

## User Stories

- ✅ US1–US8 (Eingabe, Portionen, Zeit, Kochstil, Diät, Helfer, 3 Vorschläge, Schritte)
- ✅ US9 ToDo-Liste pro Kochhelfer (Detailansicht)
- ✅ US10 Nährwerte pro Portion **und** gesamt, inkl. Makro-Prozente
- ✅ US11 Quota-Anzeige im Frontend (verbleibende Nutzungen) + Sperre
- ✅ US12 Bibliothek mit allen Rezepten + Paginierung (20/Seite)
- ✅ US13 Klickbare Kategorie-Filter
- ✅ US14 Rezept-Detail aus Bibliothek
- ✅ Impressum (im Footer verlinkt) + 404-Seite

---

## Block C – nur noch live zusammen (braucht deine Accounts)

- ⏳ Firebase-Projekt + Firestore + Service-Account → Speicherung real aktiv
- ⏳ Bibliothek aus Firestore lesen (Frontend `getAll()` auf Live-Quelle umstellen)
- ⏳ Gemini-API-Key + n8n läuft (Oracle) → echte Generierung end-to-end
- ⏳ Webhook-URL in `app-config.ts` setzen + CORS für die Domain freigeben

Anleitungen dafür: `N8N-ORACLE-SETUP.md`, `n8n/N8N-SETUP.md`, `NETCUP-DEPLOY.md`.
