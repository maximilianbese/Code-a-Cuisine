import { Injectable, signal } from '@angular/core';
import { Recipe } from '../models/recipe.model';

/** localStorage key holding every recipe this browser has generated. */
const STORE_KEY = 'cac-generated';
/** Upper bound so a heavy user cannot exhaust the storage quota. */
const MAX_STORED = 60;

/**
 * Keeps generated recipes visible in the cookbook.
 *
 * n8n writes every generation to Firestore, but that write is asynchronous and
 * the library webhook only answers once its Firestore credential is configured.
 * Mirroring the recipes locally means the user always finds their own creations
 * again; recipes from other people still arrive through the library fetch.
 */
@Injectable({ providedIn: 'root' })
export class RecipePersistenceService {
  private readonly _saved = signal<Recipe[]>(readStore());

  /** Every recipe generated in this browser, newest first. */
  readonly saved = this._saved.asReadonly();

  /** Store the generated recipes, newest first and without duplicates. */
  save(recipes: Recipe[]): void {
    if (!recipes.length) return;
    this._saved.update((current) => mergeById([...recipes, ...current]).slice(0, MAX_STORED));
    writeStore(this._saved());
  }
}

/** Merge recipe lists, keeping the first occurrence of each id. */
export function mergeById(recipes: Recipe[]): Recipe[] {
  const byId = new Map<string, Recipe>();
  for (const recipe of recipes) {
    if (!byId.has(recipe.id)) byId.set(recipe.id, recipe);
  }
  return [...byId.values()];
}

/** Read the stored recipes, ignoring anything malformed. */
function readStore(): Recipe[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]') as Recipe[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Persist the recipes; a disabled or full storage is not worth failing on. */
function writeStore(recipes: Recipe[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(recipes));
  } catch {
    /* storage disabled or full – the in-memory signal still works */
  }
}
