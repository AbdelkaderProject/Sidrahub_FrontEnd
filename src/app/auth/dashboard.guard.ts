import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const dashboardGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  } else {
    return router.createUrlTree([authService.isAuthenticated() ? '/home' : '/pages/login']);
  }
};
