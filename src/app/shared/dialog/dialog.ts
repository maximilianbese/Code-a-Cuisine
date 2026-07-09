import { Component, input, output } from '@angular/core';

/** Reusable modal dialog rendered as a centered card over a dimmed backdrop. */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  /** Bold headline shown at the top of the dialog. */
  readonly heading = input.required<string>();
  /** Supporting message describing the situation to the user. */
  readonly message = input.required<string>();
  /** Label of the primary call-to-action link. */
  readonly actionLabel = input('Go back');
  /** Emitted when the user dismisses the dialog (close icon or backdrop). */
  readonly closed = output<void>();
  /** Emitted when the user activates the primary call-to-action. */
  readonly confirmed = output<void>();
}
