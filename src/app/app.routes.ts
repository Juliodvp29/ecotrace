import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./app').then((m) => m.App), // Example, replace with a real Home component later
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./core/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./core/auth/auth-callback.component').then((m) => m.AuthCallbackComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
