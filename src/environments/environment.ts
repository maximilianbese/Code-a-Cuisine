import type { AppConfig } from '../app/core/config/app-config';

/**
 * Production configuration.
 *
 * Never put a localhost URL here: in a visitor's browser that resolves to their
 * own machine, and on an HTTPS page the request is blocked as mixed content
 * before it is even sent. Local development uses environment.development.ts,
 * which `ng serve` substitutes automatically.
 *
 * Both webhooks run on a self-hosted n8n reached through a Tailscale Funnel.
 * The library URL has to be set for shared recipes to show up in the cookbook —
 * leaving it empty pinned every visitor to the bundled demo list. Until the
 * Firestore credential is in place the request simply fails and
 * RecipeApiService falls back to the bundled recipes, so wiring it early is
 * safe and the cookbook starts working the moment the credential lands.
 */
export const environment: AppConfig = {
  production: true,
  n8nWebhookUrl: 'https://maxi.tailcb54e7.ts.net/webhook/generate-recipes',
  n8nLibraryUrl: 'https://maxi.tailcb54e7.ts.net/webhook/library',
};
