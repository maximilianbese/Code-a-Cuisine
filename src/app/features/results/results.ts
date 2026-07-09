import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';
import { RecipeService } from '../../core/services/recipe.service';

/** Shows the three generated recipe suggestions. */
@Component({
  selector: 'app-results',
  imports: [RouterLink, Logo],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  private readonly service = inject(RecipeService);
  private readonly router = inject(Router);
  readonly recipes = this.service.getResults();

  /** Restart the flow to generate a new set of recipes. */
  regenerate(): void {
    this.router.navigate(['/generate']);
  }
}
