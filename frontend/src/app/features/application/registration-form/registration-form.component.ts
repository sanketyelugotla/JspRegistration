import { Component, inject, OnInit, OnDestroy, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { LocationRepository } from '../../../core/repositories/location.repository';
import { PartyRoleRepository } from '../../../core/repositories/party-role.repository';
import { ApplicationRepository } from '../../../core/repositories/application.repository';
import { DocumentRepository } from '../../../core/repositories/document.repository';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../services/application.service';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { District, Constituency, Mandal } from '../../../core/models/location.model';
import { PartyRole } from '../../../core/models/party-role.model';
import { CreateApplicationRequest } from '../../../core/models/application.model';
import { DocumentType } from '../../../core/models/document.model';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Component({
    selector: 'app-registration-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FileUploadComponent],
    templateUrl: './registration-form.component.html',
    styles: [`
    .section {
      padding-bottom: 2rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .section:last-of-type {
      border-bottom: none;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 1.5rem;
    }

    .label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .input:focus {
      outline: none;
      border-color: #3b82f6;
      ring: 2px;
      ring-color: #3b82f6;
      ring-opacity: 0.5;
    }

    .input:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }

    .input.border-red-500 {
      border-color: #ef4444;
    }

    .error-text {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: white;
      color: #374151;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      border: 1px solid #d1d5db;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #f3f4f6;
    }

    .btn-secondary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
    private fb = inject(FormBuilder);
    private locationRepository = inject(LocationRepository);
    private partyRoleRepository = inject(PartyRoleRepository);
    private documentRepository = inject(DocumentRepository);
    private authService = inject(AuthService);
    private applicationRepository = inject(ApplicationRepository);
    applicationService = inject(ApplicationService);
    private router = inject(Router);

    registrationForm!: FormGroup;

    districts = signal<District[]>([]);
    constituencies = signal<Constituency[]>([]);
    mandals = signal<Mandal[]>([]);
    partyRoles = signal<PartyRole[]>([]);

    bioDataFile: File | null = null;
    supportingDocFiles: File[] = [];

    submitting = signal(false);
    errorMessage = signal('');

    ngOnInit(): void {
        console.log('🚀 Registration Form Component Initialized');

        // Redirect if not authenticated
        if (!this.authService.isAuthenticated()) {
            console.log('⚠️ User not authenticated, redirecting to login');
            this.router.navigate(['/auth/login']);
            return;
        }

        console.log('✅ User authenticated:', this.authService.user());

        // Initialize form
        const user = this.authService.user();
        this.registrationForm = this.fb.group({
            phone: [{ value: user?.phone || '', disabled: true }],
            jspId: ['', Validators.required],
            fullName: ['', Validators.required],
            districtId: ['', Validators.required],
            constituencyId: ['', Validators.required],
            mandalId: ['', Validators.required],
            villageWard: ['', Validators.required],
            pollingBooth: ['', Validators.required],
            shortDescription: [''],
            firstPreference: ['', Validators.required],
            secondPreference: ['', Validators.required],
            thirdPreference: ['', Validators.required],
            flexibility: [false, Validators.requiredTrue]
        });

        console.log('📝 Form initialized');

        // Load initial data
        this.loadDistricts();
        this.loadPartyRoles();

        // Set up auto-save
        this.registrationForm.valueChanges.subscribe(() => {
            this.triggerAutoSave();
        });
    }

    ngOnDestroy(): void {
        // Save draft on component destroy
        this.saveDraft();
    }

    loadDistricts(): void {
        console.log('🔍 Loading districts...');
        this.locationRepository.getDistricts().subscribe({
            next: (response) => {
                console.log('✅ Districts loaded:', response);
                this.districts.set(response.data || []);
                console.log('📊 Districts count:', this.districts().length);
            },
            error: (error: any) => {
                console.error('❌ Failed to load districts:', error);
            }
        });
    }

    loadPartyRoles(): void {
        console.log('🔍 Loading party roles...');
        this.partyRoleRepository.getPartyRoles().subscribe({
            next: (response) => {
                console.log('✅ Party roles loaded:', response);
                this.partyRoles.set(response.data || []);
                console.log('📊 Party roles count:', this.partyRoles().length);
            },
            error: (error: any) => {
                console.error('❌ Failed to load party roles:', error);
            }
        });
    }

    onDistrictChange(): void {
        const districtId = this.registrationForm.get('districtId')?.value;
        console.log('🔄 District changed:', districtId);

        // Reset dependent dropdowns
        this.registrationForm.patchValue({
            constituencyId: '',
            mandalId: ''
        });
        this.constituencies.set([]);
        this.mandals.set([]);

        if (districtId && districtId.trim() !== '') {
            console.log('🔍 Loading constituencies for district:', districtId);
            console.log('🌐 API URL:', `${API_ENDPOINTS.LOCATIONS.CONSTITUENCIES}?districtId=${districtId}`);

            this.locationRepository.getConstituencies(districtId).subscribe({
                next: (response) => {
                    console.log('✅ Constituencies API response:', response);
                    console.log('✅ Constituencies data:', response.data);

                    if (response && response.data && Array.isArray(response.data)) {
                        this.constituencies.set(response.data);
                        console.log('📊 Constituencies count:', response.data.length);
                        console.log('📋 Constituencies:', response.data.map(c => c.name));
                    } else {
                        console.warn('⚠️ Invalid constituencies response format:', response);
                        this.constituencies.set([]);
                    }
                },
                error: (error: any) => {
                    console.error('❌ Failed to load constituencies:', error);
                    console.error('❌ Error details:', error.message, error.status);
                    this.constituencies.set([]);
                }
            });
        } else {
            console.log('⚠️ No district selected or invalid districtId');
        }
    }

    onConstituencyChange(): void {
        const constituencyId = this.registrationForm.get('constituencyId')?.value;
        console.log('🔄 Constituency changed:', constituencyId);

        // Reset dependent dropdown
        this.registrationForm.patchValue({ mandalId: '' });
        this.mandals.set([]);

        if (constituencyId && constituencyId.trim() !== '') {
            console.log('🔍 Loading mandals for constituency:', constituencyId);
            console.log('🌐 API URL:', `${API_ENDPOINTS.LOCATIONS.MANDALS}?constituencyId=${constituencyId}`);

            this.locationRepository.getMandals(constituencyId).subscribe({
                next: (response) => {
                    console.log('✅ Mandals API response:', response);
                    console.log('✅ Mandals data:', response.data);

                    if (response && response.data && Array.isArray(response.data)) {
                        this.mandals.set(response.data);
                        console.log('📊 Mandals count:', response.data.length);
                        console.log('📋 Mandals:', response.data.map(m => m.name));
                    } else {
                        console.warn('⚠️ Invalid mandals response format:', response);
                        this.mandals.set([]);
                    }
                },
                error: (error: any) => {
                    console.error('❌ Failed to load mandals:', error);
                    console.error('❌ Error details:', error.message, error.status);
                    this.mandals.set([]);
                }
            });
        } else {
            console.log('⚠️ No constituency selected or invalid constituencyId');
        }
    }

    onBioDataChange(files: File[]): void {
        this.bioDataFile = files.length > 0 ? files[0] : null;
    }

    onSupportingDocsChange(files: File[]): void {
        this.supportingDocFiles = files;
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.registrationForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    triggerAutoSave(): void {
        const formValue = this.registrationForm.getRawValue();
        const draft: Partial<CreateApplicationRequest> = {
            jspId: formValue.jspId,
            fullName: formValue.fullName,
            districtId: formValue.districtId,
            constituencyId: formValue.constituencyId,
            mandalId: formValue.mandalId,
            villageWard: formValue.villageWard,
            pollingBooth: formValue.pollingBooth,
            shortDescription: formValue.shortDescription,
            rolePreferences: this.buildRolePreferences()
        };
        this.applicationService.updateDraft(draft);
    }

    saveDraft(): void {
        const formValue = this.registrationForm.getRawValue();
        const draft: Partial<CreateApplicationRequest> = {
            jspId: formValue.jspId,
            fullName: formValue.fullName,
            districtId: formValue.districtId,
            constituencyId: formValue.constituencyId,
            mandalId: formValue.mandalId,
            villageWard: formValue.villageWard,
            pollingBooth: formValue.pollingBooth,
            shortDescription: formValue.shortDescription,
            rolePreferences: this.buildRolePreferences()
        };
        this.applicationService.saveNow(draft);
    }

    canSubmit(): boolean {
        const flexibilityChecked = this.registrationForm.get('flexibility')?.value === true;
        const formValid = this.registrationForm.valid;
        const hasBioData = this.bioDataFile !== null;
        return formValid && flexibilityChecked && hasBioData;
    }

    onSubmit(): void {
        if (this.registrationForm.invalid) {
            this.registrationForm.markAllAsTouched();
            this.errorMessage.set('Please fill in all required fields');
            return;
        }

        if (!this.registrationForm.get('flexibility')?.value) {
            this.errorMessage.set('You must agree to flexibility to submit the application');
            return;
        }

        if (!this.bioDataFile) {
            this.errorMessage.set('Bio data document is required');
            return;
        }

        this.submitting.set(true);
        this.errorMessage.set('');

        const formValue = this.registrationForm.getRawValue();
        const applicationData: CreateApplicationRequest = {
            jspId: formValue.jspId,
            fullName: formValue.fullName,
            districtId: formValue.districtId,
            constituencyId: formValue.constituencyId,
            mandalId: formValue.mandalId,
            villageWard: formValue.villageWard,
            pollingBooth: formValue.pollingBooth,
            shortDescription: formValue.shortDescription,
            rolePreferences: this.buildRolePreferences()
        };

        console.log('📝 Submitting application:', applicationData);

        // First create/update the application
        const existingId = this.applicationService.draftId();
        const saveObservable = existingId
            ? this.applicationRepository.updateApplication(existingId, applicationData)
            : this.applicationRepository.createApplication(applicationData);

        saveObservable.subscribe({
            next: (saveResponse) => {
                console.log('✅ Application saved:', saveResponse);
                const appId = saveResponse.id;

                // Upload documents before submitting
                this.uploadDocuments(appId).subscribe({
                    next: () => {
                        console.log('✅ All documents uploaded');
                        // Now submit the application
                        this.applicationService.submitApplication(appId).subscribe({
                            next: (submitResponse) => {
                                console.log('✅ Application submitted:', submitResponse);
                                this.submitting.set(false);
                                this.applicationService.clearDraft();
                                alert('Application submitted successfully! It will be reviewed by the Mandal Officer.');
                                this.router.navigate(['/app/dashboard']);
                            },
                            error: (submitError) => {
                                console.error('❌ Submit error:', submitError);
                                this.submitting.set(false);
                                this.errorMessage.set(submitError.message || 'Failed to submit application');
                            }
                        });
                    },
                    error: (uploadError) => {
                        console.error('❌ Document upload error:', uploadError);
                        this.submitting.set(false);
                        this.errorMessage.set('Failed to upload documents: ' + uploadError.message);
                    }
                });
            },
            error: (saveError) => {
                console.error('❌ Save error:', saveError);
                this.submitting.set(false);
                this.errorMessage.set(saveError.message || 'Failed to save application');
            }
        });
    }

    private uploadDocuments(applicationId: string): Observable<any> {
        const uploads: Observable<any>[] = [];

        // Upload bio data document (required)
        if (this.bioDataFile) {
            console.log('📤 Uploading bio data file:', this.bioDataFile.name);
            uploads.push(this.documentRepository.uploadDocument(applicationId, DocumentType.BIO_DATA, this.bioDataFile));
        }

        // Upload supporting documents (optional)
        if (this.supportingDocFiles.length > 0) {
            console.log('📤 Uploading', this.supportingDocFiles.length, 'supporting files');
            this.supportingDocFiles.forEach(file => {
                uploads.push(this.documentRepository.uploadDocument(applicationId, DocumentType.SUPPORTING, file));
            });
        }

        // If no files to upload, return completed observable
        if (uploads.length === 0) {
            console.log('⚠️ No files to upload');
            return new Observable(observer => {
                observer.next(null);
                observer.complete();
            });
        }

        // Upload all files in parallel
        return forkJoin(uploads);
    }

    private buildRolePreferences() {
        const firstPref = this.registrationForm.get('firstPreference')?.value;
        const secondPref = this.registrationForm.get('secondPreference')?.value;
        const thirdPref = this.registrationForm.get('thirdPreference')?.value;
        const flexibility = this.registrationForm.get('flexibility')?.value;

        if (!firstPref && !secondPref && !thirdPref) {
            return undefined;
        }

        return {
            preferredRole1Id: firstPref || undefined,
            preferredRole2Id: secondPref || undefined,
            preferredRole3Id: thirdPref || undefined,
            flexibilityAgreed: flexibility === true
        };
    }

    formatTime(date: Date): string {
        return date.toLocaleTimeString();
    }
}
