import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';
import { RecipeFlowService } from '../../core/services/recipe-flow.service';

/** Landing / hero screen. */
@Component({
  selector: 'app-home',
  imports: [RouterLink, Logo],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly flow = inject(RecipeFlowService);

  /** Entering step 1 from the landing page always starts from a clean slate. */
  startNewRun(): void {
    this.flow.startNewRun();
  }
}
