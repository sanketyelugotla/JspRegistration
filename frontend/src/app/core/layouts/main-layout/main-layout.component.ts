import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, LoadingSpinnerComponent],
    templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
    authService = inject(AuthService);
    loadingService = inject(LoadingService);
    private router = inject(Router);

    getRoleLabel(role: string): string {
        const labels: Record<string, string> = {
            'SUPER_ADMIN': 'Super Admin',
            'MANDAL_OFFICER': 'Mandal Officer',
            'DISTRICT_OFFICER': 'District Officer',
            'STATE_OFFICER': 'State Officer',
            'APPLICANT': 'Applicant'
        };
        return labels[role] || role;
    }

    logout(): void {
        const refreshToken = this.authService.getRefreshToken();
        // Optionally call logout API
        // this.authRepository.logout(refreshToken || '').subscribe();
        this.authService.clearAuthData();
        this.router.navigate(['/auth/login']);
    }
}
