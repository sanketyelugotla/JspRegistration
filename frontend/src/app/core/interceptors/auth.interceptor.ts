import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getAccessToken();

    // Skip adding token for public endpoints
    const skipAuth = req.url.includes('/auth/send-otp') ||
        req.url.includes('/auth/verify-otp') ||
        req.url.includes('/auth/officer/login') ||
        req.url.includes('/locations') ||
        (req.url.includes('/party-roles') && req.method === 'GET');

    console.log('🔐 Auth Interceptor:', {
        url: req.url,
        method: req.method,
        skipAuth: skipAuth,
        hasToken: !!token
    });

    if (token && !skipAuth) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('✅ Token added to request');
    } else {
        console.log('⏭️ Skipping auth for this request');
    }

    return next(req);
};
