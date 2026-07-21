import type { AppConfig } from '../app/core/config/app-config';

/**
 * Production configuration.
 *
 * Never put a localhost URL here: in a visitor's browser that resolves to their
 * own machine, and on an HTTPS page the request is blocked as mixed content
 * before it is even sent. Local development uses environment.development.ts,
 * which `ng serve` substitutes automatically.
 *
 * The generation webhook runs on a self-hosted n8n reached through a Tailscale
 * Funnel. The library webhook stays empty on purpose — its Firestore node has
 * no credential yet, so an empty value makes RecipeApiService serve the bundled
 * recipes straight away instead of firing a request that is bound to fail.
 */
export const environment: AppConfig = {
  production: true,
  n8nWebhookUrl: 'https://maxi.tailcb54e7.ts.net/webhook/generate-recipes',
  n8nLibraryUrl: '',
};
