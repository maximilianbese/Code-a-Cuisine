import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';
import { RecipeService } from '../../core/services/recipe.service';
import { NutritionFacts, Recipe, RecipeStep } from '../../core/models/recipe.model';

/** One cook and the preparation steps assigned to that person. */
interface ChefTasks {
  chef: number;
  steps: RecipeStep[];
}

/** Macro type used for the calorie-share calculation. */
type Macro = 'protein' | 'fat' | 'carbs';

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
  /** The recipe resolved from the route, or undefined while it is missing. */
  readonly recipe = signal<Recipe | undefined>(undefined);
  /** Whether the user has hearted this recipe in the current session. */
  readonly liked = signal(false);
  /** True when n8n was unreachable and this is a local demo recipe. */
  readonly isDemo = this.service.isDemo;
  /** When true, nutrition is shown for the whole recipe instead of per portion. */
  readonly showTotal = signal(false);

  /** Resolve the recipe from the route as soon as the view is created. */
  constructor() {
    this.load();
  }

  /** Read the id from the route and set the matching recipe. */
  private load(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.recipe.set(this.service.getById(id) ?? this.service.getResults()[0]);
  }

  /**
   * Label for the diet chip. The backend may echo the raw preference key, so
   * "none" is dropped instead of being shown as a meaningless chip.
   */
  dietLabel(diet: string): string {
    const value = (diet ?? '').trim();
    return value.toLowerCase() === 'none' ? '' : value;
  }

  /** Build a 1-based list of chef numbers for the given cook count. */
  chefs(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  /** Toggle the "liked" state of the recipe. */
  toggleLike(): void {
    this.liked.update((value) => !value);
  }

  /** Group the steps into a separate to-do list per cook. */
  tasksByChef(): ChefTasks[] {
    const recipe = this.recipe();
    if (!recipe) return [];
    return this.chefs(recipe.cooks).map((chef) => ({
      chef,
      steps: recipe.steps.filter((step) => step.chef === chef),
    }));
  }

  /** Nutrition scaled to the whole recipe or to a single portion. */
  nutritionView(): NutritionFacts {
    const recipe = this.recipe();
    if (!recipe) return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    const factor = this.showTotal() ? recipe.portions : 1;
    return scaleNutrition(recipe.nutrition, factor);
  }

  /** Share of total calories contributed by the given macro (percent). */
  macroPercent(macro: Macro): number {
    const nutrition = this.recipe()?.nutrition;
    if (!nutrition) return 0;
    const kcal = { protein: nutrition.protein * 4, fat: nutrition.fat * 9, carbs: nutrition.carbs * 4 };
    const total = kcal.protein + kcal.fat + kcal.carbs || 1;
    return Math.round((kcal[macro] / total) * 100);
  }
}

/** Multiply every nutrition value by the given factor. */
function scaleNutrition(nutrition: NutritionFacts, factor: number): NutritionFacts {
  return {
    calories: nutrition.calories * factor,
    protein: nutrition.protein * factor,
    fat: nutrition.fat * factor,
    carbs: nutrition.carbs * factor,
  };
}
