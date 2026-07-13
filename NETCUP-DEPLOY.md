# Website auf netcup-Webhosting (eigene Domain)

Die App ist eine statische Single-Page-App – perfekt für dein netcup-Webhosting.
Du baust sie einmal, lädst die Dateien hoch und verbindest deine Domain. Danach
ist die Seite dauerhaft online (auch bei ausgeschaltetem Rechner), und jede
Aktualisierung ist ein neuer Upload.

Gesamtbild (alles gratis außer dem netcup-Webhosting, das du schon hast):

```
Website  → netcup-Webhosting (deine Domain)
n8n      → Oracle „Always Free"  (siehe N8N-ORACLE-SETUP.md)
Datenbank→ Firebase Firestore    (Spark-Plan, gratis)
```

---

## Schritt 1 – App bauen (auf deinem Rechner)

Im Projektordner im Terminal:

```bash
npm install
npm run build
```

Das erzeugt den Ordner:

```
dist/code-a-cuisine/browser/
```

**Der komplette Inhalt dieses Ordners** ist deine fertige Website (inkl. der
bereits enthaltenen `.htaccess`, die die Deep-Links steuert).

---

## Schritt 2 – Dateien zu netcup hochladen

1. FTP-Zugang im netcup-Webhosting-Control-Panel (WCP) anlegen/ansehen
   (Host, Benutzer, Passwort).
2. Mit einem FTP-Programm verbinden (z. B. **FileZilla**).
   - **Wichtig:** In FileZilla unter *Server → Versteckte Dateien anzeigen*
     aktivieren, sonst wird die `.htaccess` nicht mit hochgeladen.
3. Den **Inhalt** von `dist/code-a-cuisine/browser/` in das Dokumenten-Verzeichnis
   deiner Domain hochladen (bei netcup meist ein Ordner wie `httpdocs/` oder ein
   von dir gewählter Ziel-Ordner). Nicht den Ordner selbst, sondern seinen Inhalt
   (also `index.html`, die JS-Dateien, `.htaccess`, `assets` usw. direkt hinein).

---

## Schritt 3 – Domain verbinden

Im netcup **Customer Control Panel (CCP)**:

1. Deine Domain dem Webhosting-Paket zuordnen.
2. Als **Ziel / Document Root** den Ordner wählen, in den du hochgeladen hast.
3. **SSL/HTTPS aktivieren** (netcup bietet kostenloses Let's-Encrypt-Zertifikat) –
   das ist Pflicht, damit die Seite die n8n-Generierung aufrufen darf.

Nach kurzer Wartezeit (DNS) ist die Seite unter deiner Domain erreichbar.

---

## Schritt 4 – n8n & Firebase (der „kostenlos + immer aktiv"-Teil)

- **n8n** dauerhaft gratis aufsetzen: siehe **`N8N-ORACLE-SETUP.md`** in diesem
  Ordner (Oracle „Always Free" – läuft rund um die Uhr, kostenlos).
- **Firebase Firestore** als Datenbank: kostenloser **Spark-Plan** (kein netcup nötig).

Wenn n8n steht, trägst du seine Webhook-Adresse in
`src/app/core/config/app-config.ts` ein und baust/lädst die Seite neu hoch.

---

## Wichtig: CORS (damit die Generierung funktioniert)

Die Seite läuft auf deiner netcup-Domain und ruft n8n auf einem anderen Server auf.
Deshalb muss n8n den Zugriff von deiner Domain erlauben:

- In n8n beim **Webhook-Node → Options → Allowed Origins (CORS)** deine Domain
  eintragen (z. B. `https://deine-domain.de`), Workflow neu aktivieren.

Ohne diese Freigabe (oder ohne HTTPS auf beiden Seiten) zeigt die App die
Beispiel-Rezepte als Fallback statt der live generierten.

---

## Aktualisieren später

Immer wenn du etwas änderst: `npm run build` und den Inhalt von
`dist/code-a-cuisine/browser/` erneut hochladen (überschreiben). Fertig.
