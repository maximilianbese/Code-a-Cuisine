import { Injectable, signal } from '@angular/core';
import { CuisineCategory, Recipe } from '../models/recipe.model';
import { CUISINE_CATEGORIES, RESULT_RECIPES } from './recipe-data';

/** sessionStorage key holding the latest generation so a reload survives it. */
const CACHE_KEY = 'cac-results';

/** Shape cached in sessionStorage alongside the recipes. */
interface CachedResults {
  recipes: Recipe[];
  demo: boolean;
}

/** Holds the current recipes and cookbook data (seeded with mock data). */
@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly _results = signal<Recipe[]>(RESULT_RECIPES);
  private readonly _demo = signal(false);

  /** True while the shown recipes come from local demo data, not from n8n. */
  readonly isDemo = this._demo.asReadonly();

  /** Restore the last generation so reloading /results keeps showing it. */
  constructor() {
    const cached = readCache();
    if (cached) this.apply(cached.recipes, cached.demo);
  }

  /** The most recently generated recipe suggestions. */
  getResults(): Recipe[] {
    return this._results();
  }

  /** Replace the current results (e.g. after a generation run) and cache them. */
  setResults(recipes: Recipe[], demo = false): void {
    const list = Array.isArray(recipes) ? recipes : [];
    this.apply(list.length ? list : RESULT_RECIPES, demo || !list.length);
    writeCache({ recipes: this._results(), demo: this._demo() });
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

  /** Write both signals in one place so they never drift apart. */
  private apply(recipes: Recipe[], demo: boolean): void {
    this._results.set(recipes);
    this._demo.set(demo);
  }
}

/** Read the cached generation, ignoring anything malformed. */
function readCache(): CachedResults | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CachedResults) : null;
    return parsed?.recipes?.length ? parsed : null;
  } catch {
    return null;
  }
}

/** Cache the current generation; a full storage quota is not worth failing on. */
function writeCache(value: CachedResults): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(value));
  } catch {
    /* storage disabled or full – the in-memory state still works */
  }
}
