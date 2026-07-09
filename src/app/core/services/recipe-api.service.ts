import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';
import { GenerateRequest } from '../models/generate-request.model';
import { Recipe } from '../models/recipe.model';
import { RESULT_RECIPES } from './recipe-data';

/** Talks to the n8n generation webhook, with a mock fallback until it is wired up. */
@Injectable({ providedIn: 'root' })
export class RecipeApiService {
  private readonly http = inject(HttpClient);

  /** Request generated recipes for the given ingredients and preferences. */
  generate(request: GenerateRequest): Observable<Recipe[]> {
    const url = APP_CONFIG.n8nWebhookUrl;
    if (!url) return of(RESULT_RECIPES);
    return this.http.post<Recipe[]>(url, request).pipe(
      catchError((error) => {
        console.error('Recipe generation failed, using fallback data.', error);
        return of(RESULT_RECIPES);
      }),
    );
  }
}
