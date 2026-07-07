import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';
import { RecipeFlowService } from '../../core/services/recipe-flow.service';
import { CuisineOption, DietOption, TimeOption } from '../../core/models/preferences.model';

interface Option<T> { value: T; label: string; hint?: string; }

/** Step 2 – portions, cooks and taste preferences. */
@Component({
  selector: 'app-preferences',
  imports: [RouterLink, Logo],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})
export class PreferencesPage {
  private readonly flow = inject(RecipeFlowService);
  private readonly router = inject(Router);
  readonly prefs = this.flow.preferences;

  readonly times: Option<TimeOption>[] = [
    { value: 'quick', label: 'Quick', hint: 'up to 20min' },
    { value: 'medium', label: 'Medium', hint: '25-45min' },
    { value: 'complex', label: 'Complex', hint: 'over 45min' },
  ];
  readonly cuisines: Option<CuisineOption>[] = [
    { value: 'german', label: 'German' }, { value: 'italian', label: 'Italian' },
    { value: 'indian', label: 'Indian' }, { value: 'japanese', label: 'Japanese' },
    { value: 'gourmet', label: 'Gourmet' }, { value: 'fusion', label: 'Fusion' },
  ];
  readonly diets: Option<DietOption>[] = [
    { value: 'vegetarian', label: 'Vegetarian' }, { value: 'vegan', label: 'Vegan' },
    { value: 'keto', label: 'Keto' }, { value: 'none', label: 'No preferences' },
  ];

  changePortions(delta: number): void {
    this.flow.updatePreferences({ portions: clamp(this.prefs().portions + delta, 1, 12) });
  }

  changeCooks(delta: number): void {
    this.flow.updatePreferences({ cooks: clamp(this.prefs().cooks + delta, 1, 3) });
  }

  setTime(value: TimeOption): void { this.flow.updatePreferences({ time: value }); }
  setCuisine(value: CuisineOption): void { this.flow.updatePreferences({ cuisine: value }); }
  setDiet(value: DietOption): void { this.flow.updatePreferences({ diet: value }); }

  generate(): void { this.router.navigate(['/loading']); }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
