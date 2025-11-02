import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Login component
 * Handles user login via Keycloak
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      // Note: Keycloak handles the actual login form
      // This form is mainly for UI consistency
    });

    // If already authenticated, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.redirectAfterLogin();
    }
  }

  /**
   * Handle login action
   */
  login(): void {
    this.isLoading = true;
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    this.authService.login(window.location.origin + returnUrl);
  }

  /**
   * Navigate to registration page
   */
  register(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.authService.register(window.location.origin + returnUrl);
  }

  /**
   * Redirect to the appropriate page after login
   */
  private redirectAfterLogin(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.router.navigate([returnUrl]);
  }
}

