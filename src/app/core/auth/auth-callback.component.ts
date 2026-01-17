import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { AuthResponse } from '../models/auth.interface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [LoaderComponent],
  template: `<app-loader></app-loader>`,
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const accessToken = this.route.snapshot.queryParamMap.get('accessToken');
    const refreshToken = this.route.snapshot.queryParamMap.get('refreshToken');
    const userStr = this.route.snapshot.queryParamMap.get('user');

    if (accessToken && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        const authResponse: AuthResponse = {
          accessToken,
          refreshToken,
          user,
        };
        this.authService.handleCallback(authResponse);
        this.router.navigate(['/']);
      } catch (e) {
        console.error('Error parsing user data from Google Auth', e);
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
