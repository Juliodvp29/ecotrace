import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div
      class="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-6 text-center"
    >
      <span class="material-symbols-outlined text-primary text-9xl mb-6">error_outline</span>
      <h1 class="text-6xl font-extrabold text-[#0d1b12] dark:text-white mb-4">404</h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        routerLink="/login"
        class="h-12 px-8 bg-primary hover:bg-[#0fd651] text-[#0d1b12] font-extrabold rounded-lg shadow-lg shadow-primary/20 transition-all duration-200"
      >
        Go to Login
      </button>
    </div>
  `,
})
export class NotFoundComponent {}
