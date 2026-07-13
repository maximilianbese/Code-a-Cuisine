import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';
import { RecipeService } from '../../core/services/recipe.service';

/** Recipes shown per page in the library grid. */
const PAGE_SIZE = 20;

/** Public recipe library with cuisine filtering and pagination. */
@Component({
  selector: 'app-cookbook',
  imports: [RouterLink, Logo],
  templateUrl: './cookbook.html',
  styleUrl: './cookbook.scss',
})
export class Cookbook {
  private readonly service = inject(RecipeService);
  private readonly all = this.service.getAll();
  readonly mostLiked = this.service.getMostLiked();
  readonly categories = this.service.getCategories();

  /** Currently selected cuisine key, or 'all' for no filter. */
  readonly selected = signal<string>('all');
  /** Active page number (1-based). */
  readonly page = signal(1);

  /** Recipes matching the selected cuisine filter. */
  readonly filtered = computed(() => {
    const key = this.selected();
    if (key === 'all') return this.all;
    return this.all.filter((recipe) => recipe.cuisine.toLowerCase() === key);
  });

  /** Total number of pages for the filtered list. */
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));

  /** Recipes visible on the current page. */
  readonly pageItems = computed(() => {
    const start = (this.page() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  /** Apply a cuisine filter and jump back to the first page. */
  selectCuisine(key: string): void {
    this.selected.set(this.selected() === key ? 'all' : key);
    this.page.set(1);
  }

  /** Move to the given page, clamped to the valid range. */
  goToPage(target: number): void {
    this.page.set(Math.min(this.pageCount(), Math.max(1, target)));
  }
}
