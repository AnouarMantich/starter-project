import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../core/guards/auth.guard';

/**
 * Application routes configuration
 * Protected routes use authGuard to ensure user is authenticated
 * Admin route uses roleGuard to ensure user has admin role
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('../features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('../auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('../features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('../features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('../features/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard, roleGuard(['admin'])]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
