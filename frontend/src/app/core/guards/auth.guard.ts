import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    // During SSR we cannot read localStorage. Let the browser hydrate first,
    // then client-side auth state will decide whether navigation is allowed.
    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    if (authService.isAuthenticated()) {
        return true;
    }

    // Redirect to login
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
};
