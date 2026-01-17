import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser = toSignal(this.authService.currentUser$);

  // Determine if we should show the top header based on the current route
  // In Settings it's shown, in Dashboard it's not (per user request)
  currentRoute = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
    ),
  );

  isSettingsPage() {
    return this.currentRoute()?.includes('/settings');
  }

  isDashboardPage() {
    return this.currentRoute()?.includes('/dashboard');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
