import { Routes } from '@angular/router';

/** Lazily loaded routes for the recipe flow, the cookbook and the legal pages. */
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then((m) => m.Home) },
  { path: 'generate', loadComponent: () => import('./features/generate/generate').then((m) => m.Generate) },
  { path: 'preferences', loadComponent: () => import('./features/preferences/preferences').then((m) => m.PreferencesPage) },
  { path: 'loading', loadComponent: () => import('./features/loading/loading').then((m) => m.Loading) },
  { path: 'results', loadComponent: () => import('./features/results/results').then((m) => m.Results) },
  { path: 'recipe/:id', loadComponent: () => import('./features/recipe-detail/recipe-detail').then((m) => m.RecipeDetail) },
  { path: 'cookbook', pathMatch: 'full', loadComponent: () => import('./features/cookbook/cookbook').then((m) => m.Cookbook) },
  { path: 'cookbook/:cuisine', loadComponent: () => import('./features/cuisine/cuisine').then((m) => m.CuisinePage) },
  { path: 'impressum', loadComponent: () => import('./features/impressum/impressum').then((m) => m.Impressum) },
  { path: '**', loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound) },
];
