import { Injectable, inject } from '@angular/core';
import { AuthResponse, LoginRequest, RegisterRequest } from '@core/models/auth.interface';
import { User } from '@core/models/user.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiHttpService } from './api-http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiHttpService);
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>('auth/login', credentials)
      .pipe(tap((response) => this.setSession(response)));
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>('auth/register', userData)
      .pipe(tap((response) => this.setSession(response)));
  }

  loginWithGoogle(): void {
    window.location.href = `${this.api.getApiUrl()}/auth/google`;
  }

  handleCallback(authResponse: AuthResponse): void {
    this.setSession(authResponse);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public getUserName(): string | null {
    return this.getUserFromStorage()?.fullName || null;
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    this.currentUserSubject.next(authResponse.user);
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
