import { Injectable, signal } from '@angular/core';
import { CuisineCategory, Recipe } from '../models/recipe.model';
import { CUISINE_CATEGORIES, RESULT_RECIPES } from './recipe-data';

/** Holds the current recipes and cookbook data (seeded with mock data). */
@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly _results = signal<Recipe[]>(RESULT_RECIPES);
  private readonly _demo = signal(false);

  /** True while the shown recipes come from local demo data, not from n8n. */
  readonly isDemo = this._demo.asReadonly();

  /** The most recently generated recipe suggestions. */
  getResults(): Recipe[] {
    return this._results();
  }

  /** Replace the current results (e.g. after a generation run). */
  setResults(recipes: Recipe[], demo = false): void {
    const list = Array.isArray(recipes) ? recipes : [];
    this._results.set(list.length ? list : RESULT_RECIPES);
    this._demo.set(demo || !list.length);
  }

  /** Look up a single recipe by its id. */
  getById(id: string): Recipe | undefined {
    return this._results().find((recipe) => recipe.id === id);
  }

  /** Seed recipes used as a fallback until the live library resolves. */
  getAll(): Recipe[] {
    return this._results();
  }

  /** Cuisine categories used to group the cookbook library. */
  getCategories(): CuisineCategory[] {
    return CUISINE_CATEGORIES;
  }
}
