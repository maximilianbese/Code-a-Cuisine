import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Logo } from '../../shared/logo/logo';
import { RecipeFlowService } from '../../core/services/recipe-flow.service';
import { INGREDIENT_UNITS } from '../../core/models/ingredient.model';
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

  readonly units = INGREDIENT_UNITS;
  readonly ingredients = this.flow.ingredients;
  readonly name = signal('');
  readonly amount = signal(100);
  readonly unit = signal<string>('gram');
  readonly error = signal('');

  /** Up to six known ingredients matching the current input. */
  readonly suggestions = computed(() => {
    const query = this.name().trim().toLowerCase();
    if (!query) return [];
    return INGREDIENT_NAMES
      .filter((n) => n.toLowerCase().startsWith(query) && n.toLowerCase() !== query)
      .slice(0, 6);
  });

  /** Clear the validation error while the user edits the name. */
  onName(value: string): void {
    this.name.set(value);
    this.error.set('');
  }

  /** Fill the field with a chosen suggestion and dismiss the list. */
  pick(name: string): void {
    this.name.set(name);
    this.error.set('');
  }

  /** Add the input as an ingredient, but only if it is a known ingredient. */
  add(): void {
    const match = this.canonical(this.name());
    if (!match) return this.error.set('Please choose an ingredient from the list.');
    this.flow.addIngredient({ name: match, amount: this.amount(), unit: this.unit() });
    this.name.set('');
    this.error.set('');
  }

  /** Return the canonical spelling of a known ingredient, or empty string. */
  private canonical(value: string): string {
    const query = value.trim().toLowerCase();
    return INGREDIENT_NAMES.find((n) => n.toLowerCase() === query) ?? '';
  }

  /** Load an existing ingredient back into the form for editing. */
  edit(index: number): void {
    const item = this.ingredients()[index];
    if (!item) return;
    this.name.set(item.name);
    this.amount.set(item.amount);
    this.unit.set(item.unit);
    this.flow.removeIngredient(index);
  }

  /** Remove the ingredient at the given index from the list. */
  remove(index: number): void {
    this.flow.removeIngredient(index);
  }

  /** Continue to the preferences step when at least one ingredient exists. */
  next(): void {
    if (this.ingredients().length) this.router.navigate(['/preferences']);
  }
}
