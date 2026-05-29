import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/constants/roles.constants';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/phone-input/phone-input.component').then(m => m.PhoneInputComponent)
            },
            {
                path: 'verify-otp',
                loadComponent: () => import('./features/auth/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent)
            },
            {
                path: 'officer-login',
                loadComponent: () => import('./features/auth/officer-login/officer-login.component').then(m => m.OfficerLoginComponent)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'app',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard-redirect.component').then(m => m.DashboardRedirectComponent)
            },
            {
                path: 'dashboard/applicant',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'dashboard/mandal',
                canActivate: [roleGuard([UserRole.MANDAL_OFFICER])],
                loadComponent: () => import('./features/dashboard/mandal-officer-dashboard.component').then(m => m.MandalOfficerDashboardComponent)
            },
            {
                path: 'dashboard/constituency',
                canActivate: [roleGuard([UserRole.DISTRICT_OFFICER])],
                loadComponent: () => import('./features/dashboard/constituency-officer-dashboard.component').then(m => m.ConstituencyOfficerDashboardComponent)
            },
            {
                path: 'dashboard/state',
                canActivate: [roleGuard([UserRole.STATE_OFFICER])],
                loadComponent: () => import('./features/dashboard/state-officer-dashboard.component').then(m => m.StateOfficerDashboardComponent)
            },
            {
                path: 'application/view/:id',
                canActivate: [roleGuard([UserRole.MANDAL_OFFICER, UserRole.DISTRICT_OFFICER, UserRole.STATE_OFFICER, UserRole.APPLICANT, UserRole.SUPER_ADMIN])],
                loadComponent: () => import('./features/application/application-view/application-view.component').then(m => m.ApplicationViewComponent)
            },
            {
                path: 'application/register',
                canActivate: [roleGuard([UserRole.APPLICANT, UserRole.SUPER_ADMIN])],
                loadComponent: () => import('./features/application/registration-form/registration-form.component').then(m => m.RegistrationFormComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];
