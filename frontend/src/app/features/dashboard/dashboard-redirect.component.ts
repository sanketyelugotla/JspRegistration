import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-dashboard-redirect',
    standalone: true,
    templateUrl: './dashboard-redirect.component.html'
})
export class DashboardRedirectComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);

    ngOnInit(): void {
        const user = this.authService.user();

        if (!user) {
            this.router.navigate(['/auth/login']);
            return;
        }

        // Route based on user role
        switch (user.role) {
            case 'MANDAL_OFFICER':
                this.router.navigate(['/app/dashboard/mandal'], { queryParamsHandling: 'preserve' });
                break;
            case 'DISTRICT_OFFICER':
                this.router.navigate(['/app/dashboard/constituency'], { queryParamsHandling: 'preserve' });
                break;
            case 'STATE_OFFICER':
                this.router.navigate(['/app/dashboard/state'], { queryParamsHandling: 'preserve' });
                break;
            case 'APPLICANT':
            case 'SUPER_ADMIN':
            default:
                this.router.navigate(['/app/dashboard/applicant'], { queryParamsHandling: 'preserve' });
                break;
        }
    }
}
