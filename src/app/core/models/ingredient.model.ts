/** A single pantry ingredient entered by the user. */
export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

/** Units offered in the serving-size dropdown. */
export const INGREDIENT_UNITS = ['gram', 'kg', 'ml', 'litre', 'piece', 'tbsp', 'tsp'] as const;
