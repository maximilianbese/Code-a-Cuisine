import { environment } from '../../../environments/environment';

/** Central runtime configuration for external integrations. */
export interface AppConfig {
  /** True in production builds. */
  production: boolean;
  /** n8n webhook that generates recipes from the request payload. Empty = use mock data. */
  n8nWebhookUrl: string;
  /** n8n webhook that returns every stored recipe for the library. Empty = use mock data. */
  n8nLibraryUrl: string;
}

/**
 * Active configuration, supplied per build target via the `fileReplacements`
 * entry in angular.json. Never hardcode endpoints outside `src/environments`.
 */
export const APP_CONFIG: AppConfig = environment;
