import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    console.log('📡 HTTP Request:', req.method, req.url);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An error occurred';

            console.error('🔴 HTTP Error occurred:', {
                url: req.url,
                status: error.status,
                statusText: error.statusText,
                message: error.message,
                error: error.error
            });

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;

                // Handle 401 Unauthorized
                if (error.status === 401) {
                    authService.clearAuthData();
                    router.navigate(['/auth/login']);
                    errorMessage = 'Session expired. Please login again.';
                }

                // Handle 403 Forbidden
                if (error.status === 403) {
                    errorMessage = 'You do not have permission to access this resource.';
                }
            }

            // Log error
            console.error('❌ HTTP Error:', errorMessage);

            return throwError(() => new Error(errorMessage));
        })
    );
};
