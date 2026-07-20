import { GenerateRequest } from '../models/generate-request.model';
import { Ingredient, formatAmount } from '../models/ingredient.model';
import { Preferences, TimeOption } from '../models/preferences.model';
import { Recipe, RecipeIngredient } from '../models/recipe.model';
import { RESULT_RECIPES } from './recipe-data';

/** Cooking-time bracket shown on the card, per selected time option. */
const TIME_LABEL: Record<TimeOption, string> = {
  quick: 'Quick', medium: 'Medium', complex: 'Complex',
};

/** Representative minutes for each cooking-time bracket. */
const TIME_MINUTES: Record<TimeOption, number> = { quick: 20, medium: 35, complex: 55 };

/** Diet labels matching the preference chips. */
const DIET_LABEL: Record<string, string> = {
  vegetarian: 'Vegetarian', vegan: 'Vegan', keto: 'Keto', none: 'No preferences',
};

/**
 * Demo recipes used when the n8n backend is unreachable. They are re-shaped to
 * the user's own request so portions, cooks and ingredients still match what
 * was entered — the earlier version always returned the same 2-portion pasta.
 */
export function buildFallbackRecipes(request: GenerateRequest): Recipe[] {
  return RESULT_RECIPES.map((recipe) => applyRequest(recipe, request));
}

/** Overlay a single seed recipe with the user's preferences and ingredients. */
function applyRequest(recipe: Recipe, request: GenerateRequest): Recipe {
  const prefs = request.preferences;
  return {
    ...recipe,
    ...timing(prefs),
    cooks: prefs.cooks,
    portions: prefs.portions,
    diet: DIET_LABEL[prefs.diet] ?? recipe.diet,
    cuisine: capitalise(prefs.cuisine),
    nutrition: recipe.nutrition,
    yourIngredients: toRecipeIngredients(request.ingredients, recipe.yourIngredients),
    steps: recipe.steps.map((step) => ({ ...step, chef: assignChef(step.order, prefs.cooks) })),
  };
}

/** Cooking-time label and duration derived from the selected bracket. */
function timing(prefs: Preferences): Pick<Recipe, 'timeLabel' | 'cookingTimeMin'> {
  return { timeLabel: TIME_LABEL[prefs.time], cookingTimeMin: TIME_MINUTES[prefs.time] };
}

/** Show what the user entered, falling back to the seed list when empty. */
function toRecipeIngredients(items: Ingredient[], seed: RecipeIngredient[]): RecipeIngredient[] {
  if (!items.length) return seed;
  return items.map((item) => ({ amount: formatAmount(item), name: item.name }));
}

/** Spread the steps evenly across the number of cooks the user chose. */
function assignChef(order: number, cooks: number): number {
  return ((order - 1) % Math.max(1, cooks)) + 1;
}

/** Turn a preference key such as "italian" into the label "Italian". */
function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
