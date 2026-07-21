import { Recipe, RecipeIngredient, RecipeStep } from '../models/recipe.model';

/** A preparation step as authored in the seed data: title first, then body. */
export type SeedStep = readonly [title: string, text: string];

/**
 * Authoring shape for a seed recipe. Everything that can be derived — the
 * index, the time label, the chef rotation — is left out on purpose so the
 * literals below stay readable and cannot drift out of sync.
 */
export interface RecipeSeed {
  id: string;
  title: string;
  cuisine: string;
  cookingTimeMin: number;
  diet: string;
  likes: number;
  nutrition: Recipe['nutrition'];
  yours: readonly RecipeIngredient[];
  extras: readonly RecipeIngredient[];
  steps: readonly SeedStep[];
}

/** Default number of cooks and servings every seed recipe is written for. */
const SEED_COOKS = 2;
const SEED_PORTIONS = 2;

/** Convert a list of seeds into full recipes, numbering them from one. */
export function toRecipes(seeds: readonly RecipeSeed[]): Recipe[] {
  return seeds.map((seed, position) => toRecipe(seed, position + 1));
}

/** Expand a single seed into the full Recipe shape used across the app. */
function toRecipe(seed: RecipeSeed, index: number): Recipe {
  const { yours, extras, steps, ...rest } = seed;
  return {
    ...rest,
    index,
    timeLabel: timeLabelFor(rest.cookingTimeMin),
    cooks: SEED_COOKS,
    portions: SEED_PORTIONS,
    yourIngredients: [...yours],
    extraIngredients: [...extras],
    steps: steps.map(toStep),
  };
}

/** Bucket a cooking time into the label shown on the results chips. */
function timeLabelFor(minutes: number): string {
  if (minutes <= 20) return 'Quick';
  return minutes <= 40 ? 'Medium' : 'Slow';
}

/** Number a step and hand it to one of the two cooks, alternating. */
function toStep([title, text]: SeedStep, position: number): RecipeStep {
  return { order: position + 1, title, text, chef: (position % SEED_COOKS) + 1 };
}
