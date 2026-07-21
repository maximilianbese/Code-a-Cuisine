import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';
import { GenerateRequest } from '../models/generate-request.model';
import { Recipe } from '../models/recipe.model';
import { LIBRARY_RECIPES } from '../data/library-recipes';
import { buildFallbackRecipes } from './fallback-recipe';

/** Recipes plus whether they came from the live backend or the demo fallback. */
export interface RecipeResult {
  recipes: Recipe[];
  /** True when n8n was unreachable and local demo data is being shown. */
  demo: boolean;
}

/**
 * Either shape the n8n webhooks may answer with: the generation webhook responds
 * with a bare array, the library webhook wraps it in `{ recipes: [...] }`.
 * Accepting both keeps the client working regardless of which node responds.
 */
type RecipePayload = Recipe[] | { recipes?: Recipe[] } | null;

/** Talks to the n8n webhooks, with a demo fallback when they are unset or fail. */
@Injectable({ providedIn: 'root' })
export class RecipeApiService {
  private readonly http = inject(HttpClient);

  /** Request generated recipes for the given ingredients and preferences. */
  generate(request: GenerateRequest): Observable<RecipeResult> {
    const url = APP_CONFIG.n8nWebhookUrl;
    const fallback = () => demo(buildFallbackRecipes(request));
    if (!url) return of(fallback());
    return this.http.post<RecipePayload>(url, request).pipe(
      map((res) => resolve(res, fallback)),
      catchError((error) => {
        // Handled + recovered, so this is a warning rather than an error.
        console.warn('Recipe generation failed, showing demo recipes.', error);
        return of(fallback());
      }),
    );
  }

  /** Fetch every stored recipe for the public library, with a demo fallback. */
  getLibrary(): Observable<RecipeResult> {
    const url = APP_CONFIG.n8nLibraryUrl;
    const fallback = () => demo(LIBRARY_RECIPES);
    if (!url) return of(fallback());
    return this.http.get<RecipePayload>(url).pipe(
      map((res) => resolve(res, fallback)),
      catchError((error) => {
        console.warn('Library fetch failed, showing demo recipes.', error);
        return of(fallback());
      }),
    );
  }
}

/** Use the backend recipes when it returned any, otherwise the demo fallback. */
function resolve(res: RecipePayload, fallback: () => RecipeResult): RecipeResult {
  const recipes = toRecipeList(res);
  return recipes.length ? live(recipes) : fallback();
}

/** Unwrap both supported response shapes into a plain recipe array. */
function toRecipeList(res: RecipePayload): Recipe[] {
  if (Array.isArray(res)) return res;
  return Array.isArray(res?.recipes) ? res.recipes : [];
}

/** Wrap recipes that came from the live backend. */
function live(recipes: Recipe[]): RecipeResult {
  return { recipes, demo: false };
}

/** Wrap recipes that came from the local demo data. */
function demo(recipes: Recipe[]): RecipeResult {
  return { recipes, demo: true };
}
