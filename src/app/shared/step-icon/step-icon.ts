import { Component, input } from '@angular/core';

/**
 * The boxed plus / minus glyph used by every stepper control.
 *
 * Figma draws these as an outlined rounded square with a bold bar inside, not
 * as a typed "+" character in a bordered box — a text glyph renders too thin
 * and sits loosely inside its box, which is why it never matched the design.
 */
@Component({
  selector: 'app-step-icon',
  templateUrl: './step-icon.html',
  styleUrl: './step-icon.scss',
})
export class StepIcon {
  /** Which glyph to draw inside the square. */
  readonly kind = input.required<'plus' | 'minus'>();
}
