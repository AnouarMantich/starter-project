import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, shareReplay, filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { User } from '../../shared/models/user.model';
import { PageableResponse } from '../../shared/models/pageable-response.model';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = environment.apiUrl + '/user-service/api/v1';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private userCache = new Map<string, Observable<User>>();

  constructor(private http: HttpClient) {}

  // Get all users with pagination and filtering
  getUsers(page = 0, size = 10, sortBy = 'createdAt'): Observable<PageableResponse<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sortBy);

    return this.http
      .get<PageableResponse<User>>(`${this.apiUrl}/users`, { params })
      .pipe(catchError(this.handleError), shareReplay(1));
  }

  // Get current user's information with caching
  getCurrentUser(): Observable<User> {
    if (!this.currentUserSubject.value) {
      return this.http.get<User>(`${this.apiUrl}/users/me`).pipe(
        tap((user) => this.currentUserSubject.next(user)),
        catchError(this.handleError),
        shareReplay(1)
      );
    }
    return this.currentUserSubject
      .asObservable()
      .pipe(filter((user): user is User => user !== null));
  }

  // Get user by ID with caching
  getUserById(userId: string): Observable<User> {
    if (!this.userCache.has(userId)) {
      const request = this.http
        .get<User>(`${this.apiUrl}/users/${userId}`)
        .pipe(catchError(this.handleError), shareReplay(1));
      this.userCache.set(userId, request);
    }
    return this.userCache.get(userId)!;
  }

  // Clear user cache
  clearCache(): void {
    this.userCache.clear();
    this.currentUserSubject.next(null);
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
