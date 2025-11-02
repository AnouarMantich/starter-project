import { inject } from '@angular/core';
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

/**
 * Guard to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  const returnUrl = state.url;
  router.navigate(['/login'], { queryParams: { returnUrl } });
  return false;
};

/**
 * Guard to protect routes that require specific roles
 * @param roles Array of roles that are allowed to access the route
 */
export const roleGuard = (roles: string[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      const returnUrl = state.url;
      router.navigate(['/login'], { queryParams: { returnUrl } });
      return false;
    }

    if (authService.hasAnyRole(roles)) {
      return true;
    }

    // User is authenticated but doesn't have required role
    router.navigate(['/dashboard']);
    return false;
  };
};
