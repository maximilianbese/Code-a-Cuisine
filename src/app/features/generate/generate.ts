import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Logo } from '../../shared/logo/logo';
import { RecipeFlowService } from '../../core/services/recipe-flow.service';
import {
  DEFAULT_AMOUNT, INGREDIENT_UNITS, Ingredient, MAX_NAME_LENGTH, MIN_AMOUNT, MIN_NAME_LENGTH,
  clampAmount, formatAmount, isValidName, maxAmountFor, normaliseName,
} from '../../core/models/ingredient.model';
import { INGREDIENT_NAMES } from '../../core/data/ingredient-names';

/** Step 1 – capture the ingredients the user already has. */
@Component({
  selector: 'app-generate',
  imports: [FormsModule, Logo],
  templateUrl: './generate.html',
  styleUrl: './generate.scss',
})
export class Generate {
  private readonly flow = inject(RecipeFlowService);
  private readonly router = inject(Router);

  /** Units offered in the serving-size dropdown. */
  readonly units = INGREDIENT_UNITS;
  /** Smallest amount the form accepts, shared with the number input. */
  readonly minAmount = MIN_AMOUNT;
  /** Longest name the form accepts, shared with the name input. */
  readonly maxNameLength = MAX_NAME_LENGTH;
  /** Amount shown as a greyed-out placeholder while the field is empty. */
  readonly amountPlaceholder = DEFAULT_AMOUNT;
  /** The ingredient list collected so far. */
  readonly ingredients = this.flow.ingredients;
  /** Current text in the ingredient name field. */
  readonly name = signal('');
  /** Current value of the serving-size field, null while it is still empty. */
  readonly amount = signal<number | null>(null);
  /** Currently selected unit for the serving size. */
  readonly unit = signal<string>('gram');
  /** Validation message shown under the form, empty when the input is valid. */
  readonly error = signal('');
  /** Index of the list entry currently being edited, or null while adding. */
  readonly editingIndex = signal<number | null>(null);

  /** Largest amount accepted for the unit currently selected. */
  readonly maxAmount = computed(() => maxAmountFor(this.unit()));

  /** Up to six known ingredients matching the current input. */
  readonly suggestions = computed(() => {
    const query = this.name().trim().toLowerCase();
    if (!query) return [];
    return INGREDIENT_NAMES
      .filter((n) => n.toLowerCase().startsWith(query) && n.toLowerCase() !== query)
      .slice(0, 6);
  });

  /** Human-readable reason why the current input cannot be submitted. */
  readonly hint = computed(() => this.hintFor(this.name(), this.amount(), this.unit()));

  /** True once both the name and the amount would produce a valid entry. */
  readonly canSubmit = computed(() => !this.hint());

  /**
   * Reason the amount is rejected, shown inline. The name is only complained
   * about on submit, but a bad amount is worth flagging straight away. An
   * untouched field stays quiet — that is a placeholder, not a mistake.
   */
  readonly amountHint = computed(() => {
    const amount = this.amount();
    return amount === null ? '' : amountMessage(amount, this.unit());
  });

  /** Clear the validation error while the user edits the name. */
  onName(value: string): void {
    this.name.set(value);
    this.error.set('');
  }

  /** Store the typed amount, treating an empty field as "not filled in yet". */
  onAmount(value: number | string | null): void {
    const text = String(value ?? '').trim();
    this.amount.set(text === '' ? null : Number(text));
    this.error.set('');
  }

  /** Re-clamp the amount when the unit changes, since limits differ per unit. */
  onUnit(value: string): void {
    const amount = this.amount();
    this.unit.set(value);
    if (amount !== null) this.amount.set(clampAmount(amount, value));
    this.error.set('');
  }

  /** Fill the field with a chosen suggestion and dismiss the list. */
  pick(name: string): void {
    this.name.set(name);
    this.error.set('');
  }

  /** Add the entry, or save it back in place when an edit is in progress. */
  submit(): void {
    const message = this.hint();
    if (message) return this.error.set(message);
    const index = this.editingIndex();
    if (index === null) this.flow.addIngredient(this.buildItem());
    else this.flow.replaceIngredient(index, this.buildItem());
    this.resetForm();
  }

  /** Load an existing ingredient into the form without removing it yet. */
  edit(index: number): void {
    const item = this.ingredients()[index];
    if (!item) return;
    this.editingIndex.set(index);
    this.name.set(item.name);
    this.amount.set(item.amount);
    this.unit.set(item.unit);
    this.error.set('');
  }

  /** Leave edit mode and restore the empty "add ingredient" form. */
  cancelEdit(): void {
    this.resetForm();
  }

  /** Remove the ingredient at the given index, ending any edit on it. */
  remove(index: number): void {
    if (this.editingIndex() === index) this.resetForm();
    this.flow.removeIngredient(index);
  }

  /** Format an entry for the list, e.g. "150g" or "1" for pieces. */
  label(item: Ingredient): string {
    return formatAmount(item);
  }

  /** Continue to the preferences step when at least one ingredient exists. */
  next(): void {
    if (this.ingredients().length) this.router.navigate(['/preferences']);
  }

  /** Build a normalised ingredient from the current form state. */
  private buildItem(): Ingredient {
    const unit = this.unit();
    const amount = clampAmount(this.amount() ?? DEFAULT_AMOUNT, unit);
    return { name: this.canonical(this.name()), amount, unit };
  }

  /** Reset name, amount and edit state back to the defaults. */
  private resetForm(): void {
    this.editingIndex.set(null);
    this.name.set('');
    this.amount.set(null);
    this.unit.set('gram');
    this.error.set('');
  }

  /** Return the message explaining why the input is invalid, or empty string. */
  private hintFor(name: string, amount: number | null, unit: string): string {
    if (!isValidName(name)) return nameMessage(name);
    if (amount === null) return 'Please enter a serving size.';
    return amountMessage(amount, unit);
  }

  /**
   * Canonical spelling for ingredients we know, otherwise the cleaned-up input.
   * The known list drives the suggestions and keeps casing consistent, but it
   * must never block an ingredient the user actually has in their kitchen.
   */
  private canonical(value: string): string {
    const name = normaliseName(value);
    const known = INGREDIENT_NAMES.find((n) => n.toLowerCase() === name.toLowerCase());
    return known ?? name;
  }
}

/** Explain why an ingredient name is rejected, or return an empty string. */
function nameMessage(value: string): string {
  const name = normaliseName(value);
  if (!name) return 'Please enter an ingredient.';
  if (name.length < MIN_NAME_LENGTH) return `Use at least ${MIN_NAME_LENGTH} characters.`;
  if (name.length > MAX_NAME_LENGTH) return `Please keep it under ${MAX_NAME_LENGTH} characters.`;
  return 'Use letters, numbers, spaces and hyphens only.';
}

/** Explain why an amount is rejected for its unit, or return an empty string. */
function amountMessage(amount: number, unit: string): string {
  const max = maxAmountFor(unit);
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) return 'Enter a whole number.';
  if (amount < MIN_AMOUNT) return `The amount has to be at least ${MIN_AMOUNT}.`;
  if (amount > max) return `That is a lot — please stay at ${max} ${unit} or below.`;
  return '';
}
