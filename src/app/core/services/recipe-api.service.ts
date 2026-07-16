import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';
import { GenerateRequest } from '../models/generate-request.model';
import { Recipe } from '../models/recipe.model';
import { RESULT_RECIPES } from './recipe-data';

/** Coerce any backend payload (incl. null/empty) to a non-empty recipe list. */
function orFallback(res: Recipe[] | null): Recipe[] {
  return Array.isArray(res) && res.length ? res : RESULT_RECIPES;
}

/** Talks to the n8n webhooks, with a mock fallback when they are unset or fail. */
@Injectable({ providedIn: 'root' })
export class RecipeApiService {
  private readonly http = inject(HttpClient);

  /** Request generated recipes for the given ingredients and preferences. */
  generate(request: GenerateRequest): Observable<Recipe[]> {
    const url = APP_CONFIG.n8nWebhookUrl;
    if (!url) return of(RESULT_RECIPES);
    return this.http.post<Recipe[]>(url, request).pipe(
      map(orFallback),
      catchError((error) => {
        console.error('Recipe generation failed, using fallback data.', error);
        return of(RESULT_RECIPES);
      }),
    );
  }

  /** Fetch every stored recipe for the public library, with a mock fallback. */
  getLibrary(): Observable<Recipe[]> {
    const url = APP_CONFIG.n8nLibraryUrl;
    if (!url) return of(RESULT_RECIPES);
    return this.http.get<Recipe[]>(url).pipe(
      map(orFallback),
      catchError((error) => {
        console.error('Library fetch failed, using fallback data.', error);
        return of(RESULT_RECIPES);
      }),
    );
  }
}
