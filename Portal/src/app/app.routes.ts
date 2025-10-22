// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
// import { authGuard } from './core/guards/auth.guard';
// import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'transactions',
    canActivate: [authGuard, roleGuard(['CUSTOMER'])],
    loadComponent: () => import('./features/customer/transaction-list/transaction-list').then(m => m.TransactionList)
  },
  {
    path: 'transactions/:id',
    canActivate: [authGuard, roleGuard(['CUSTOMER'])],
    loadComponent: () => import('./features/customer/transaction-detail/transaction-detail').then(m => m.TransactionDetail)
  },
  {
    path: 'disputes/:id/events',
    canActivate: [authGuard, roleGuard(['CUSTOMER'])],
    loadComponent: () => import('./features/customer/dispute-events/dispute-events').then(m => m.DisputeEvents)
  },
//   {
//     path: 'admin/disputes',
//     canActivate: [authGuard, roleGuard(['DISPUTE_ADMIN'])],
//     loadComponent: () => import('./features/admin/dispute-management/dispute-management.component').then(m => m.DisputeManagementComponent)
//   },
//   {
//     path: 'admin/disputes/:id',
//     canActivate: [authGuard, roleGuard(['DISPUTE_ADMIN'])],
//     loadComponent: () => import('./features/admin/dispute-detail/dispute-detail.component').then(m => m.DisputeDetailComponent)
//   },
//   {
//     path: 'unauthorized',
//     loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
//   },
  {
    path: '**',
    redirectTo: '/login'
  }
];