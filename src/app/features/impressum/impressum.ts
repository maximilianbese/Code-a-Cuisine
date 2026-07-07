import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';

/** Legal notice (Impressum) required for publication. */
@Component({
  selector: 'app-impressum',
  imports: [RouterLink, Logo],
  templateUrl: './impressum.html',
  styleUrl: './impressum.scss',
})
export class Impressum {}
