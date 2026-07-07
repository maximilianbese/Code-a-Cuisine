/** User cooking preferences captured in step 2. */
export interface Preferences {
  portions: number;
  cooks: number;
  time: TimeOption;
  cuisine: CuisineOption;
  diet: DietOption;
}

export type TimeOption = 'quick' | 'medium' | 'complex';
export type CuisineOption =
  | 'german' | 'italian' | 'indian' | 'japanese' | 'gourmet' | 'fusion';
export type DietOption = 'vegetarian' | 'vegan' | 'keto' | 'none';

/** Factory for the default preference selection (2 portions, 1 cook). */
export function defaultPreferences(): Preferences {
  return { portions: 2, cooks: 1, time: 'quick', cuisine: 'italian', diet: 'vegetarian' };
}
