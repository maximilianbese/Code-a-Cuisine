import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';

/**
 * Persists generated recipes so they appear in the public cookbook library.
 * TODO(firebase): replace the local stub with a Firestore write once configured.
 */
@Injectable({ providedIn: 'root' })
export class RecipePersistenceService {
  /** Save the generated recipes (currently a no-op stub). */
  save(recipes: Recipe[]): void {
    console.debug('Persisting recipes (stub):', recipes.map((recipe) => recipe.id));
  }
}
