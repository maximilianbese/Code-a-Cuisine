import { Injectable, computed, signal } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { Preferences, defaultPreferences } from '../models/preferences.model';

/** Approximate gram equivalents so mixed units can be summed for validation. */
const UNIT_TO_GRAMS: Record<string, number> = {
  gram: 1, kg: 1000, ml: 1, litre: 1000, piece: 80, tbsp: 15, tsp: 5,
};
/** Minimum gram equivalent required per portion (placeholder until n8n validates). */
const MIN_GRAMS_PER_PORTION = 100;

/** Holds the multi-step generation state (ingredients + preferences). */
@Injectable({ providedIn: 'root' })
export class RecipeFlowService {
  readonly ingredients = signal<Ingredient[]>([]);
  readonly preferences = signal<Preferences>(defaultPreferences());
  readonly hasIngredients = computed(() => this.ingredients().length > 0);

  /** Add an ingredient to the top of the list (most recent first). */
  addIngredient(item: Ingredient): void {
    this.ingredients.update((list) => [item, ...list]);
  }

  /** Remove the ingredient at the given index. */
  removeIngredient(index: number): void {
    this.ingredients.update((list) => list.filter((_, i) => i !== index));
  }

  /** Merge a partial preference change into the current selection. */
  updatePreferences(patch: Partial<Preferences>): void {
    this.preferences.update((current) => ({ ...current, ...patch }));
  }

  /** Whether the entered amounts roughly cover the chosen number of portions. */
  hasSufficientQuantities(): boolean {
    const total = this.ingredients().reduce((sum, item) => sum + toGrams(item), 0);
    return total >= this.preferences().portions * MIN_GRAMS_PER_PORTION;
  }

  /** Clear ingredients and preferences back to their defaults. */
  reset(): void {
    this.ingredients.set([]);
    this.preferences.set(defaultPreferences());
  }
}

/** Convert an ingredient amount to an approximate gram equivalent. */
function toGrams(item: Ingredient): number {
  return item.amount * (UNIT_TO_GRAMS[item.unit] ?? 1);
}
