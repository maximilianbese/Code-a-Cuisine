import { Component, afterNextRender, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Logo } from '../../shared/logo/logo';

/** Interstitial shown while the recipes are "generated". */
@Component({
  selector: 'app-loading',
  imports: [Logo],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {
  private readonly router = inject(Router);

  constructor() {
    afterNextRender(() => this.scheduleRedirect());
  }

  private scheduleRedirect(): void {
    setTimeout(() => this.router.navigate(['/results']), 4000);
  }
}
