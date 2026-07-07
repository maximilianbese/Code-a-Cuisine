import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';
import { RecipeService } from '../../core/services/recipe.service';

/** Public recipe library grouped by cuisine. */
@Component({
  selector: 'app-cookbook',
  imports: [RouterLink, Logo],
  templateUrl: './cookbook.html',
  styleUrl: './cookbook.scss',
})
export class Cookbook {
  private readonly service = inject(RecipeService);
  readonly mostLiked = this.service.getMostLiked();
  readonly categories = this.service.getCategories();
}
