import { Ingredient } from './ingredient.model';
import { Preferences } from './preferences.model';

/** JSON payload sent to n8n to request recipe generation. */
export interface GenerateRequest {
  ingredients: Ingredient[];
  preferences: Preferences;
}
