import { Injectable } from '@angular/core';
import { CuisineCategory, Recipe } from '../models/recipe.model';
import { CUISINE_CATEGORIES, RESULT_RECIPES } from './recipe-data';

/** Provides recipes and cookbook data (mocked until n8n is wired in). */
@Injectable({ providedIn: 'root' })
export class RecipeService {
  getResults(): Recipe[] {
    return RESULT_RECIPES;
  }

  getById(id: string): Recipe | undefined {
    return RESULT_RECIPES.find((recipe) => recipe.id === id);
  }

  getMostLiked(): Recipe[] {
    return [...RESULT_RECIPES].sort((a, b) => b.likes - a.likes);
  }

  getCategories(): CuisineCategory[] {
    return CUISINE_CATEGORIES;
  }
}
