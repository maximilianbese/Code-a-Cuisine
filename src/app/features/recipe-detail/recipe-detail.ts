import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../core/models/recipe.model';

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
  readonly recipe = signal<Recipe | undefined>(undefined);
  readonly liked = signal(false);

  constructor() {
    this.load();
  }

  private load(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.recipe.set(this.service.getById(id) ?? this.service.getResults()[0]);
  }

  chefs(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  toggleLike(): void {
    this.liked.update((value) => !value);
  }
}
