import { KeycloakService } from '../services/keycloak.service';
import { AuthService } from '../services/auth.service';

/**
 * Factory function to initialize Keycloak before the app starts
 * This is used with APP_INITIALIZER to ensure Keycloak is ready before routing
 */
export function keycloakInitializer(
  keycloakService: KeycloakService,
  authService: AuthService
): () => Promise<void> {
  return () =>
    keycloakService
      .init()
      .then(() => {
        return authService.init();
      })
      .catch((error) => {
        console.error('Keycloak initialization error:', error);
        // Continue app initialization even if Keycloak fails
        // In production, you might want to handle this differently
        return Promise.resolve();
      });
}

