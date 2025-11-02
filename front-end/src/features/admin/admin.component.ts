import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/user.model';

/**
 * Admin component - protected route with role guard
 * Only accessible to users with admin role
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  user: User | null = null;
  isLoading = true;

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.user = user;
      this.isLoading = false;

      if (user && !this.authService.hasRole('admin')) {
        this.snackBar.open('You do not have permission to access this page', 'Close', {
          duration: 5000,
        });
      }
    });
  }
}
