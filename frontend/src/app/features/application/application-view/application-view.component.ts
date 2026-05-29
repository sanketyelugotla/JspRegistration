import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ApplicationStatus } from '../../../core/constants/status.constants';
import { UserRole } from '../../../core/constants/roles.constants';
import { Application } from '../../../core/models/application.model';
import { Document } from '../../../core/models/document.model';
import { ApplicationRepository } from '../../../core/repositories/application.repository';
import { DocumentRepository } from '../../../core/repositories/document.repository';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardRefreshService } from '../../../core/services/dashboard-refresh.service';

@Component({
    selector: 'app-application-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './application-view.component.html'
})
export class ApplicationViewComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private location = inject(Location);
    private applicationRepository = inject(ApplicationRepository);
    private documentRepository = inject(DocumentRepository);
    private authService = inject(AuthService);
    private dashboardRefreshService = inject(DashboardRefreshService);

    application = signal<Application | null>(null);
    loading = signal(true);
    actionLoading = signal(false);
    errorMessage = signal<string | null>(null);
    remarks = signal('');

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.errorMessage.set('Application ID is missing');
            this.loading.set(false);
            return;
        }

        this.loadApplication(id);
    }

    loadApplication(id: string): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.applicationRepository
            .getApplicationById(id)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (application) => {
                    this.application.set(application);
                },
                error: (err) => {
                    this.errorMessage.set(err?.error?.message || 'Failed to load application details');
                }
            });
    }

    canTakeReviewAction(): boolean {
        const app = this.application();
        const user = this.authService.user();

        if (!app || !user) {
            return false;
        }

        if (user.role === UserRole.MANDAL_OFFICER) {
            return app.status === ApplicationStatus.SUBMITTED;
        }

        if (user.role === UserRole.DISTRICT_OFFICER) {
            return app.status === ApplicationStatus.DISTRICT_REVIEW;
        }

        if (user.role === UserRole.STATE_OFFICER) {
            return app.status === ApplicationStatus.STATE_REVIEW;
        }

        return false;
    }

    approveApplication(): void {
        const app = this.application();
        if (!app || !this.canTakeReviewAction()) {
            return;
        }

        this.actionLoading.set(true);
        this.errorMessage.set(null);

        this.applicationRepository
            .approveApplication(app.id, this.remarks().trim() || undefined)
            .pipe(finalize(() => this.actionLoading.set(false)))
            .subscribe({
                next: () => {
                    this.dashboardRefreshService.triggerRefresh();
                    this.router.navigate(['/app/dashboard'], { queryParams: { reload: Date.now() } });
                },
                error: (err) => {
                    this.errorMessage.set(err?.error?.message || 'Failed to approve application');
                }
            });
    }

    rejectApplication(): void {
        const app = this.application();
        if (!app || !this.canTakeReviewAction()) {
            return;
        }

        this.actionLoading.set(true);
        this.errorMessage.set(null);

        this.applicationRepository
            .rejectApplication(app.id, this.remarks().trim() || undefined)
            .pipe(finalize(() => this.actionLoading.set(false)))
            .subscribe({
                next: () => {
                    this.dashboardRefreshService.triggerRefresh();
                    this.router.navigate(['/app/dashboard'], { queryParams: { reload: Date.now() } });
                },
                error: (err) => {
                    this.errorMessage.set(err?.error?.message || 'Failed to reject application');
                }
            });
    }

    requestCorrectionApplication(): void {
        const app = this.application();
        if (!app || !this.canTakeReviewAction()) {
            return;
        }

        this.actionLoading.set(true);
        this.errorMessage.set(null);

        this.applicationRepository
            .requestCorrectionApplication(app.id, this.remarks().trim() || undefined)
            .pipe(finalize(() => this.actionLoading.set(false)))
            .subscribe({
                next: () => {
                    this.dashboardRefreshService.triggerRefresh();
                    this.router.navigate(['/app/dashboard'], { queryParams: { reload: Date.now() } });
                },
                error: (err) => {
                    this.errorMessage.set(err?.error?.message || 'Failed to request correction');
                }
            });
    }

    updateRemarks(value: string): void {
        this.remarks.set(value);
    }

    downloadDocument(document: Document): void {
        this.documentRepository.downloadDocument(document.id).subscribe({
            next: (blob) => {
                const fileUrl = URL.createObjectURL(blob);
                const link = window.document.createElement('a');
                link.href = fileUrl;
                link.download = document.originalFilename;
                link.style.display = 'none';
                window.document.body.appendChild(link);
                link.click();
                window.document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
            },
            error: () => {
                this.errorMessage.set('Failed to download document');
            }
        });
    }

    viewDocument(document: Document): void {
        const previewTab = window.open('', '_blank', 'noopener,noreferrer');

        this.documentRepository.viewDocument(document.id).subscribe({
            next: (blob) => {
                const fileUrl = URL.createObjectURL(blob);
                if (previewTab) {
                    previewTab.location.href = fileUrl;
                } else {
                    window.open(fileUrl, '_blank', 'noopener,noreferrer');
                }
                setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
            },
            error: () => {
                if (previewTab) {
                    previewTab.close();
                }
                this.errorMessage.set('Failed to view document');
            }
        });
    }

    goBack(): void {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            this.location.back();
            return;
        }

        this.router.navigate(['/app/dashboard']);
    }

    statusLabel(status: ApplicationStatus): string {
        return status.replace(/_/g, ' ');
    }
}
