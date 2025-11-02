import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service for managing Keycloak authentication
 * Handles initialization, login, logout, and token management
 */
@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloakInstance: Keycloak | undefined;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() {}

  /**
   * Initialize Keycloak instance
   * @returns Promise that resolves when Keycloak is initialized
   */
  async init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const config = {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      };

      this.keycloakInstance = new Keycloak(config);

      this.keycloakInstance
        .init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
          pkceMethod: 'S256',
          checkLoginIframe: false
        })
        .then((authenticated) => {
          this.isAuthenticatedSubject.next(authenticated);
          this.setupTokenRefresh();
          resolve(authenticated);
        })
        .catch((error) => {
          console.error('Keycloak initialization failed:', error);
          reject(error);
        });
    });
  }

  /**
   * Get the Keycloak instance
   */
  getKeycloakInstance(): Keycloak | undefined {
    return this.keycloakInstance;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.keycloakInstance?.authenticated ?? false;
  }

  /**
   * Get the current access token
   */
  getToken(): string | undefined {
    return this.keycloakInstance?.token;
  }

  /**
   * Get the current refresh token
   */
  getRefreshToken(): string | undefined {
    return this.keycloakInstance?.refreshToken;
  }

  /**
   * Login the user
   * @param redirectUri Optional redirect URI after login
   */
  login(redirectUri?: string): void {
    if (this.keycloakInstance) {
      this.keycloakInstance.login({
        redirectUri: redirectUri || window.location.origin
      });
    }
  }

  /**
   * Logout the user
   * @param redirectUri Optional redirect URI after logout
   */
  logout(redirectUri?: string): void {
    if (this.keycloakInstance) {
      this.keycloakInstance.logout({
        redirectUri: redirectUri || window.location.origin + '/login'
      });
      this.isAuthenticatedSubject.next(false);
    }
  }

  /**
   * Register a new user (redirect to Keycloak registration)
   * @param redirectUri Optional redirect URI after registration
   */
  register(redirectUri?: string): void {
    if (this.keycloakInstance) {
      this.keycloakInstance.register({
        redirectUri: redirectUri || window.location.origin
      });
    }
  }

  /**
   * Get user profile information
   */
  async loadUserProfile(): Promise<Keycloak.KeycloakProfile | undefined> {
    if (this.keycloakInstance && this.isAuthenticated()) {
      try {
        return await this.keycloakInstance.loadUserProfile();
      } catch (error) {
        console.error('Failed to load user profile:', error);
        return undefined;
      }
    }
    return undefined;
  }

  /**
   * Get user roles
   */
  getUserRoles(): string[] {
    if (this.keycloakInstance && this.isAuthenticated()) {
      return this.keycloakInstance.realmAccess?.roles || [];
    }
    return [];
  }

  /**
   * Get client-specific roles
   */
  getClientRoles(clientId?: string): string[] {
    if (this.keycloakInstance && this.isAuthenticated()) {
      const client = clientId || environment.keycloak.clientId;
      return this.keycloakInstance.resourceAccess?.[client]?.roles || [];
    }
    return [];
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    if (this.keycloakInstance && this.isAuthenticated()) {
      const realmRoles = this.keycloakInstance.realmAccess?.roles || [];
      const clientRoles = this.getClientRoles();
      return realmRoles.includes(role) || clientRoles.includes(role);
    }
    return false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Update the authentication state
   */
  updateToken(minValidity: number = 5): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.keycloakInstance && this.isAuthenticated()) {
        this.keycloakInstance
          .updateToken(minValidity)
          .then((refreshed) => {
            if (refreshed) {
              console.log('Token refreshed');
            }
            resolve(refreshed);
          })
          .catch((error) => {
            console.error('Token refresh failed:', error);
            this.logout();
            reject(error);
          });
      } else {
        resolve(false);
      }
    });
  }

  /**
   * Setup automatic token refresh
   */
  private setupTokenRefresh(): void {
    if (this.keycloakInstance && this.isAuthenticated()) {
      // Refresh token every 30 seconds if less than 5 minutes validity remaining
      setInterval(() => {
        this.updateToken(5).catch((error) => {
          console.error('Token refresh error:', error);
        });
      }, 30000);
    }
  }
}

