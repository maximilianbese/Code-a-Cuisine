import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';
import { RecipeService } from '../../core/services/recipe.service';
import { RecipeApiService } from '../../core/services/recipe-api.service';
import { mergeById, RecipePersistenceService } from '../../core/services/recipe-persistence.service';
import { Recipe } from '../../core/models/recipe.model';

/** Highlights shown in the "most liked" row. */
const HIGHLIGHT_COUNT = 10;

/**
 * Cookbook landing page: intro, the most liked recipes and one tile per cuisine.
 * The full listing lives on /cookbook/:cuisine, matching the design.
 */
@Component({
  selector: 'app-cookbook',
  imports: [RouterLink, Logo],
  templateUrl: './cookbook.html',
  styleUrl: './cookbook.scss',
})
export class Cookbook {
  private readonly service = inject(RecipeService);
  private readonly api = inject(RecipeApiService);
  private readonly store = inject(RecipePersistenceService);
  /** Cuisine tiles linking to the per-cuisine pages. */
  readonly categories = this.service.getCategories();

  /** Library recipes from the backend; mock data until the live fetch resolves. */
  private readonly fetched = signal<Recipe[]>(this.service.getAll());

  /**
   * Load the backend library once the view is created and merge it with the
   * recipes shipped with the app, so the cookbook always shows the full
   * catalogue (live generations first) instead of replacing the shipped set —
   * that would otherwise leave the library nearly empty whenever the backend
   * holds only a handful of recipes.
   */
  constructor() {
    this.api.getLibrary().subscribe((result) =>
      this.fetched.set(mergeById([...result.recipes, ...this.service.getAll()])),
    );
  }

  /**
   * Everything the cookbook knows about: recipes generated in this browser come
   * first, so a fresh creation is visible immediately even before the backend
   * library has picked it up.
   */
  readonly all = computed(() => mergeById([...this.store.saved(), ...this.fetched()]));

  /** The best-liked recipes, capped so the highlight row stays scannable. */
  readonly mostLiked = computed(() =>
    [...this.all()].sort((a, b) => b.likes - a.likes).slice(0, HIGHLIGHT_COUNT),
  );

  /**
   * Turn a vertical mouse wheel into horizontal scrolling on the highlight row,
   * so it can be browsed with an ordinary wheel and not just a trackpad. A wheel
   * that is already scrolling sideways is left untouched.
   */
  onWheel(event: WheelEvent): void {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    (event.currentTarget as HTMLElement).scrollLeft += event.deltaY;
  }
}
