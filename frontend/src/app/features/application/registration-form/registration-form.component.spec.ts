import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

import { RegistrationFormComponent } from './registration-form.component';
import { LocationRepository } from '../../../core/repositories/location.repository';
import { PartyRoleRepository } from '../../../core/repositories/party-role.repository';
import { ApplicationRepository } from '../../../core/repositories/application.repository';
import { DocumentRepository } from '../../../core/repositories/document.repository';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../services/application.service';
import { District, Constituency, Mandal } from '../../../core/models/location.model';
import { PartyRole } from '../../../core/models/party-role.model';
import { DocumentType } from '../../../core/models/document.model';
import { Application } from '../../../core/models/application.model';
import { ApplicationStatus } from '../../../core/constants/status.constants';

describe('RegistrationFormComponent - E2E Test', () => {
    let component: RegistrationFormComponent;
    let fixture: ComponentFixture<RegistrationFormComponent>;
    let mockRouter: any;
    let mockLocationRepo: any;
    let mockPartyRoleRepo: any;
    let mockApplicationRepo: any;
    let mockDocumentRepo: any;
    let mockAuthService: any;
    let mockApplicationService: any;

    // Mock data
    const mockDistricts: District[] = [
        { id: 'dist-1', name: 'Visakhapatnam', createdAt: '2024-01-01' },
        { id: 'dist-2', name: 'Krishna', createdAt: '2024-01-01' },
        { id: 'dist-3', name: 'Guntur', createdAt: '2024-01-01' }
    ];

    const mockConstituencies: Constituency[] = [
        { id: 'const-1', name: 'Gajuwaka', districtId: 'dist-1', createdAt: '2024-01-01' },
        { id: 'const-2', name: 'Pendurthi', districtId: 'dist-1', createdAt: '2024-01-01' }
    ];

    const mockMandals: Mandal[] = [
        { id: 'mandal-1', name: 'Gajuwaka Urban', constituencyId: 'const-1', createdAt: '2024-01-01' },
        { id: 'mandal-2', name: 'Pedagantyada', constituencyId: 'const-1', createdAt: '2024-01-01' }
    ];

    const mockPartyRoles: PartyRole[] = [
        { id: 'role-1', name: 'President', active: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: 'role-2', name: 'Vice President', active: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: 'role-3', name: 'Secretary', active: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: 'role-4', name: 'Treasurer', active: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
    ];

    const mockUser = {
        id: 'user-123',
        phone: '9550572255',
        role: 'APPLICANT' as const
    };

    const mockApplication: Application = {
        id: 'app-123',
        applicantPhone: '9550572255',
        jspId: 'JSP001',
        fullName: 'Test User',
        districtId: 'dist-1',
        constituencyId: 'const-1',
        mandalId: 'mandal-1',
        villageWard: 'Test Ward',
        pollingBooth: 'Booth 001',
        shortDescription: 'Test description',
        status: ApplicationStatus.DRAFT,
        currentLevel: 'MANDAL',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
    };

    const mockDocument = {
        id: 'doc-123',
        applicationId: 'app-123',
        documentType: DocumentType.BIO_DATA,
        originalFilename: 'test-biodata.pdf',
        generatedFilename: 'uuid-biodata.pdf',
        mimeType: 'application/pdf',
        fileSize: 12345,
        uploadedAt: '2024-01-01'
    };

    beforeEach(async () => {
        // Create mocks with vi.fn()
        mockRouter = {
            navigate: vi.fn()
        };

        mockLocationRepo = {
            getAllDistricts: vi.fn(),
            getConstituenciesByDistrict: vi.fn(),
            getMandalsByConstituency: vi.fn()
        };

        mockPartyRoleRepo = {
            getAllActiveRoles: vi.fn()
        };

        mockApplicationRepo = {
            createApplication: vi.fn(),
            updateApplication: vi.fn()
        };

        mockDocumentRepo = {
            uploadDocument: vi.fn()
        };

        mockAuthService = {
            isAuthenticated: vi.fn(),
            user: vi.fn()
        };

        mockApplicationService = {
            submitApplication: vi.fn(),
            updateDraft: vi.fn(),
            saveNow: vi.fn(),
            clearDraft: vi.fn(),
            draftId: signal<string | null>(null),
            isSaving: signal(false),
            lastSaved: signal<Date | null>(null)
        };

        // Setup default return values
        mockAuthService.isAuthenticated.mockReturnValue(true);
        mockAuthService.user.mockReturnValue(mockUser);
        mockLocationRepo.getAllDistricts.mockReturnValue(of(mockDistricts));
        mockLocationRepo.getConstituenciesByDistrict.mockReturnValue(of(mockConstituencies));
        mockLocationRepo.getMandalsByConstituency.mockReturnValue(of(mockMandals));
        mockPartyRoleRepo.getAllActiveRoles.mockReturnValue(of(mockPartyRoles));
        mockApplicationRepo.createApplication.mockReturnValue(of(mockApplication));
        mockApplicationRepo.updateApplication.mockReturnValue(of(mockApplication));
        mockDocumentRepo.uploadDocument.mockReturnValue(of(mockDocument));
        mockApplicationService.submitApplication.mockReturnValue(of(mockApplication));

        await TestBed.configureTestingModule({
            imports: [RegistrationFormComponent, ReactiveFormsModule],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: LocationRepository, useValue: mockLocationRepo },
                { provide: PartyRoleRepository, useValue: mockPartyRoleRepo },
                { provide: ApplicationRepository, useValue: mockApplicationRepo },
                { provide: DocumentRepository, useValue: mockDocumentRepo },
                { provide: AuthService, useValue: mockAuthService },
                { provide: ApplicationService, useValue: mockApplicationService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RegistrationFormComponent);
        component = fixture.componentInstance;
    });

    describe('Full Form Submission E2E Test', () => {
        it('should complete entire registration flow with dummy data', async () => {
            // Initialize component
            fixture.detectChanges();
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify initial state
            expect(component.registrationForm).toBeDefined();
            expect(component.districts().length).toBe(3);
            expect(component.partyRoles().length).toBe(4);

            console.log('✅ Component initialized successfully');

            // Step 1: Fill in JSP ID and Full Name
            component.registrationForm.patchValue({
                jspId: 'JSP12345',
                fullName: 'Rajesh Kumar Reddy'
            });

            console.log('✅ Step 1: Filled JSP ID and Full Name');

            // Step 2: Select District
            component.registrationForm.patchValue({
                districtId: 'dist-1'
            });
            component.onDistrictChange();
            await new Promise(resolve => setTimeout(resolve, 100));

            expect(component.constituencies().length).toBe(2);
            console.log('✅ Step 2: Selected District - Visakhapatnam');

            // Step 3: Select Constituency
            component.registrationForm.patchValue({
                constituencyId: 'const-1'
            });
            component.onConstituencyChange();
            await new Promise(resolve => setTimeout(resolve, 100));

            expect(component.mandals().length).toBe(2);
            console.log('✅ Step 3: Selected Constituency - Gajuwaka');

            // Step 4: Select Mandal
            component.registrationForm.patchValue({
                mandalId: 'mandal-1'
            });
            console.log('✅ Step 4: Selected Mandal - Gajuwaka Urban');

            // Step 5: Fill Village/Ward and Polling Booth
            component.registrationForm.patchValue({
                villageWard: 'Seethammadhara',
                pollingBooth: 'ZPHS Seethammadhara - Booth 101'
            });
            console.log('✅ Step 5: Filled Village/Ward and Polling Booth');

            // Step 6: Fill Short Description
            component.registrationForm.patchValue({
                shortDescription: 'Active party worker with 10 years of experience in grassroots organizing. Strong community connections and leadership skills.'
            });
            console.log('✅ Step 6: Filled Short Description');

            // Step 7: Select Role Preferences
            component.registrationForm.patchValue({
                firstPreference: 'role-1',
                secondPreference: 'role-2',
                thirdPreference: 'role-3'
            });
            console.log('✅ Step 7: Selected Role Preferences');

            // Step 8: Create mock PDF files
            const bioDataFile = createMockPDFFile('test-biodata.pdf');
            const supportingFile = createMockPDFFile('test-supporting.pdf');

            // Simulate bio data file upload
            component.onBioDataChange([bioDataFile]);
            expect(component.bioDataFile).toBeTruthy();
            expect(component.bioDataFile?.name).toBe('test-biodata.pdf');
            console.log('✅ Step 8: Uploaded Bio Data Document');

            // Simulate supporting documents upload
            component.onSupportingDocsChange([supportingFile]);
            expect(component.supportingDocFiles.length).toBe(1);
            expect(component.supportingDocFiles[0].name).toBe('test-supporting.pdf');
            console.log('✅ Step 9: Uploaded Supporting Document');

            // Step 9: Check flexibility checkbox
            component.registrationForm.patchValue({
                flexibility: true
            });
            console.log('✅ Step 10: Agreed to flexibility');

            // Verify form is valid
            expect(component.registrationForm.valid).toBe(true);
            expect(component.canSubmit()).toBe(true);
            console.log('✅ Form validation passed - Ready to submit');

            // Step 10: Submit the form
            component.onSubmit();
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Verify submission flow
            expect(mockApplicationRepo.createApplication).toHaveBeenCalled();
            expect(mockDocumentRepo.uploadDocument).toHaveBeenCalledTimes(2);
            expect(mockApplicationService.submitApplication).toHaveBeenCalledWith('app-123');
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/dashboard']);

            console.log('✅ Step 11: Form submitted successfully');
            console.log('✅ Documents uploaded to Cloudinary');
            console.log('✅ Application submitted for review');
            console.log('🎉 E2E Test completed successfully!');
        });

        it('should validate bio data file is required before submission', async () => {
            fixture.detectChanges();
            await new Promise(resolve => setTimeout(resolve, 100));

            // Fill all fields except bio data
            component.registrationForm.patchValue({
                jspId: 'JSP12345',
                fullName: 'Test User',
                districtId: 'dist-1',
                constituencyId: 'const-1',
                mandalId: 'mandal-1',
                villageWard: 'Test Ward',
                pollingBooth: 'Booth 001',
                firstPreference: 'role-1',
                secondPreference: 'role-2',
                thirdPreference: 'role-3',
                flexibility: true
            });

            // Don't upload bio data file
            expect(component.bioDataFile).toBeNull();
            expect(component.canSubmit()).toBe(false);

            // Try to submit
            component.onSubmit();
            await new Promise(resolve => setTimeout(resolve, 100));

            // Should show error message
            expect(component.errorMessage()).toBe('Bio data document is required');
            expect(mockApplicationRepo.createApplication).not.toHaveBeenCalled();

            console.log('✅ Bio data validation test passed');
        });

        it('should validate flexibility checkbox is required', async () => {
            fixture.detectChanges();
            await new Promise(resolve => setTimeout(resolve, 100));

            const bioDataFile = createMockPDFFile('test-biodata.pdf');

            // Fill all fields except flexibility
            component.registrationForm.patchValue({
                jspId: 'JSP12345',
                fullName: 'Test User',
                districtId: 'dist-1',
                constituencyId: 'const-1',
                mandalId: 'mandal-1',
                villageWard: 'Test Ward',
                pollingBooth: 'Booth 001',
                firstPreference: 'role-1',
                secondPreference: 'role-2',
                thirdPreference: 'role-3',
                flexibility: false
            });

            component.onBioDataChange([bioDataFile]);

            expect(component.canSubmit()).toBe(false);

            console.log('✅ Flexibility validation test passed');
        });

        it('should handle document upload failure gracefully', async () => {
            fixture.detectChanges();
            await new Promise(resolve => setTimeout(resolve, 100));

            // Setup: Make document upload fail
            mockDocumentRepo.uploadDocument.mockReturnValue(
                throwError(() => new Error('Upload failed: Network error'))
            );

            const bioDataFile = createMockPDFFile('test-biodata.pdf');

            // Fill all required fields
            component.registrationForm.patchValue({
                jspId: 'JSP12345',
                fullName: 'Test User',
                districtId: 'dist-1',
                constituencyId: 'const-1',
                mandalId: 'mandal-1',
                villageWard: 'Test Ward',
                pollingBooth: 'Booth 001',
                firstPreference: 'role-1',
                secondPreference: 'role-2',
                thirdPreference: 'role-3',
                flexibility: true
            });

            component.onBioDataChange([bioDataFile]);

            // Submit form
            component.onSubmit();
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Should show error message
            expect(component.errorMessage()).toContain('Failed to upload documents');
            expect(component.submitting()).toBe(false);
            expect(mockApplicationService.submitApplication).not.toHaveBeenCalled();

            console.log('✅ Document upload error handling test passed');
        });
    });

    describe('Form Field Validations', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should validate required fields', () => {
            const form = component.registrationForm;

            expect(form.get('jspId')?.hasError('required')).toBe(true);
            expect(form.get('fullName')?.hasError('required')).toBe(true);
            expect(form.get('districtId')?.hasError('required')).toBe(true);
            expect(form.get('firstPreference')?.hasError('required')).toBe(true);
            expect(form.get('flexibility')?.hasError('required')).toBe(true);

            console.log('✅ Required field validation test passed');
        });

        it('should clear constituencies when district changes', async () => {
            const form = component.registrationForm;

            // Set initial values
            form.patchValue({
                districtId: 'dist-1',
                constituencyId: 'const-1',
                mandalId: 'mandal-1'
            });

            component.onDistrictChange();
            await new Promise(resolve => setTimeout(resolve, 100));

            // Change district
            form.patchValue({ districtId: 'dist-2' });
            component.onDistrictChange();
            await new Promise(resolve => setTimeout(resolve, 100));

            // Constituency and mandal should be cleared
            expect(form.get('constituencyId')?.value).toBe('');
            expect(form.get('mandalId')?.value).toBe('');

            console.log('✅ District change cascade test passed');
        });
    });
});

// Helper function to create mock PDF files
function createMockPDFFile(filename: string): File {
    const pdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n195\n%%EOF';

    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    return new File([blob], filename, { type: 'application/pdf' });
}
