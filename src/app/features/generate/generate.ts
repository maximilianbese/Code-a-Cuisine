import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Logo } from '../../shared/logo/logo';
import { RecipeFlowService } from '../../core/services/recipe-flow.service';
import { INGREDIENT_UNITS } from '../../core/models/ingredient.model';

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

  /** Add the current input as an ingredient, then clear the name field. */
  add(): void {
    const name = this.name().trim();
    if (!name) return;
    this.flow.addIngredient({ name, amount: this.amount(), unit: this.unit() });
    this.name.set('');
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
