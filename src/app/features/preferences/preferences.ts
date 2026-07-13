import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';
import { Dialog } from '../../shared/dialog/dialog';
import { RecipeFlowService } from '../../core/services/recipe-flow.service';
import { QuotaService, DAILY_QUOTA } from '../../core/services/quota.service';
import { CuisineOption, DietOption, TimeOption } from '../../core/models/preferences.model';

interface Option<T> { value: T; label: string; hint?: string; }

/** Step 2 – portions, cooks and taste preferences. */
@Component({
  selector: 'app-preferences',
  imports: [RouterLink, Logo, Dialog],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})
export class PreferencesPage {
  private readonly flow = inject(RecipeFlowService);
  private readonly quota = inject(QuotaService);
  private readonly router = inject(Router);
  readonly prefs = this.flow.preferences;
  /** Generations the user has left today. */
  readonly remaining = this.quota.remaining;
  /** Daily generation limit shown alongside the remaining count. */
  readonly dailyQuota = DAILY_QUOTA;
  /** Controls visibility of the "not enough ingredients" dialog. */
  readonly showDialog = signal(false);
  /** Controls visibility of the "daily quota reached" dialog. */
  readonly showQuota = signal(false);

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

  /** Increase or decrease the number of portions (clamped to 1–12). */
  changePortions(delta: number): void {
    this.flow.updatePreferences({ portions: clamp(this.prefs().portions + delta, 1, 12) });
  }

  /** Increase or decrease the number of cooks (clamped to 1–3). */
  changeCooks(delta: number): void {
    this.flow.updatePreferences({ cooks: clamp(this.prefs().cooks + delta, 1, 3) });
  }

  /** Select the preferred cooking-time bracket. */
  setTime(value: TimeOption): void { this.flow.updatePreferences({ time: value }); }
  /** Select the preferred cuisine style. */
  setCuisine(value: CuisineOption): void { this.flow.updatePreferences({ cuisine: value }); }
  /** Select the dietary preference. */
  setDiet(value: DietOption): void { this.flow.updatePreferences({ diet: value }); }

  /** Enforce the daily quota, validate quantities, then continue or warn. */
  generate(): void {
    if (!this.quota.canGenerate()) return this.showQuota.set(true);
    if (this.flow.hasSufficientQuantities()) this.router.navigate(['/loading']);
    else this.showDialog.set(true);
  }

  /** Dismiss the dialog and return to the ingredient step. */
  backToIngredients(): void {
    this.showDialog.set(false);
    this.router.navigate(['/generate']);
  }
}

/** Restrict a value to the inclusive [min, max] range. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
