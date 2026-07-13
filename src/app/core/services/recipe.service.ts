import { Injectable, signal } from '@angular/core';
import { CuisineCategory, Recipe } from '../models/recipe.model';
import { CUISINE_CATEGORIES, RESULT_RECIPES } from './recipe-data';

/** Holds the current recipes and cookbook data (seeded with mock data). */
@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly _results = signal<Recipe[]>(RESULT_RECIPES);

  /** The most recently generated recipe suggestions. */
  getResults(): Recipe[] {
    return this._results();
  }

  /** Replace the current results (e.g. after a generation run). */
  setResults(recipes: Recipe[]): void {
    this._results.set(recipes.length ? recipes : RESULT_RECIPES);
  }

  /** Look up a single recipe by its id. */
  getById(id: string): Recipe | undefined {
    return this._results().find((recipe) => recipe.id === id);
  }

  /** Every recipe available for the public library (later backed by Firestore). */
  getAll(): Recipe[] {
    return this._results();
  }

  /** Recipes sorted by likes, descending, for the cookbook highlights. */
  getMostLiked(): Recipe[] {
    return [...this._results()].sort((a, b) => b.likes - a.likes);
  }

  /** Cuisine categories used to group the cookbook library. */
  getCategories(): CuisineCategory[] {
    return CUISINE_CATEGORIES;
  }
}
