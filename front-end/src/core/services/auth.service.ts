import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { KeycloakService } from './keycloak.service';
import { User, AuthState } from '../../shared/models/user.model';
import { KeycloakProfile } from 'keycloak-js';
import { environment } from '../../environments/environment';

/**
 * Service for managing authentication state and user profile
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null
  });

  public authState$: Observable<AuthState> = this.authStateSubject.asObservable();

  constructor(private keycloakService: KeycloakService) {
    // Subscribe to Keycloak authentication state changes
    this.keycloakService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.updateAuthState(isAuthenticated);
    });
  }

  /**
   * Initialize authentication state
   */
  async init(): Promise<void> {
    const isAuthenticated = this.keycloakService.isAuthenticated();
    await this.updateAuthState(isAuthenticated);
  }

  /**
   * Update authentication state
   */
  private async updateAuthState(isAuthenticated: boolean): Promise<void> {
    if (isAuthenticated) {
      const token = this.keycloakService.getToken();
      const refreshToken = this.keycloakService.getRefreshToken();
      const profile = await this.keycloakService.loadUserProfile();

      const user: User = {
        id: profile?.id || '',
        username: profile?.username || '',
        email: profile?.email || '',
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        roles: this.keycloakService.getUserRoles(),
        realmRoles: this.keycloakService.getUserRoles(),
        clientRoles: { [this.getClientId()]: this.keycloakService.getClientRoles() }
      };

      this.authStateSubject.next({
        isAuthenticated: true,
        user,
        token: token || null,
        refreshToken: refreshToken || null
      });
    } else {
      this.authStateSubject.next({
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null
      });
    }
  }

  /**
   * Get current authentication state
   */
  getAuthState(): Observable<AuthState> {
    return this.authState$;
  }

  /**
   * Get current user
   */
  getCurrentUser(): Observable<User | null> {
    return this.authState$.pipe(
      switchMap((state) => of(state.user))
    );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.keycloakService.isAuthenticated();
  }

  /**
   * Get access token
   */
  getToken(): string | undefined {
    return this.keycloakService.getToken();
  }

  /**
   * Login user
   */
  login(redirectUri?: string): void {
    this.keycloakService.login(redirectUri);
  }

  /**
   * Logout user
   */
  logout(redirectUri?: string): void {
    this.keycloakService.logout(redirectUri);
  }

  /**
   * Register new user
   */
  register(redirectUri?: string): void {
    this.keycloakService.register(redirectUri);
  }

  /**
   * Check if user has role
   */
  hasRole(role: string): boolean {
    return this.keycloakService.hasRole(role);
  }

  /**
   * Check if user has any of the roles
   */
  hasAnyRole(roles: string[]): boolean {
    return this.keycloakService.hasAnyRole(roles);
  }

  /**
   * Update token
   */
  async updateToken(): Promise<boolean> {
    const updated = await this.keycloakService.updateToken();
    if (updated) {
      await this.updateAuthState(true);
    }
    return updated;
  }

  /**
   * Get client ID from environment
   */
  private getClientId(): string {
    return environment.keycloak.clientId;
  }
}

