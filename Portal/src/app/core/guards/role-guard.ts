import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();
    const userRoles = authService.getCurrentUserRoles();
    if (userRoles && roles.includes(userRoles[0])) {
      return true;
    }

    router.navigate(['/login']);
    return false;
  };
};
