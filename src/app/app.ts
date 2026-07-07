import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Root shell that hosts the routed feature screens. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
