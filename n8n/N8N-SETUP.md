# n8n-Setup – Rezept-Generierung (Google Gemini + Firestore)

Diese Datei erklärt, wie du den Workflow `code-a-cuisine-recipe-generation.json`
importierst und mit der App verbindest.

## Überblick

```
Webhook (POST)  →  Validate & Build Prompt  →  Generate with Gemini
      →  Parse Recipes  →  Respond to App
                        ↘  Split Recipes  →  Save to Firestore
```

- **Webhook**: empfängt den POST der App (`{ ingredients, preferences }`).
- **Validate & Build Prompt**: prüft die Eingaben (Checkliste „Datenvalidierung")
  und baut den Prompt.
- **Generate with Gemini**: ruft die kostenlose Gemini-API auf.
- **Parse Recipes**: wandelt die KI-Antwort in `Recipe[]` (Struktur wie
  `src/app/core/models/recipe.model.ts`).
- **Respond to App**: gibt das `Recipe[]` an die App zurück.
- **Split + Save to Firestore**: speichert jedes Rezept in Firestore
  (Checkliste „in Firebase gespeichert"). Standardmäßig **deaktiviert**, bis die
  Credentials stehen.

## 1. Kostenlosen Gemini-API-Key holen

1. Auf <https://aistudio.google.com/app/apikey> anmelden (Google-Konto).
2. „Create API key" → Key kopieren. Der Free-Tier ist ohne Kreditkarte nutzbar.

## 2. Workflow importieren

1. In n8n: **Workflows → Import from File** → diese Datei
   `code-a-cuisine-recipe-generation.json` wählen.
2. Node **„Generate with Gemini"** öffnen → im Query-Parameter `key` den Platzhalter
   `YOUR_GEMINI_API_KEY` durch deinen Key ersetzen.
   (Sauberer: einen n8n-Credential „Header/Query Auth" anlegen und dort speichern.)
3. Modell ist `gemini-2.5-flash` (schnell und im Free-Tier). Bei Bedarf auf
   `gemini-2.0-pro` o. Ä. ändern.

## 3. Workflow aktivieren & URL kopieren

1. Workflow **aktivieren** (Toggle oben rechts).
2. Node **„Webhook"** öffnen → **Production-URL** kopieren
   (Form: `https://<deine-n8n>/webhook/generate-recipes`).

## 4. App verbinden

In `src/app/core/config/app-config.ts` die URL eintragen:

```ts
export const APP_CONFIG: AppConfig = {
  n8nWebhookUrl: 'https://<deine-n8n>/webhook/generate-recipes',
};
```

Danach nutzt die App echte Rezepte statt der Mock-Daten. Ist das Feld leer oder
der Aufruf schlägt fehl, fällt die App automatisch auf die Mock-Daten zurück.

## 5. Firestore aktivieren (Checkliste)

1. Firebase-Projekt anlegen und **Firestore-Datenbank** erstellen.
2. In n8n einen Credential **„Google Firebase Cloud Firestore API"** (Service
   Account) hinterlegen.
3. Node **„Save to Firestore"**: `YOUR_FIREBASE_PROJECT_ID` durch deine Projekt-ID
   ersetzen, Credential zuweisen, dann den Node **aktivieren** (Rechtsklick →
   „Activate", der Node ist standardmäßig deaktiviert).

## 6. Rate-Limiting & Fehlerbehandlung (Checkliste)

**IP-Quota (Kostenairbag):** Der Node **„Rate Limit (IP)"** zählt pro IP-Adresse
und Tag (max. **3**) sowie systemweit (max. **12**). Bei Überschreitung antwortet
der Workflow über **„Respond Quota Exceeded"** mit HTTP **429** und einer klaren
Meldung. Der Zähler liegt in den Workflow-Static-Data und setzt sich täglich
zurück – keine externe Datenbank nötig.

**Fehler-Benachrichtigung:** Der **„Error Trigger"** → **„Send Error Email"**
schickt bei einem Fehler eine E-Mail.

1. Beim Node **„Send Error Email"** ein **SMTP-Credential** hinterlegen und den
   echten Empfänger (`toEmail`) eintragen.
2. In den **Workflow-Settings** (⋯ → *Settings*) unter **Error Workflow** diesen
   Workflow selbst auswählen, damit seine eigenen Fehler gemeldet werden.

## Datenverträge

**Request von der App (Webhook-Body):**

```json
{
  "ingredients": [{ "name": "Pasta", "amount": 300, "unit": "gram" }],
  "preferences": {
    "portions": 2, "cooks": 1, "time": "quick",
    "cuisine": "italian", "diet": "vegetarian"
  }
}
```

**Antwort an die App:** ein Array aus `Recipe`-Objekten (siehe
`recipe.model.ts`): `id, index, title, cookingTimeMin, cuisine, timeLabel, diet,
likes, cooks, nutrition{...}, yourIngredients[], extraIngredients[], steps[]`.

## Testen

- In n8n „Listen for test event" starten und in der App einmal generieren, oder
- direkt per curl:

```bash
curl -X POST https://<deine-n8n>/webhook-test/generate-recipes \
  -H "Content-Type: application/json" \
  -d '{"ingredients":[{"name":"Pasta","amount":300,"unit":"gram"}],"preferences":{"portions":2,"cooks":1,"time":"quick","cuisine":"italian","diet":"vegetarian"}}'
```

## Hinweis zu Node-Versionen

Der Workflow nutzt Standard-Nodes. Falls ein Node nach dem Import als „unbekannt"
erscheint, liegt es an einer abweichenden n8n-Version – den Node dann einmal neu
aus der Node-Liste hinzufügen (gleicher Name) und verbinden.

## 7. Bibliothek-Endpoint (GET /library)

Neben der Generierung enthält der Workflow einen zweiten Webhook, der die
Cookbook-Bibliothek direkt aus Firestore liefert:

```
Webhook Library (GET /library)  →  Read Firestore Library (getAll recipes)
      →  Aggregate Library (Code)  →  Respond Library  →  Recipe[]
```

1. Node **„Read Firestore Library"**: `YOUR_FIREBASE_PROJECT_ID` durch
   `code-a-cuisine-8fb95` ersetzen und dasselbe Firestore-Credential zuweisen
   wie bei „Save to Firestore".
2. Beim **Webhook Library**-Node unter Options → Allowed Origins (CORS) die
   Live-Domain eintragen (wie beim Generate-Webhook).
3. Nach dem Aktivieren zeigt n8n die URL `…/webhook/library`. Sie steht bereits
   als `n8nLibraryUrl` in `src/app/core/config/app-config.ts`.

Ist die URL leer oder der Aufruf schlägt fehl, fällt die App automatisch auf die
Mock-Rezepte zurück – die Bibliothek bleibt also immer funktionsfähig.
