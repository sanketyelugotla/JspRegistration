import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationRepository } from '../../core/repositories/application.repository';
import { AuthService } from '../../core/services/auth.service';
import { DashboardRefreshService } from '../../core/services/dashboard-refresh.service';
import { Application } from '../../core/models/application.model';
import { ApplicationStatus } from '../../core/constants/status.constants';

@Component({
    selector: 'app-constituency-officer-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './constituency-officer-dashboard.component.html'
})
export class ConstituencyOfficerDashboardComponent implements OnInit {
    private applicationRepo = inject(ApplicationRepository);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private dashboardRefreshService = inject(DashboardRefreshService);

    applications = signal<Application[]>([]);
    loading = signal(true);
    user = this.authService.user;
    private hasInitialized = false;

    stats = signal({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });

    ngOnInit(): void {
        this.hasInitialized = true;
        this.loadApplications();

        this.route.queryParamMap.subscribe(() => {
            this.loadApplications();
        });

        effect(() => {
            this.dashboardRefreshService.refreshTick();
            if (this.hasInitialized) {
                this.loadApplications();
            }
        });
    }

    private loadApplications(): void {
        this.loading.set(true);
        this.applicationRepo.getApplications().subscribe({
            next: (response) => {
                this.applications.set(response.applications);
                this.calculateStats(response.applications);
                this.loading.set(false);
            },
            error: (err: any) => {
                console.error('Failed to load applications:', err);
                this.loading.set(false);
            }
        });
    }

    private calculateStats(apps: Application[]): void {
        const stats = {
            total: apps.length,
            pending: apps.filter(a => a.status === ApplicationStatus.DISTRICT_REVIEW).length,
            approved: apps.filter(a => a.status === ApplicationStatus.APPROVED).length,
            rejected: apps.filter(a => a.status === ApplicationStatus.REJECTED).length,
        };
        this.stats.set(stats);
    }

    getStatusClass(status: ApplicationStatus): string {
        const baseClass = 'px-2 py-1 rounded-full text-xs font-semibold ';

        if (status === ApplicationStatus.DISTRICT_REVIEW) {
            return baseClass + 'bg-yellow-100 text-yellow-800';
        } else if (status.includes('APPROVED')) {
            return baseClass + 'bg-green-100 text-green-800';
        } else if (status.includes('REJECTED')) {
            return baseClass + 'bg-red-100 text-red-800';
        } else {
            return baseClass + 'bg-gray-100 text-gray-800';
        }
    }

    getStatusLabel(status: ApplicationStatus): string {
        return status.replace(/_/g, ' ');
    }

    viewApplication(id: string): void {
        this.router.navigate(['/app/application/view', id]);
    }
}
