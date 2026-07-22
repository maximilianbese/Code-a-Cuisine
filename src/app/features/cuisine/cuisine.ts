import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Logo } from '../../shared/logo/logo';
import { RecipeService } from '../../core/services/recipe.service';
import { RecipeApiService } from '../../core/services/recipe-api.service';
import { mergeById, RecipePersistenceService } from '../../core/services/recipe-persistence.service';
import { pageTokens } from '../../core/utils/pagination';
import { dietLabel } from '../../core/utils/recipe-labels';
import { Recipe } from '../../core/models/recipe.model';

/** Recipes listed per page, matching the design's 15-row list. */
const PAGE_SIZE = 15;

/** Cuisines that ship an illustrated banner strip under /images. */
const BANNER_ART = new Set(['italian']);

/** All recipes of a single cuisine, as its own page ("IT recipes" in Figma). */
@Component({
  selector: 'app-cuisine',
  imports: [RouterLink, Logo],
  templateUrl: './cuisine.html',
  styleUrl: './cuisine.scss',
})
export class CuisinePage {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RecipeService);
  private readonly api = inject(RecipeApiService);
  private readonly store = inject(RecipePersistenceService);

  /** Cuisine key taken from the route, kept in sync when the param changes. */
  private readonly key = toSignal(
    this.route.paramMap.pipe(map((params) => (params.get('cuisine') ?? '').toLowerCase())),
    { initialValue: '' },
  );

  /** Library recipes from the backend; mock data until the live fetch resolves. */
  private readonly fetched = signal<Recipe[]>(this.service.getAll());
  /** Active page number (1-based). */
  readonly page = signal(1);

  /**
   * Load the backend library once the view is created and merge it with the
   * recipes shipped with the app (live generations first), so a cuisine always
   * lists its full catalogue and the pager stays testable even when the backend
   * holds only a few recipes.
   */
  constructor() {
    this.api.getLibrary().subscribe((result) =>
      this.fetched.set(mergeById([...result.recipes, ...this.service.getAll()])),
    );
  }

  /** The category tile this page belongs to, if the key is a known cuisine. */
  readonly category = computed(() =>
    this.service.getCategories().find((cat) => cat.key === this.key()),
  );

  /** Heading for the page, falling back to the raw key for unknown cuisines. */
  readonly title = computed(() => this.category()?.label ?? 'Recipes');

  /** Illustrated banner strip for this cuisine, or null when none is exported. */
  readonly bannerArt = computed(() =>
    BANNER_ART.has(this.key()) ? `/images/${this.key()}-recipe.svg` : null,
  );

  /** Every recipe of this cuisine, own generations first. */
  readonly recipes = computed(() => {
    const key = this.key();
    const all = mergeById([...this.store.saved(), ...this.fetched()]);
    return all.filter((recipe) => recipe.cuisine.toLowerCase() === key);
  });

  /** Total number of pages for this cuisine. */
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.recipes().length / PAGE_SIZE)));

  /** Recipes visible on the current page. */
  readonly pageItems = computed(() => {
    const start = (this.page() - 1) * PAGE_SIZE;
    return this.recipes().slice(start, start + PAGE_SIZE);
  });

  /** Compact pager entries ("1 2 3 … 8") for the current position. */
  readonly tokens = computed(() => pageTokens(this.page(), this.pageCount()));

  /** Label for the diet chip, empty when no diet was selected. */
  readonly dietLabel = dietLabel;

  /** Position of a row within the whole list, so numbering survives paging. */
  rowNumber(index: number): number {
    return (this.page() - 1) * PAGE_SIZE + index + 1;
  }

  /** Move to the given page, clamped to the valid range. */
  goToPage(target: number): void {
    this.page.set(Math.min(this.pageCount(), Math.max(1, target)));
  }
}
