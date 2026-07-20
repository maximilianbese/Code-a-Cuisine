import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Brand lockup image. `variant` switches between the green and white mark. */
@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class Logo {
  /** Colour variant: "light" for green surfaces, "dark" for white ones. */
  readonly variant = input<'dark' | 'light'>('dark');
  /** Asset path of the logo file matching the selected variant. */
  readonly src = computed(() =>
    this.variant() === 'light' ? '/assets/logo-light.svg' : '/assets/logo-dark.svg',
  );
}
