import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, LoaderComponent],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoginMode = signal(true);
  showPassword = signal(false);

  authForm = this.fb.group({
    fullName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    const path = this.route.snapshot.url[0]?.path;
    this.isLoginMode.set(path === 'login');
    this.updateValidators();
  }

  toggleMode() {
    this.isLoginMode.update((val) => !val);
    this.updateValidators();
    const newPath = this.isLoginMode() ? '/login' : '/register';
    window.history.pushState({}, '', newPath);
  }

  private updateValidators() {
    if (this.isLoginMode()) {
      this.authForm.get('fullName')?.clearValidators();
    } else {
      this.authForm.get('fullName')?.setValidators([Validators.required]);
    }
    this.authForm.get('fullName')?.updateValueAndValidity();
  }

  togglePasswordVisibility() {
    this.showPassword.update((val) => !val);
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { email, password, fullName } = this.authForm.value;

    if (this.isLoginMode()) {
      this.authService.login({ email: email!, password: password! }).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => console.error('Login error', err),
      });
    } else {
      this.authService
        .register({ fullName: fullName!, email: email!, password: password! })
        .subscribe({
          next: () => this.router.navigate(['/onboarding']),
          error: (err) => console.error('Register error', err),
        });
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
