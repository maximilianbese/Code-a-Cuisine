import { Component, afterNextRender, inject } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, timer } from 'rxjs';
import { Logo } from '../../shared/logo/logo';
import { RecipeFlowService } from '../../core/services/recipe-flow.service';
import { RecipeApiService } from '../../core/services/recipe-api.service';
import { RecipeService } from '../../core/services/recipe.service';
import { RecipePersistenceService } from '../../core/services/recipe-persistence.service';
import { QuotaService } from '../../core/services/quota.service';
import { GenerateRequest } from '../../core/models/generate-request.model';
import { Recipe } from '../../core/models/recipe.model';

/** Minimum time the interstitial stays visible to bridge the wait. */
const MIN_VISIBLE_MS = 2500;

/** Interstitial that requests recipes, then forwards to the results. */
@Component({
  selector: 'app-loading',
  imports: [Logo],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {
  private readonly router = inject(Router);
  private readonly flow = inject(RecipeFlowService);
  private readonly api = inject(RecipeApiService);
  private readonly recipes = inject(RecipeService);
  private readonly store = inject(RecipePersistenceService);
  private readonly quota = inject(QuotaService);

  /** Kick off generation once the component has rendered. */
  constructor() {
    afterNextRender(() => this.run());
  }

  /** Request recipes (with a minimum visible delay), then continue. */
  private run(): void {
    this.quota.consume();
    forkJoin({ recipes: this.api.generate(this.buildRequest()), _: timer(MIN_VISIBLE_MS) })
      .subscribe(({ recipes }) => this.finish(recipes));
  }

  /** Assemble the JSON payload from the collected flow state. */
  private buildRequest(): GenerateRequest {
    return { ingredients: this.flow.ingredients(), preferences: this.flow.preferences() };
  }

  /** Persist and display the generated recipes. */
  private finish(recipes: Recipe[]): void {
    this.recipes.setResults(recipes);
    this.store.save(recipes);
    this.router.navigate(['/results']);
  }
}
