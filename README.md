# Code à Cuisine

AI-powered recipe generator. Enter the ingredients you already have, pick a few
preferences, and get matching recipe suggestions — helping hobby cooks and
flatmates cut food waste while eating varied and healthy meals. All generated
recipes are available in the public cookbook library.

**Repository:** _<GitHub-Link hier eintragen>_

## Tech stack

- **Angular** (standalone components, signals, lazy-loaded routes)
- **SCSS** with a central design-token system (`src/styles.scss`)
- **n8n** for AI recipe generation _(wird noch angebunden)_
- **Firebase** for storing generated recipes _(wird noch angebunden)_

## Getting started

```bash
npm install
ng serve      # → http://localhost:4200
ng build      # production build
ng test       # unit tests (Vitest)
```

## Features

- **Ingredient input** with amount, unit, edit and delete (User Stories 1–2)
- **Preferences**: portions, cooks, cooking time, cuisine and diet (User Stories 3–6)
- **Quantity validation** with an "Ups! Not quite enough…" dialog when the
  entered amounts don't cover the chosen servings
- **Loading interstitial** that bridges the generation wait
- **Results**: three recipe suggestions (User Story 7)
- **Recipe detail**: ingredients, chef-assigned steps and nutrition facts
  (User Stories 8–10)
- **Cookbook library** grouped by cuisine, with most-liked highlights
  (User Stories 12–14)
- **Impressum** and a custom **404** page
- Fully **responsive** (desktop / tablet / smartphone) with touch-friendly
  controls; font sizes follow the ≥16px / ≥14px standard

## Project structure

```
src/app/
├─ core/
│  ├─ models/        # typed interfaces (ingredient, preferences, recipe)
│  └─ services/      # recipe data + multi-step flow state
├─ features/         # one folder per screen (home, generate, preferences, …)
└─ shared/           # reusable UI (logo, dialog)
```

## Conventions

- Every function is documented with JSDoc.
- Functions stay within ~14 lines and files under 400 lines.
- No duplicated logic; shared styles live in `src/styles.scss`.

## Open items (backend)

The recipe data is currently mocked in `recipe.service.ts`. Still to wire up
together: the **n8n** generation workflow (with validation, error handling,
logging and IP-based rate limiting), **Firebase** persistence, and the HTTP
call that replaces the mock in the loading step.
