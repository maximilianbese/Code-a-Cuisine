import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/footer/footer';

/** Root shell that hosts the routed feature screens and the global footer. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
