/**
 * User model representing the authenticated user
 */
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  realmRoles?: string[];
  clientRoles?: { [key: string]: string[] };
}

/**
 * Authentication state model
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}
