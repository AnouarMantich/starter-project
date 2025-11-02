import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.css'],
})
export class NavbarComponent {
  user: User | null = null;
  isLoading = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.user = user;
      this.isLoading = false;
    });
  }

  /**
   * Logout the current user
   */
  logout(): void {
    this.authService.logout();
  }
}
