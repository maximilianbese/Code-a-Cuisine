import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';
import { Dialog } from '../../shared/dialog/dialog';
import { StepIcon } from '../../shared/step-icon/step-icon';
import { RecipeFlowService } from '../../core/services/recipe-flow.service';
import { QuotaService } from '../../core/services/quota.service';
import { CuisineOption, DietOption, TimeOption } from '../../core/models/preferences.model';

/** One selectable preference chip: its value, its label and an optional hint. */
interface Option<T> { value: T; label: string; hint?: string; }

/** Accepted range for the portions stepper. */
const PORTIONS_RANGE = { min: 1, max: 12 } as const;

/** Accepted range for the cooks stepper. */
const COOKS_RANGE = { min: 1, max: 3 } as const;

/** Step 2 – portions, cooks and taste preferences. */
@Component({
  selector: 'app-preferences',
  imports: [RouterLink, Logo, Dialog, StepIcon],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})
export class PreferencesPage {
  private readonly flow = inject(RecipeFlowService);
  private readonly quota = inject(QuotaService);
  private readonly router = inject(Router);
  /** The preference selection shared across the generation flow. */
  readonly prefs = this.flow.preferences;
  /** Generations the user has left today. */
  readonly remaining = this.quota.remaining;
  /** Lowest selectable number of portions; disables the minus button. */
  readonly minPortions = PORTIONS_RANGE.min;
  /** Highest selectable number of portions; disables the plus button. */
  readonly maxPortions = PORTIONS_RANGE.max;
  /** Lowest selectable number of cooks; disables the minus button. */
  readonly minCooks = COOKS_RANGE.min;
  /** Highest selectable number of cooks; disables the plus button. */
  readonly maxCooks = COOKS_RANGE.max;
  /** Controls visibility of the "not enough ingredients" dialog. */
  readonly showDialog = signal(false);
  /** Controls visibility of the "daily quota reached" dialog. */
  readonly showQuota = signal(false);

  /** Selectable cooking-time brackets with their duration hints. */
  readonly times: Option<TimeOption>[] = [
    { value: 'quick', label: 'Quick', hint: 'up to 20min' },
    { value: 'medium', label: 'Medium', hint: '25-45min' },
    { value: 'complex', label: 'Complex', hint: 'over 45min' },
  ];
  /** Selectable cuisine styles. */
  readonly cuisines: Option<CuisineOption>[] = [
    { value: 'german', label: 'German' }, { value: 'italian', label: 'Italian' },
    { value: 'indian', label: 'Indian' }, { value: 'japanese', label: 'Japanese' },
    { value: 'gourmet', label: 'Gourmet' }, { value: 'fusion', label: 'Fusion' },
  ];
  /** Selectable dietary restrictions. */
  readonly diets: Option<DietOption>[] = [
    { value: 'vegetarian', label: 'Vegetarian' }, { value: 'vegan', label: 'Vegan' },
    { value: 'keto', label: 'Keto' }, { value: 'none', label: 'No preferences' },
  ];

  /** Increase or decrease the number of portions, clamped to its range. */
  changePortions(delta: number): void {
    const next = clamp(this.prefs().portions + delta, PORTIONS_RANGE.min, PORTIONS_RANGE.max);
    this.flow.updatePreferences({ portions: next });
  }

  /** Increase or decrease the number of cooks, clamped to its range. */
  changeCooks(delta: number): void {
    const next = clamp(this.prefs().cooks + delta, COOKS_RANGE.min, COOKS_RANGE.max);
    this.flow.updatePreferences({ cooks: next });
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
