import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Global site footer with primary navigation and the legal (Impressum) link. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  /** Current year shown in the copyright line. */
  readonly year = new Date().getFullYear();
}
