import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';

/** Landing / hero screen. */
@Component({
  selector: 'app-home',
  imports: [RouterLink, Logo],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
