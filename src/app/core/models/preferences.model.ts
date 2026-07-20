/** User cooking preferences captured in step 2. */
export interface Preferences {
  portions: number;
  cooks: number;
  time: TimeOption;
  cuisine: CuisineOption;
  diet: DietOption;
}

/** Cooking-time bracket: up to 20min, 25-45min or over 45min. */
export type TimeOption = 'quick' | 'medium' | 'complex';

/** Cuisine style the generated recipe should follow. */
export type CuisineOption =
  | 'german' | 'italian' | 'indian' | 'japanese' | 'gourmet' | 'fusion';

/** Dietary restriction applied to the generated recipe. */
export type DietOption = 'vegetarian' | 'vegan' | 'keto' | 'none';

/** Factory for the default preference selection (2 portions, 1 cook). */
export function defaultPreferences(): Preferences {
  return { portions: 2, cooks: 1, time: 'quick', cuisine: 'italian', diet: 'vegetarian' };
}
