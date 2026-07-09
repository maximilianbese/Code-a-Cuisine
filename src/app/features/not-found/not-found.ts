import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';

/** Fallback page shown for unknown routes (HTTP 404 equivalent). */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Logo],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {}
