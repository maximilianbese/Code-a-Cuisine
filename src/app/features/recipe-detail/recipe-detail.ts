import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';
import { RecipeService } from '../../core/services/recipe.service';
import { RecipeApiService } from '../../core/services/recipe-api.service';
import { Recipe } from '../../core/models/recipe.model';
import { dietLabel } from '../../core/utils/recipe-labels';

/** Full recipe view with ingredients, chef-assigned steps and nutrition. */
@Component({
  selector: 'app-recipe-detail',
  imports: [RouterLink, Logo],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RecipeService);
  private readonly api = inject(RecipeApiService);
  /** The recipe resolved from the route, or undefined while it is missing. */
  readonly recipe = signal<Recipe | undefined>(undefined);
  /** Whether the user has hearted this recipe in the current session. */
  readonly liked = signal(false);
  /** True when n8n was unreachable and this is a local demo recipe. */
  readonly isDemo = this.service.isDemo;

  /** Resolve the recipe from the route as soon as the view is created. */
  constructor() {
    this.load();
  }

  /**
   * Resolve the recipe from the route. Local sources (results, saved, seed) are
   * checked first for an instant render; when the id lives only in the live
   * library — every cookbook link to a backend recipe — it is fetched from
   * there instead of silently showing the wrong recipe.
   */
  private load(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const local = this.service.getById(id);
    if (local) return this.recipe.set(local);
    this.resolveFromLibrary(id);
  }

  /** Look the id up in the live library, falling back to the latest result. */
  private resolveFromLibrary(id: string): void {
    this.api.getLibrary().subscribe((result) => {
      const match = result.recipes.find((recipe) => recipe.id === id);
      this.recipe.set(match ?? this.service.getResults()[0]);
    });
  }

  /** Label for the diet chip, empty when no diet was selected. */
  readonly dietLabel = dietLabel;

  /** Build a 1-based list of chef numbers for the given cook count. */
  chefs(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  /** Toggle the "liked" state of the recipe. */
  toggleLike(): void {
    this.liked.update((value) => !value);
  }
}
