import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';
import { GenerateRequest } from '../models/generate-request.model';
import { Recipe } from '../models/recipe.model';
import { RESULT_RECIPES } from './recipe-data';
import { buildFallbackRecipes } from './fallback-recipe';

/** Recipes plus whether they came from the live backend or the demo fallback. */
export interface RecipeResult {
  recipes: Recipe[];
  /** True when n8n was unreachable and local demo data is being shown. */
  demo: boolean;
}

/** Talks to the n8n webhooks, with a demo fallback when they are unset or fail. */
@Injectable({ providedIn: 'root' })
export class RecipeApiService {
  private readonly http = inject(HttpClient);

  /** Request generated recipes for the given ingredients and preferences. */
  generate(request: GenerateRequest): Observable<RecipeResult> {
    const url = APP_CONFIG.n8nWebhookUrl;
    const fallback = () => of(demo(buildFallbackRecipes(request)));
    if (!url) return fallback();
    return this.http.post<Recipe[]>(url, request).pipe(
      map((res) => (hasRecipes(res) ? live(res) : demo(buildFallbackRecipes(request)))),
      catchError((error) => {
        console.error('Recipe generation failed, showing demo recipes.', error);
        return fallback();
      }),
    );
  }

  /** Fetch every stored recipe for the public library, with a demo fallback. */
  getLibrary(): Observable<RecipeResult> {
    const url = APP_CONFIG.n8nLibraryUrl;
    if (!url) return of(demo(RESULT_RECIPES));
    return this.http.get<Recipe[]>(url).pipe(
      map((res) => (hasRecipes(res) ? live(res) : demo(RESULT_RECIPES))),
      catchError((error) => {
        console.error('Library fetch failed, showing demo recipes.', error);
        return of(demo(RESULT_RECIPES));
      }),
    );
  }
}

/** Whether the backend actually returned a usable recipe list. */
function hasRecipes(res: Recipe[] | null): res is Recipe[] {
  return Array.isArray(res) && res.length > 0;
}

/** Wrap recipes that came from the live backend. */
function live(recipes: Recipe[]): RecipeResult {
  return { recipes, demo: false };
}

/** Wrap recipes that came from the local demo data. */
function demo(recipes: Recipe[]): RecipeResult {
  return { recipes, demo: true };
}
