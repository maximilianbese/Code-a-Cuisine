/** Macro + calorie breakdown shown in the recipe detail view. */
export interface NutritionFacts {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

/** One preparation step, assigned to a specific cook ("chef"). */
export interface RecipeStep {
  order: number;
  title: string;
  chef: number;
  text: string;
}

/** Amount + name pair used for ingredient lists. */
export interface RecipeIngredient {
  amount: string;
  name: string;
}

/** A full generated recipe, also stored in the cookbook library. */
export interface Recipe {
  id: string;
  index: number;
  title: string;
  cookingTimeMin: number;
  cuisine: string;
  timeLabel: string;
  diet: string;
  likes: number;
  cooks: number;
  /** Number of servings the recipe (and its per-portion nutrition) is based on. */
  portions: number;
  nutrition: NutritionFacts;
  yourIngredients: RecipeIngredient[];
  extraIngredients: RecipeIngredient[];
  steps: RecipeStep[];
}

/** A cookbook cuisine category tile. */
export interface CuisineCategory {
  key: string;
  label: string;
  emoji: string;
}
