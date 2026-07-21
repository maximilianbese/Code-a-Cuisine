import { Ingredient } from './ingredient.model';
import { Preferences } from './preferences.model';

/**
 * Language the generated recipe text must be written in.
 *
 * Without this the model mirrors whatever language the ingredients were typed
 * in, so German input produced German recipe titles inside an English UI. The
 * single source of truth is the `lang` attribute in index.html — change both
 * together when the app is localised.
 */
export const RECIPE_LANGUAGE = 'English';

/** JSON payload sent to n8n to request recipe generation. */
export interface GenerateRequest {
  ingredients: Ingredient[];
  preferences: Preferences;
  /** Target language for every human-readable field in the response. */
  language: string;
}
