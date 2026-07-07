import { Injectable, computed, signal } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { Preferences, defaultPreferences } from '../models/preferences.model';

/** Holds the multi-step generation state (ingredients + preferences). */
@Injectable({ providedIn: 'root' })
export class RecipeFlowService {
  readonly ingredients = signal<Ingredient[]>([]);
  readonly preferences = signal<Preferences>(defaultPreferences());
  readonly hasIngredients = computed(() => this.ingredients().length > 0);

  addIngredient(item: Ingredient): void {
    this.ingredients.update((list) => [...list, item]);
  }

  removeIngredient(index: number): void {
    this.ingredients.update((list) => list.filter((_, i) => i !== index));
  }

  updatePreferences(patch: Partial<Preferences>): void {
    this.preferences.update((current) => ({ ...current, ...patch }));
  }

  reset(): void {
    this.ingredients.set([]);
    this.preferences.set(defaultPreferences());
  }
}
