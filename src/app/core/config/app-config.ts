/** Central runtime configuration for external integrations. */
export interface AppConfig {
  /** n8n webhook that generates recipes from the request payload. Empty = use mock data. */
  n8nWebhookUrl: string;
}

/** Active configuration. Set the n8n webhook URL to enable live generation. */
export const APP_CONFIG: AppConfig = {
  n8nWebhookUrl: 'https://maximilianbese.app.n8n.cloud/webhook/generate-recipesng',
};
