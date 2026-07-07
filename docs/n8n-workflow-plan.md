# Code-a-Cuisine – n8n Workflow Blaupause

Vollständiger Bauplan für das KI-Backend. Zwei Workflows: **Generate Recipe** (Haupt-Webhook)
und **Error Handler** (Error-Trigger + E-Mail). Frontend = Angular, Persistenz = Firebase (Firestore).

> Ziel: Angular schickt Zutaten + Präferenzen → n8n validiert, prüft Quota, generiert per LLM
> genau 3 Rezepte, speichert sie in Firestore und liefert sie zurück. Kosten werden über ein
> IP-basiertes Quota-System und n8n-seitiges Throttling gedeckelt.

---

## 1. Architektur-Überblick

```
Angular (Frontend)                 n8n (Automation)                 Firebase
──────────────────                 ────────────────                 ────────
 Generate-Recipe-Flow  ──POST──▶  [Webhook /generate-recipe]
                                    │
                                    ├─ Validierung (Code)
                                    ├─ IP normalisieren
                                    ├─ Quota lesen        ◀──────▶  Firestore: quota/*
                                    ├─ Quota prüfen (IF)
                                    ├─ LLM-Aufruf (OpenAI JSON-Mode)
                                    ├─ Output validieren (Code)
                                    ├─ Rezepte speichern  ──────▶  Firestore: recipes/*
                                    ├─ Quota +1           ──────▶  Firestore: quota/*
                                    └─ Respond (3 Rezepte) ─┐
 Rezeptvorschläge      ◀────────────────────────────────────┘

 Cookbook / Bibliothek ──lesen direkt──────────────────────▶  Firestore: recipes/*
```

Die **Bibliothek liest direkt aus Firestore** (öffentlich, ohne Account) – dafür ist kein
n8n nötig. n8n ist ausschließlich für Generierung, Quota und Persistenz zuständig.

---

## 2. JSON-Schnittstellen (Verträge Angular ↔ n8n)

Beide Seiten bauen auf diesen Strukturen auf. Feldnamen und Enums sind verbindlich.

### 2.1 Request – `POST /webhook/generate-recipe`

```json
{
  "ingredients": [
    { "name": "Tomaten", "amount": 500, "unit": "g" },
    { "name": "Zwiebeln", "amount": 2, "unit": "Stück" }
  ],
  "portions": 2,
  "timeCategory": "quick",
  "cookingStyle": "italian",
  "diet": "vegetarian",
  "cookHelpers": 1
}
```

| Feld | Typ | Erlaubte Werte / Regeln |
|------|-----|-------------------------|
| `ingredients` | Array | 1–20 Einträge, mind. 1 Pflicht |
| `ingredients[].name` | string | 1–60 Zeichen, getrimmt |
| `ingredients[].amount` | number | > 0 |
| `ingredients[].unit` | string | `g`, `kg`, `ml`, `l`, `Stück`, `EL`, `TL`, `Prise` |
| `portions` | number | Ganzzahl 1–12 (Default 2) |
| `timeCategory` | enum | `quick` (≤20 Min), `medium` (20–45), `elaborate` (45+) |
| `cookingStyle` | enum | `german`, `italian`, `japanese`, `indian`, `gourmet`, `fusion` |
| `diet` | enum | `vegetarian`, `vegan`, `keto`, `none` |
| `cookHelpers` | number | Ganzzahl 1–3 |

### 2.2 Response – Erfolg (`200`)

```json
{
  "success": true,
  "quota": { "remaining": 2, "limit": 3, "resetAt": "2026-07-07T00:00:00Z" },
  "recipes": [ { "...Recipe": "..." }, { }, { } ]
}
```

### 2.3 Recipe-Objekt (auch das Firestore-Dokument)

```json
{
  "id": "b1e7…-uuid",
  "title": "Cremige Tomaten-Rigatoni",
  "cookingStyle": "italian",
  "diet": "vegetarian",
  "timeCategory": "quick",
  "totalTimeMinutes": 18,
  "portions": 2,
  "usedIngredients": [
    { "name": "Tomaten", "amount": 500, "unit": "g" }
  ],
  "additionalIngredients": [
    { "name": "Olivenöl", "amount": 2, "unit": "EL" }
  ],
  "steps": [
    { "order": 1, "instruction": "Wasser aufsetzen.", "parallel": false,
      "assignedTo": 1, "durationMinutes": 2 }
  ],
  "taskAssignments": { "cook1": [1, 3], "cook2": [2] },
  "nutrition": {
    "perPortion": { "calories": 520, "protein": 18, "carbs": 72, "fat": 16 },
    "total":      { "calories": 1040, "protein": 36, "carbs": 144, "fat": 32 },
    "macroPercent": { "protein": 18, "carbs": 55, "fat": 27 }
  },
  "createdAt": "2026-07-06T14:12:00Z"
}
```

