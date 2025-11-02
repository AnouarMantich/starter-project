import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { KeycloakService } from '../core/services/keycloak.service';
import { AuthService } from '../core/services/auth.service';
import { keycloakInitializer } from '../core/initializers/keycloak-initializer.factory';
import { jwtInterceptor } from '../core/interceptors/jwt.interceptor';

/**
 * Application configuration
 * Includes providers for routing, HTTP client, animations, and Keycloak initialization
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakInitializer,
      deps: [KeycloakService, AuthService],
      multi: true
    }
  ]
};
