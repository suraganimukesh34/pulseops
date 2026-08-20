import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGaurd: CanActivateFn = () => {
    const router = inject(Router);
    const token = sessionStorage.getItem('access_token');

    if (token) {
        return true;
    }

    return router.createUrlTree(['/login']);
}