Regeln fürs Recipe-Objekt (im Output-Validator geprüft):
`usedIngredients` deckt **≥ 70 %** der Request-Zutaten ab; `additionalIngredients` **max. 3**
Basiszutaten; `assignedTo`/`taskAssignments` nur Werte `1..cookHelpers`; `nutrition` vollständig.

### 2.4 Response – Fehler

```json
{ "success": false, "error": { "code": "QUOTA_EXCEEDED", "message": "…" } }
```

| HTTP | `error.code` | Bedeutung |
|------|--------------|-----------|
| 400 | `VALIDATION_FAILED` | Request entspricht nicht dem Schema |
| 429 | `QUOTA_EXCEEDED` | IP- oder System-Tageslimit erreicht |
| 429 | `RATE_LIMITED` | Zu viele Anfragen in kurzer Zeit (Throttle) |
| 502 | `LLM_INVALID_OUTPUT` | LLM lieferte kein valides Rezept-JSON |
| 500 | `INTERNAL_ERROR` | Unerwarteter Fehler (löst Error-Workflow aus) |

---

## 3. Firestore-Datenmodell

| Collection / Doc-ID | Zweck | Felder |
|---------------------|-------|--------|
| `recipes/{uuid}` | Bibliothek + Ergebnisse | komplettes Recipe-Objekt (siehe 2.3) |
| `quota/{ip}_{YYYY-MM-DD}` | Zähler pro IP/Tag | `ip`, `date`, `count`, `lastRequestAt`, `updatedAt` |
| `quota/system_{YYYY-MM-DD}` | System-Tageszähler | `date`, `count`, `updatedAt` |

Indizes für die Bibliothek: zusammengesetzter Index auf `cookingStyle` + `createdAt` (desc)
für Kategorie-Filter und Paginierung (20/Seite).

---

## 4. Haupt-Workflow „Generate Recipe" (Node für Node)

Aussagekräftige Node-Namen und Notizen sind Pflicht (Wartbarkeit). Reihenfolge:

| # | Node (Typ) | Aufgabe |
|---|------------|---------|
| 1 | **Webhook** `POST generate-recipe` | Empfängt Body + Header; „Respond: Using Respond Node" |
| 2 | **Code – Extract Context** | IP aus `x-forwarded-for` (erste IP) normalisieren, Datum (UTC) setzen |
| 3 | **Code – Validate Input** | Schema aus §2.1 prüfen; bei Fehler `VALIDATION_FAILED` markieren |
| 4 | **IF – Input valid?** | false → Node 12 (400) |
| 5 | **Firestore – Read Quota (IP)** | Doc `{ip}_{date}` lesen (fehlt = count 0) |
| 6 | **Firestore – Read Quota (System)** | Doc `system_{date}` lesen |
| 7 | **Code – Check Quota & Throttle** | IP<3 UND System<12; `lastRequestAt` < jetzt-N s → Limits; sonst weiter |
| 8 | **IF – Quota OK?** | false → Node 12 (429 mit passendem Code) |
| 9 | **OpenAI – Generate Recipes** | Chat Completion, JSON-Mode, Prompt aus §6 |
| 10 | **Code – Validate LLM Output** | genau 3 Rezepte, 70 %-Regel, ≤3 Extra, Nährwerte, UUID+`createdAt` setzen |
| 11 | **Firestore – Save Recipes** | 3 Docs nach `recipes/` schreiben (Loop/Batch) |
| 12 | **Firestore – Increment Counters** | IP-Doc `count +1` & `lastRequestAt`, System-Doc `count +1` (merge) |
| 13 | **Respond to Webhook** | Erfolg (§2.2) bzw. Fehler-Payload (§2.4) mit korrektem Statuscode |

Fehlerpfade (400/429/502) führen jeweils zu einer **Set**-Node, die die Fehler-Payload baut,
und enden im gemeinsamen **Respond to Webhook**.

---

## 5. Quota- & Rate-Limiting-Logik

