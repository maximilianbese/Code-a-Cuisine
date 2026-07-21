import { Component, afterNextRender, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, timer } from 'rxjs';
import { Logo } from '../../shared/logo/logo';
import { RecipeFlowService } from '../../core/services/recipe-flow.service';
import { RecipeApiService, RecipeResult } from '../../core/services/recipe-api.service';
import { RecipeService } from '../../core/services/recipe.service';
import { RecipePersistenceService } from '../../core/services/recipe-persistence.service';
import { QuotaService } from '../../core/services/quota.service';
import { GenerateRequest, RECIPE_LANGUAGE } from '../../core/models/generate-request.model';

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

  /** Falls back to the shimmer card if the animation asset is missing. */
  readonly animationFailed = signal(false);

  /** Kick off generation once the component has rendered. */
  constructor() {
    afterNextRender(() => this.run());
  }

  /** Request recipes (with a minimum visible delay), then continue. */
  private run(): void {
    this.quota.consume();
    forkJoin({ result: this.api.generate(this.buildRequest()), _: timer(MIN_VISIBLE_MS) })
      .subscribe(({ result }) => this.finish(result));
  }

  /** Assemble the JSON payload from the collected flow state. */
  private buildRequest(): GenerateRequest {
    return {
      ingredients: this.flow.ingredients(),
      preferences: this.flow.preferences(),
      language: RECIPE_LANGUAGE,
    };
  }

  /** Persist and display the generated recipes. */
  private finish(result: RecipeResult): void {
    this.recipes.setResults(result.recipes, result.demo);
    if (!result.demo) this.store.save(result.recipes);
    this.router.navigate(['/results']);
  }
}
