import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CurrentUserService } from '../services/current-user.service';
import { Role } from '../models/current-user.model';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const currentUser = inject(CurrentUserService);
  const token = sessionStorage.getItem('access_token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  if (currentUser.user()) {
    return true;
  }

  // Resolve the current user before activating the route so components
  // downstream (role-gated nav items, admin-only sections) don't race
  // against an async fetch that hasn't completed yet.
  return currentUser.fetchCurrentUser().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};

export const roleGuard = (...allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const currentUser = inject(CurrentUserService);
    const role = currentUser.role();

    if (role && allowedRoles.includes(role)) {
      return true;
    }

    return router.createUrlTree(['/dashboard']);
  };
};
