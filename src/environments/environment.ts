import type { AppConfig } from '../app/core/config/app-config';

/**
 * Production configuration. Replace the placeholders with the public n8n
 * endpoints before deploying — a localhost URL is unreachable from the
 * deployed site and silently degrades the app to demo data.
 */
export const environment: AppConfig = {
  production: true,
  n8nWebhookUrl: 'https://n8n.code-a-cuisine.example/webhook/generate-recipes',
  n8nLibraryUrl: 'https://n8n.code-a-cuisine.example/webhook/library',
};
