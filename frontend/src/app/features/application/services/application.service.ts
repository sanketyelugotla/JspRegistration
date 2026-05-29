import { Injectable, signal, inject } from '@angular/core';
import { ApplicationRepository } from '../../../core/repositories/application.repository';
import { CreateApplicationRequest, Application } from '../../../core/models/application.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    private applicationRepository = inject(ApplicationRepository);

    // Auto-save subject
    private autoSaveSubject = new Subject<Partial<CreateApplicationRequest>>();

    // Current draft
    currentDraft = signal<Partial<CreateApplicationRequest> | null>(null);
    draftId = signal<string | null>(null);
    isSaving = signal(false);
    lastSaved = signal<Date | null>(null);

    constructor() {
        // Set up auto-save with 30 second debounce
        this.autoSaveSubject.pipe(
            debounceTime(30000), // 30 seconds
            distinctUntilChanged()
        ).subscribe(draft => {
            this.saveDraft(draft);
        });
    }

    // Trigger auto-save
    updateDraft(draft: Partial<CreateApplicationRequest>): void {
        this.currentDraft.set(draft);
        this.autoSaveSubject.next(draft);
    }

    // Save draft to backend
    private saveDraft(draft: Partial<CreateApplicationRequest>): void {
        if (!draft.jspId && !draft.fullName) return; // Need at least some data

        this.isSaving.set(true);

        const applicationData: CreateApplicationRequest = {
            jspId: draft.jspId || '',
            fullName: draft.fullName || '',
            districtId: draft.districtId || '',
            constituencyId: draft.constituencyId || '',
            mandalId: draft.mandalId || '',
            villageWard: draft.villageWard || '',
            pollingBooth: draft.pollingBooth || '',
            shortDescription: draft.shortDescription,
            rolePreferences: draft.rolePreferences
        };

        const existingId = this.draftId();

        if (existingId) {
            // Update existing draft
            this.applicationRepository.updateApplication(existingId, applicationData).subscribe({
                next: (response) => {
                    this.isSaving.set(false);
                    this.lastSaved.set(new Date());
                    console.log('Draft auto-saved successfully');
                },
                error: (error) => {
                    this.isSaving.set(false);
                    console.error('Failed to auto-save draft:', error);
                }
            });
        } else {
            // Create new draft
            this.applicationRepository.createApplication(applicationData).subscribe({
                next: (response) => {
                    this.draftId.set(response.id);
                    this.isSaving.set(false);
                    this.lastSaved.set(new Date());
                    console.log('Draft created and saved successfully');
                },
                error: (error) => {
                    this.isSaving.set(false);
                    console.error('Failed to create draft:', error);
                }
            });
        }
    }

    // Manual save
    saveNow(draft: Partial<CreateApplicationRequest>): void {
        this.saveDraft(draft);
    }

    // Clear draft
    clearDraft(): void {
        this.currentDraft.set(null);
        this.draftId.set(null);
        this.lastSaved.set(null);
    }

    // Submit application
    submitApplication(applicationId: string) {
        return this.applicationRepository.submitApplication(applicationId);
    }
}
