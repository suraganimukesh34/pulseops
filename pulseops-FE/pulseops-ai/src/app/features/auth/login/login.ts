import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { BrandingService } from '../../../core/services/branding.service';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  showPassword = false;
  isLoading = false;
  loginError = '';

  private fb = inject(FormBuilder);
  private router = inject(Router)
  private currentUserService = inject(CurrentUserService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly branding = inject(BrandingService);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.branding.ensureLoaded().subscribe({
      next: () => this.cdr.detectChanges(),
      error: () => { /* fall back to defaults already on the service */ },
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginError = '';
    this.isLoading = true;

    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: (response) => {
        sessionStorage.setItem('access_token', response.access_token);

        this.currentUserService.fetchCurrentUser().subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          }
        });
      },
      error: (error) => {
        console.error('Login Failed:', error);
        this.isLoading = false;
        this.loginError = 'Invalid email or password.';
      }
    })
  }
}
