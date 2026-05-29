import { ApplicationRepository } from '../repositories/application.repository';
import { ApplicationStatus, UserRole } from '@prisma/client';

export class ApplicationService {
    private applicationRepository: ApplicationRepository;

    constructor() {
        this.applicationRepository = new ApplicationRepository();
    }

    async createDraft(data: {
        applicantPhone: string;
        jspId: string;
        fullName: string;
        districtId: string;
        constituencyId: string;
        mandalId: string;
        villageWard: string;
        pollingBooth: string;
        shortDescription?: string;
        rolePreferences?: {
            preferredRole1Id?: string;
            preferredRole2Id?: string;
            preferredRole3Id?: string;
            flexibilityAgreed: boolean;
        };
    }) {
        const application = await this.applicationRepository.create({
            applicantPhone: data.applicantPhone,
            jspId: data.jspId,
            fullName: data.fullName,
            districtId: data.districtId,
            constituencyId: data.constituencyId,
            mandalId: data.mandalId,
            villageWard: data.villageWard,
            pollingBooth: data.pollingBooth,
            shortDescription: data.shortDescription,
        });

        if (data.rolePreferences) {
            await this.applicationRepository.createRolePreference({
                applicationId: application.id,
                ...data.rolePreferences,
            });
        }

        return application;
    }

    async updateDraft(id: string, data: {
        jspId?: string;
        fullName?: string;
        districtId?: string;
        constituencyId?: string;
        mandalId?: string;
        villageWard?: string;
        pollingBooth?: string;
        shortDescription?: string;
        rolePreferences?: {
            preferredRole1Id?: string;
            preferredRole2Id?: string;
            preferredRole3Id?: string;
            flexibilityAgreed: boolean;
        };
    }) {
        const application = await this.applicationRepository.update(id, {
            jspId: data.jspId,
            fullName: data.fullName,
            districtId: data.districtId,
            constituencyId: data.constituencyId,
            mandalId: data.mandalId,
            villageWard: data.villageWard,
            pollingBooth: data.pollingBooth,
            shortDescription: data.shortDescription,
        });

        if (data.rolePreferences) {
            await this.applicationRepository.updateRolePreference(id, data.rolePreferences);
        }

        return application;
    }

    async submitApplication(id: string) {
        // Validate that application has required documents
        const application = await this.applicationRepository.findById(id);
        if (!application) {
            throw new Error('Application not found');
        }

        if (application.status !== ApplicationStatus.DRAFT && application.status !== ApplicationStatus.CORRECTION_REQUIRED) {
            throw new Error('Only draft or correction-required applications can be submitted');
        }

        // Check for bio data document
        const hasBioData = application.documents.some(doc => doc.documentType === 'BIO_DATA');
        if (!hasBioData) {
            throw new Error('Bio data document is required');
        }

        // Update status to SUBMITTED
        return this.applicationRepository.updateStatus(id, ApplicationStatus.SUBMITTED, 'MANDAL');
    }

    async approveApplication(
        id: string,
        officer: {
            userId: string;
            role: UserRole;
            assignedDistrictId?: string;
            assignedMandalId?: string;
        },
        ipAddress?: string,
        remarks?: string
    ) {
        const application = await this.applicationRepository.findById(id);
        if (!application) {
            throw new Error('Application not found');
        }

        this.assertOfficerCanReviewApplication(application, officer, 'approve');

        let nextStatus: ApplicationStatus;
        let nextLevel: string;

        if (officer.role === UserRole.MANDAL_OFFICER) {
            nextStatus = ApplicationStatus.DISTRICT_REVIEW;
            nextLevel = 'DISTRICT';
        } else if (officer.role === UserRole.DISTRICT_OFFICER) {
            nextStatus = ApplicationStatus.STATE_REVIEW;
            nextLevel = 'STATE';
        } else {
            nextStatus = ApplicationStatus.APPROVED;
            nextLevel = 'COMPLETED';
        }

        const updatedApplication = await this.applicationRepository.updateStatus(id, nextStatus, nextLevel);

        await this.applicationRepository.createApprovalHistory({
            applicationId: id,
            officerId: officer.userId,
            role: officer.role,
            action: 'APPROVE',
            remarks,
            previousStatus: application.status,
            newStatus: nextStatus,
            ipAddress,
        });

        return updatedApplication;
    }

    async rejectApplication(
        id: string,
        officer: {
            userId: string;
            role: UserRole;
            assignedDistrictId?: string;
            assignedMandalId?: string;
        },
        ipAddress?: string,
        remarks?: string
    ) {
        const application = await this.applicationRepository.findById(id);
        if (!application) {
            throw new Error('Application not found');
        }

        this.assertOfficerCanReviewApplication(application, officer, 'reject');

        const updatedApplication = await this.applicationRepository.updateStatus(
            id,
            ApplicationStatus.REJECTED,
            'COMPLETED'
        );

        await this.applicationRepository.createApprovalHistory({
            applicationId: id,
            officerId: officer.userId,
            role: officer.role,
            action: 'REJECT',
            remarks,
            previousStatus: application.status,
            newStatus: ApplicationStatus.REJECTED,
            ipAddress,
        });

        return updatedApplication;
    }

