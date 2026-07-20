/** A single pantry ingredient entered by the user. */
export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

/** Units offered in the serving-size dropdown. */
export const INGREDIENT_UNITS = ['gram', 'kg', 'ml', 'litre', 'piece', 'tbsp', 'tsp'] as const;

/** Any one of the units offered in the serving-size dropdown. */
export type IngredientUnit = (typeof INGREDIENT_UNITS)[number];

/** Smallest accepted amount for every unit. */
export const MIN_AMOUNT = 1;

/**
 * Largest amount a home cook would plausibly enter per unit. Anything above is
 * rejected instead of being stored, which also keeps the list free of the
 * unreadable "5555555555555555000kg" strings that unbounded input produced.
 */
export const UNIT_MAX_AMOUNT: Record<string, number> = {
  gram: 5000, kg: 20, ml: 5000, litre: 20, piece: 50, tbsp: 50, tsp: 50,
};

/** Abbreviations used in the ingredient list. */
const SHORT_UNIT: Record<string, string> = {
  gram: 'g', kg: 'kg', ml: 'ml', litre: 'l', tbsp: 'tbsp', tsp: 'tsp',
};

/** Upper bound for a unit, falling back to the strictest limit for unknowns. */
export function maxAmountFor(unit: string): number {
  return UNIT_MAX_AMOUNT[unit] ?? MIN_AMOUNT;
}

/** Whether the amount is a whole number inside the unit's accepted range. */
export function isValidAmount(amount: number, unit: string): boolean {
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) return false;
  return amount >= MIN_AMOUNT && amount <= maxAmountFor(unit);
}

/** Restrict an amount to the accepted range for its unit. */
export function clampAmount(amount: number, unit: string): number {
  const rounded = Math.round(Number(amount) || MIN_AMOUNT);
  return Math.min(maxAmountFor(unit), Math.max(MIN_AMOUNT, rounded));
}

/** Render an ingredient amount the way the Figma list does ("150g", "1"). */
export function formatAmount(item: Ingredient): string {
  const suffix = item.unit === 'piece' ? '' : SHORT_UNIT[item.unit] ?? item.unit;
  return `${item.amount}${suffix}`;
}
