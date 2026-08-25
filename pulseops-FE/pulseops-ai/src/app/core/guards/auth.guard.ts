import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { forkJoin, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CurrentUserService } from '../services/current-user.service';
import { BrandingService } from '../services/branding.service';
import { Role } from '../models/current-user.model';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const currentUser = inject(CurrentUserService);
  const branding = inject(BrandingService);
  const token = sessionStorage.getItem('access_token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  // Branding is best-effort — never block/redirect on it failing, only on
  // the current-user fetch (which is what proves the token is still valid).
  const brandingReady = branding.ensureLoaded().pipe(catchError(() => of(null)));

  if (currentUser.user()) {
    return brandingReady.pipe(map(() => true));
  }

  // Resolve the current user before activating the route so components
  // downstream (role-gated nav items, admin-only sections) don't race
  // against an async fetch that hasn't completed yet.
  return forkJoin([currentUser.fetchCurrentUser(), brandingReady]).pipe(
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