    async requestCorrectionApplication(
        id: string,
        officer: {
            userId: string;
            role: UserRole;
            assignedDistrictId?: string;
            assignedMandalId?: string;
        },
        ipAddress?: string,
        remarks?: string
    ) {
        const application = await this.applicationRepository.findById(id);
        if (!application) {
            throw new Error('Application not found');
        }

        this.assertOfficerCanReviewApplication(application, officer, 'request correction');

        const updatedApplication = await this.applicationRepository.updateStatus(
            id,
            ApplicationStatus.CORRECTION_REQUIRED,
            'APPLICANT'
        );

        await this.applicationRepository.createApprovalHistory({
            applicationId: id,
            officerId: officer.userId,
            role: officer.role,
            action: 'REQUEST_CORRECTION',
            remarks,
            previousStatus: application.status,
            newStatus: ApplicationStatus.CORRECTION_REQUIRED,
            ipAddress,
        });

        return updatedApplication;
    }

    async getApplicationById(id: string, userRole: UserRole, userAssignments?: {
        mandalId?: string;
        constituencyId?: string;
        districtId?: string;
        phone?: string;
    }) {
        const application = await this.applicationRepository.findById(id);
        if (!application) {
            throw new Error('Application not found');
        }

        // Authorization check
        if (!this.canAccessApplication(application, userRole, userAssignments)) {
            throw new Error('Forbidden: You do not have access to this application');
        }

        return application;
    }

    async getApplications(
        filters: {
            status?: ApplicationStatus;
            applicantPhone?: string;
            jspId?: string;
            fromDate?: string;
            toDate?: string;
        },
        page: number,
        limit: number,
        userRole: UserRole,
        userAssignments?: {
            mandalId?: string;
            constituencyId?: string;
            districtId?: string;
        }
    ) {
        // Apply role-based filtering
        const enhancedFilters = this.applyRoleBasedFilters(filters, userRole, userAssignments);

        const { applications, total } = await this.applicationRepository.findMany(
            enhancedFilters,
            page,
            limit
        );

        return {
            applications,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getStatistics(userRole: UserRole, userAssignments?: {
        mandalId?: string;
        constituencyId?: string;
        districtId?: string;
    }) {
        const filters: any = {};

        if (userRole === UserRole.MANDAL_OFFICER && userAssignments?.mandalId) {
            filters.mandalId = userAssignments.mandalId;
        } else if (userRole === UserRole.DISTRICT_OFFICER && userAssignments?.districtId) {
            filters.districtId = userAssignments.districtId;
        }
        // State officers and super admin see all

        return this.applicationRepository.getStatistics(filters);
    }

    private canAccessApplication(
        application: any,
        userRole: UserRole,
        userAssignments?: {
            mandalId?: string;
            constituencyId?: string;
            districtId?: string;
            phone?: string;
        }
    ): boolean {
        // Super admin can access all
        if (userRole === UserRole.SUPER_ADMIN) return true;

        // State officer can access all
        if (userRole === UserRole.STATE_OFFICER) {
            return application.status === ApplicationStatus.STATE_REVIEW;
        }

        // District officer can access applications in their district
        if (userRole === UserRole.DISTRICT_OFFICER) {
            return (
                application.districtId === userAssignments?.districtId &&
                application.status === ApplicationStatus.DISTRICT_REVIEW
            );
        }

        // Mandal officer can access applications in their mandal
        if (userRole === UserRole.MANDAL_OFFICER) {
            return (
                application.mandalId === userAssignments?.mandalId &&
                application.status === ApplicationStatus.SUBMITTED
            );
        }

        // Applicant can only access their own
        if (userRole === UserRole.APPLICANT) {
            return application.applicantPhone === userAssignments?.phone;
        }

        return false;
    }

    private applyRoleBasedFilters(
        filters: any,
        userRole: UserRole,
        userAssignments?: {
            mandalId?: string;
            constituencyId?: string;
            districtId?: string;
        }
    ) {
        const enhancedFilters = { ...filters };

        if (userRole === UserRole.MANDAL_OFFICER && userAssignments?.mandalId) {
            enhancedFilters.mandalId = userAssignments.mandalId;
            enhancedFilters.status = ApplicationStatus.SUBMITTED;
        } else if (userRole === UserRole.DISTRICT_OFFICER && userAssignments?.districtId) {
            enhancedFilters.districtId = userAssignments.districtId;
            enhancedFilters.status = ApplicationStatus.DISTRICT_REVIEW;
        } else if (userRole === UserRole.STATE_OFFICER) {
            enhancedFilters.status = ApplicationStatus.STATE_REVIEW;
        }
        // State officers and super admin see all (no additional filters)

        return enhancedFilters;
    }

    private assertOfficerCanReviewApplication(
        application: any,
        officer: {
            role: UserRole;
            assignedDistrictId?: string;
            assignedMandalId?: string;
        },
        actionLabel: string
    ): void {
        if (officer.role === UserRole.MANDAL_OFFICER) {
            if (application.mandalId !== officer.assignedMandalId) {
                throw new Error('Forbidden: You do not have access to this application');
            }
            if (application.status !== ApplicationStatus.SUBMITTED) {
                throw new Error(`Only submitted applications can be ${actionLabel} at mandal level`);
            }
            return;
        }

        if (officer.role === UserRole.DISTRICT_OFFICER) {
            if (application.districtId !== officer.assignedDistrictId) {
                throw new Error('Forbidden: You do not have access to this application');
            }
            if (application.status !== ApplicationStatus.DISTRICT_REVIEW) {
                throw new Error(`Only district-review applications can be ${actionLabel} at district level`);
            }
            return;
        }

        if (officer.role === UserRole.STATE_OFFICER) {
            if (application.status !== ApplicationStatus.STATE_REVIEW) {
                throw new Error(`Only state-review applications can be ${actionLabel} at state level`);
            }
            return;
        }

        throw new Error('Forbidden: Only officers can perform review actions');
    }
}
