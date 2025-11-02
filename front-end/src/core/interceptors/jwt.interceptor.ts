import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError, from } from 'rxjs';

/**
 * HTTP Interceptor to attach JWT tokens to outgoing requests
 * Handles token refresh and 401/403 errors
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get the current token
  const token = authService.getToken();

  // Clone the request and add the authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Execute the request and handle errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized
      if (error.status === 401) {
        // Try to refresh the token
        return from(authService.updateToken()).pipe(
          switchMap((refreshed) => {
            if (refreshed) {
              // Retry the request with the new token
              const newToken = authService.getToken();
              if (newToken) {
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next(retryReq);
              }
            }
            // Token refresh failed, logout and redirect
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => error);
          }),
          catchError((refreshError) => {
            // Token refresh failed
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      // Handle 403 Forbidden
      if (error.status === 403) {
        router.navigate(['/dashboard']);
        return throwError(() => error);
      }

      // For other errors, just pass them through
      return throwError(() => error);
    })
  );
};