Zwei Schutzebenen ergänzen die Frontend-Validierung („Kostenairbag"):

**Tagesquota (harte Grenze).** Pro IP `count < 3`, systemweit `count < 12` pro Kalendertag (UTC).
Zähler stehen in `quota/*` und werden **erst nach erfolgreicher Generierung** erhöht (Node 12),
damit Fehlversuche kein Kontingent verbrauchen.

**Throttling (kurzes Fenster).** In `quota/{ip}_{date}.lastRequestAt` steht der letzte Zeitpunkt.
Liegt die neue Anfrage < N Sekunden danach (Empfehlung: 10 s), → `RATE_LIMITED`. Das bremst
Bursts, bevor teure LLM-Calls entstehen.

**IP-Handling.** `x-forwarded-for` kann mehrere IPs enthalten – immer die **erste** (Client) nehmen.
IPv6 mitverarbeiten; als Doc-Key normalisieren (Doppelpunkte → `-`, damit gültige Firestore-ID).
Geteilte IPs (Büro/WG) teilen sich bewusst dasselbe Kontingent – so gewollt.

> **Offene Annahme (bitte bestätigen):** Ich lese „3 Rezepte pro IP/Tag" als **3 Generierungs­anfragen**
> pro IP (jede liefert 3 Vorschläge), System = **12 Anfragen/Tag**. Alternativ könnte gemeint sein:
> 3 einzelne Rezepte = 1 Anfrage/IP/Tag. Sag mir, welche Zählweise gilt – die Logik ändert sich nur
> in Node 7/12 (Increment um 1 vs. 3).

---

## 6. LLM-Prompt (OpenAI, JSON-Mode)

**System-Prompt (fix):**

> Du bist ein Küchenchef und Ernährungsexperte. Antworte ausschließlich mit gültigem JSON nach dem
> vorgegebenen Schema. Erzeuge **genau 3** unterschiedliche Rezepte, die sich in Zubereitungsart oder
> Geschmack klar unterscheiden. Jedes Rezept nutzt **≥ 70 %** der gelieferten Zutaten und höchstens
> **3 zusätzliche Basiszutaten**. Respektiere `diet`, `cookingStyle`, `timeCategory` und `portions`
> (Mengen exakt skalieren). Schritte chronologisch; parallele Schritte mit `parallel: true` markieren;
> Aufgaben nur auf Köche `1..cookHelpers` verteilen. Nährwerte pro Portion **und** gesamt plus
> Makro-Prozent. Anleitung auch für Anfänger verständlich.

**User-Prompt:** die validierten Request-Felder als JSON + das gewünschte Response-Schema (§2.3, als
Array von 3 Objekten). `response_format: { type: "json_object" }` erzwingt valides JSON; die finale
Prüfung bleibt trotzdem in Node 10 (nie dem Modell blind vertrauen).

---

## 7. Error-Handling-Workflow

Separater Workflow, in den Workflow-Einstellungen des Haupt-Workflows als **Error Workflow** gesetzt.

| # | Node | Aufgabe |
|---|------|---------|
| 1 | **Error Trigger** | Fängt jeden unbehandelten Fehler des Haupt-Workflows |
| 2 | **Set – Format Alert** | Workflow-Name, Node, Fehlermeldung, Zeitstempel, Execution-URL |
| 3 | **Send Email (SMTP)** | Benachrichtigung an das Betreiber-Postfach |

Zusätzlich in kritischen Code-Nodes strukturiertes Logging (`console.log` mit Kontext) für die
n8n-Execution-Historie. So sind Fehlversuche nachvollziehbar, ohne Quota zu verbrauchen.

---

## 8. Sicherheit & Kostenkontrolle (Checklisten-Bezug)

- Eingaben aus Angular werden in n8n **erneut** validiert (Node 3) – nie dem Client vertrauen.
- Zutaten-Anzahl (≤20) und String-Längen begrenzen, um Prompt-Injection/Kosten zu dämpfen.
- LLM-Call **erst nach** bestandener Quota-Prüfung – kein Call ohne Kontingent.
- Zähler-Increment nur bei Erfolg → faire Abrechnung.
- Webhook-Pfad nicht erraten lassen; optional geteilter Header-Token zwischen Angular und n8n.

---

## 9. Nächste Schritte

1. Zählweise der Quota bestätigen (§5) – danach steht die Increment-Logik fest.
2. Konkrete n8n-Nodes bauen und als JSON exportieren (`/n8n/generate-recipe.json`) → in Git einchecken.
3. Passende Angular-Services (`RecipeApiService`, Datenmodelle aus §2) anlegen, damit die Verträge
   auf beiden Seiten identisch sind.
