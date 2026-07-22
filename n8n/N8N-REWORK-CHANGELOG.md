# n8n Rework – Agent-zentriert (schlank, aber sicher)

**Aktueller Workflow (der einzige, den es zu importieren gilt):**
`code-a-cuisine-recipe-generation.json`

Es gibt bewusst nur noch **eine** Workflow-Datei. Die frühere
code-lastige Variante wurde durch die agent-zentrierte Version ersetzt und
entfernt, damit klar ist, welcher Stand gilt (die alte Fassung liegt bei Bedarf
in der Git-Historie). Diese Datei ist der Stand, den wir uns gemeinsam ansehen.

Ziel (laut Mentor): stärker auf den n8n **AI Agent** setzen, die manuelle
Code-Pipeline drumherum reduzieren. Kostenschutz, Firestore-Speicherung und
Fehlerbehandlung bleiben erhalten.

## Was sich geändert hat

**Entfernt: Code-Node „Validate & Build Input"**
Der Prompt wird jetzt direkt im Agent aus dem Webhook-Body gebaut (Ausdruck im
Feld *Text*). Die Zutatenliste, die Präferenzen und die Chef-Verteilung werden
inline zusammengesetzt – kein separater Code-Node mehr. Die Sprache liest der
Agent direkt aus `body.language` (Default `English`).

**Entfernt: Code-Node „Normalize Recipes"**
Der strukturierte Output-Parser liefert bereits ein sauberes
`{ recipes: [...] }`-Objekt. Die Regel „genau 3 Rezepte mit index 1–3" steht
jetzt explizit in der System-Message, statt sie nachträglich per Code zu
erzwingen. „Respond to App" und „Split Recipes" lesen deshalb direkt
`output.recipes`.

**Umverdrahtet**
- `Quota Exceeded?` (False-Zweig) → **direkt** in `Recipe Agent`
- `Recipe Agent` → `Respond to App` **und** `Split Recipes`

**Unverändert (bewusst behalten)**
- `Rate Limit (IP)` – Kostenairbag: 3/IP/Tag, 12 systemweit
- `Quota Exceeded?` + `Respond Quota Exceeded`
- `Chat Model` (Gemini 2.5 Flash) + `Recipe Output Parser`
- `Split Recipes` → `Save to Firestore`
- `Error Trigger` → `Send Error Email`
- Kompletter Library-Zweig (`Webhook Library` → `Read`/`Aggregate` → `Respond`)

Ergebnis: 16 statt 18 Nodes, gleiche Ein-/Ausgabe-Schnittstelle für die App.

## Bewusster Trade-off zum Mitprüfen

Die frühere Node „Validate & Build Input" hat leere Zutaten / ungültige
Portionen **vor** dem LLM-Aufruf abgefangen. Diese Prüfung entfällt jetzt. In der
Praxis abgesichert durch:
1. das Frontend (blockiert „Next step" ohne Zutat, Portionen ≥ 1),
2. den Output-Parser (erzwingt das Rezept-Schema).

Wenn dir das zu locker ist, setzen wir beim gemeinsamen Test einen kleinen
Guard-Node (oder „On Error → Respond") wieder davor.

## Testschritte (beim gemeinsamen Import)

1. `code-a-cuisine-recipe-generation.json` in n8n importieren.
2. Credentials neu verbinden (Gemini, Firestore) – IDs werden beim Import nicht
   übernommen.
3. `projectId` in `Save to Firestore` / `Read Firestore Library` setzen
   (steht als `YOUR_FIREBASE_PROJECT_ID`).
4. Über die App eine Generierung auslösen und prüfen:
   - Antwort enthält 3 Rezepte, index 1–3, Sprache = `body.language`.
   - Firestore-Dokumente werden geschrieben.
   - Rate-Limit greift ab dem 4. Versuch pro IP.
