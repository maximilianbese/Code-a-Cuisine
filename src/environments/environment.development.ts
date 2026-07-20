import { AppConfig } from '../app/core/config/app-config';

/** Local development configuration – talks to the n8n container on localhost. */
export const environment: AppConfig = {
  production: false,
  n8nWebhookUrl: 'http://localhost:5678/webhook/generate-recipes',
  n8nLibraryUrl: 'http://localhost:5678/webhook/library',
};
