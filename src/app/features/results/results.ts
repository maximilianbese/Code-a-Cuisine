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
  /** The three recipe suggestions from the latest generation run. */
  readonly recipes = this.service.getResults();
  /** True when n8n was unreachable and these are local demo recipes. */
  readonly isDemo = this.service.isDemo;

  /** Restart the flow to generate a new set of recipes. */
  regenerate(): void {
    this.router.navigate(['/generate']);
  }
}
