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
- **n8n** for AI recipe generation (Google Gemini) — see
  [Setup & deployment](#setup--deployment)
- **Firebase Firestore** for storing generated recipes — see
  [`n8n/N8N-SETUP.md`](n8n/N8N-SETUP.md)

## Getting started

```bash
npm install
ng serve      # → http://localhost:4200
ng build      # production build → dist/
ng test       # unit tests (Vitest)
```

`ng serve` runs the frontend against the hosted webhooks configured in
`src/app/core/config/app-config.ts`, so the cookbook and (when n8n is reachable)
recipe generation work without any local backend. To run the whole stack
yourself, follow the setup and deployment guides below.

## Setup & deployment

Everything needed to run and ship the app is documented — start here instead of
digging through the repo:

| Topic | Guide |
| --- | --- |
| **Deploy the frontend** (static build → Netcup) | [`NETCUP-DEPLOY.md`](NETCUP-DEPLOY.md) |
| **General deployment notes** | [`DEPLOY.md`](DEPLOY.md) |
| **n8n workflow + Firestore setup** | [`n8n/N8N-SETUP.md`](n8n/N8N-SETUP.md) |
| **Run n8n locally** (Docker) | [`n8n/LOCAL-N8N.md`](n8n/LOCAL-N8N.md) |
| **Host n8n publicly** (Oracle Cloud) | [`N8N-ORACLE-SETUP.md`](N8N-ORACLE-SETUP.md) |
| **Expose n8n for remote generation** | [`n8n/PUBLIC-ACCESS.md`](n8n/PUBLIC-ACCESS.md) |
| **Workflow rework rationale + import steps** | [`n8n/N8N-REWORK-CHANGELOG.md`](n8n/N8N-REWORK-CHANGELOG.md) |
| **Original workflow design plan** | [`docs/n8n-workflow-plan.md`](docs/n8n-workflow-plan.md) |
| **Delivery status vs. the checklist** | [`CHECKLIST-STATUS.md`](CHECKLIST-STATUS.md) |

**n8n workflow to import:** there is exactly one workflow file —
[`n8n/code-a-cuisine-recipe-generation.json`](n8n/code-a-cuisine-recipe-generation.json)
(agent-centric, 16 nodes). Import it, reconnect the Gemini and Firestore
credentials, and set the Firestore `projectId`. Details are in the setup guide
and the rework changelog.

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
- Functions stay within 14 lines; no source file exceeds 400 lines.
- No duplicated logic — shared behaviour lives in `core/` services and utilities.
- Clipping is applied to the element that actually overflows, never blanket-applied
  to the document root or app shell.