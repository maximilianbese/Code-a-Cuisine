# Firestore seeden – Rezepte in die Datenbank schreiben

Schreibt ~24 Beispiel-Rezepte in die `recipes`-Sammlung deines Firebase-Projekts
`code-a-cuisine-8fb95`. Nötig, weil die Datenbank im gesperrten Modus ist –
geschrieben wird über einen Service-Account (Admin-Rechte).

## 1. Service-Account-Schlüssel herunterladen

1. Firebase-Konsole → **Projekteinstellungen** (Zahnrad) → Tab **Dienstkonten**.
2. **Neuen privaten Schlüssel generieren** → die JSON-Datei wird heruntergeladen.
3. Lege sie in diesen Ordner und nenne sie `serviceAccountKey.json`.

> Der Schlüssel ist geheim – nicht committen, nicht weitergeben. (Er ist bereits
> über `.gitignore` ausgeschlossen.)

## 2. Skript ausführen

Im Ordner `firestore-seed/`:

```bash
npm install
node seed.mjs ./serviceAccountKey.json
```

Ausgabe bei Erfolg: `Seeded 24 recipes into the "recipes" collection.`

## 3. Prüfen

In der Firebase-Konsole → **Firestore Database** → Sammlung `recipes` – dort
liegen jetzt die Rezepte. Damit ist der Checklisten-Punkt „alle generierten
Rezepte werden in Firebase gespeichert" sichtbar erfüllt.
