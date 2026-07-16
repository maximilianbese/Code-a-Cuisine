# Code à Cuisine

AI-powered recipe generator. Enter the ingredients you already have, pick a few
preferences, and get matching recipe suggestions — helping hobby cooks and
flatmates cut food waste while eating varied and healthy meals. All generated
recipes are available in the public cookbook library.

**Repository:** https://github.com/maximilianbese/Code-a-Cuisine

## Tech stack

- **Angular** (standalone components, signals, lazy-loaded routes), built as a
  static SPA for simple, always-on hosting
- **SCSS** with a central design-token system (`src/styles.scss`)
- **n8n** for AI recipe generation (Google Gemini) — see `N8N-ORACLE-SETUP.md`
- **Firebase Firestore** for storing generated recipes — see `n8n/N8N-SETUP.md`

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
- **Recipe detail**: per-cook to-do split and nutrition per portion **and** total
  with macro percentages (User Stories 9–10)
- **Daily quota**: transparent per-day generation limit in the UI, enforced
  IP-based in n8n (User Story 11)
- **Cookbook library**: all recipes with cuisine filtering and pagination,
  plus most-liked highlights (User Stories 12–14)
- **Impressum** page (`/impressum`) and a custom **404** page
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
- Functions stay wit