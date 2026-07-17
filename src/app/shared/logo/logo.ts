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
  readonly variant = input<'dark' | 'light'>('dark');
  readonly src = computed(() =>
    this.variant() === 'light' ? '/assets/logo-light.svg' : '/assets/logo-dark.svg',
  );
}
