import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (
    (authService.isAuthenticated() && authService.getRole() === 'Owner') ||
    authService.getRole() === 'Admin'
  ) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
