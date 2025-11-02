import { KeycloakService } from './../core/services/keycloak.service';
import { UserService } from './../core/services/user-service';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root application component
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  constructor(private userService: UserService, private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    this.keycloakService.isAuthenticated$.subscribe({
      next: (data) => {
        if (data) {
          this.userService.getCurrentUser().subscribe({
            next: () => {
              console.log('logged!');
            },
          });
        }
      },
    });
  }
}
