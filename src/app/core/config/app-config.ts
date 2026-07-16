/** Central runtime configuration for external integrations. */
export interface AppConfig {
  /** n8n webhook that generates recipes from the request payload. Empty = use mock data. */
  n8nWebhookUrl: string;
  /** n8n webhook that returns every stored recipe for the library. Empty = use mock data. */
  n8nLibraryUrl: string;
}

/** Active configuration. Set the n8n webhook URLs to enable live data. */
export const APP_CONFIG: AppConfig = {
  n8nWebhookUrl: 'http://localhost:5678/webhook/generate-recipes',
  n8nLibraryUrl: 'http://localhost:5678/webhook/library',
};
