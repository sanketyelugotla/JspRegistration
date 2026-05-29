import prisma from '../config/database.config';
import { ApplicationStatus, UserRole } from '@prisma/client';

export interface ApplicationFilters {
    status?: ApplicationStatus;
    mandalId?: string;
    constituencyId?: string;
    districtId?: string;
    applicantPhone?: string;
    jspId?: string;
    fromDate?: Date;
    toDate?: Date;
}

export class ApplicationRepository {
    async create(data: {
        applicantPhone: string;
        jspId: string;
        fullName: string;
        districtId: string;
        constituencyId: string;
        mandalId: string;
        villageWard: string;
        pollingBooth: string;
        shortDescription?: string;
    }) {
        return prisma.application.create({
            data: {
                ...data,
                status: ApplicationStatus.DRAFT,
            },
        });
    }

    async update(id: string, data: Partial<{
        jspId: string;
        fullName: string;
        districtId: string;
        constituencyId: string;
        mandalId: string;
        villageWard: string;
        pollingBooth: string;
        shortDescription: string;
    }>) {
        return prisma.application.update({
            where: { id },
            data,
        });
    }

    async updateStatus(id: string, status: ApplicationStatus, currentLevel?: string) {
        return prisma.application.update({
            where: { id },
            data: { status, currentLevel },
        });
    }

    async createApprovalHistory(data: {
        applicationId: string;
        officerId: string;
        role: UserRole;
        action: 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION';
        remarks?: string;
        previousStatus: ApplicationStatus;
        newStatus: ApplicationStatus;
        ipAddress?: string;
    }) {
        return prisma.approvalHistory.create({
            data,
        });
    }

    async findById(id: string) {
        return prisma.application.findUnique({
            where: { id },
            include: {
                district: true,
                constituency: true,
                mandal: true,
                rolePreference: {
                    include: {
                        preferredRole1: true,
                        preferredRole2: true,
                        preferredRole3: true,
                    },
                },
                documents: true,
                approvalHistory: {
                    include: {
                        officer: {
                            select: {
                                id: true,
                                phone: true,
                                role: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }

    async findMany(filters: ApplicationFilters, page: number = 1, limit: number = 10) {
        const where: any = {};

        if (filters.status) where.status = filters.status;
        if (filters.mandalId) where.mandalId = filters.mandalId;
        if (filters.constituencyId) where.constituencyId = filters.constituencyId;
        if (filters.districtId) where.districtId = filters.districtId;
        if (filters.applicantPhone) where.applicantPhone = { contains: filters.applicantPhone };
        if (filters.jspId) where.jspId = { contains: filters.jspId };
        if (filters.fromDate || filters.toDate) {
            where.createdAt = {};
            if (filters.fromDate) where.createdAt.gte = filters.fromDate;
            if (filters.toDate) where.createdAt.lte = filters.toDate;
        }

        const [applications, total] = await Promise.all([
            prisma.application.findMany({
                where,
                include: {
                    district: true,
                    constituency: true,
                    mandal: true,
                    rolePreference: {
                        include: {
                            preferredRole1: true,
                            preferredRole2: true,
                            preferredRole3: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.application.count({ where }),
        ]);

        return { applications, total };
    }

    async getStatistics(filters?: {
        mandalId?: string;
        constituencyId?: string;
        districtId?: string;
    }) {
        const where: any = {};
        if (filters?.mandalId) where.mandalId = filters.mandalId;
        if (filters?.constituencyId) where.constituencyId = filters.constituencyId;
        if (filters?.districtId) where.districtId = filters.districtId;

        const [
            total,
            draft,
            submitted,
            mandalReview,
            districtReview,
            stateReview,
            approved,
            rejected,
            correctionRequired,
        ] = await Promise.all([
            prisma.application.count({ where }),
            prisma.application.count({ where: { ...where, status: ApplicationStatus.DRAFT } }),
            prisma.application.count({ where: { ...where, status: ApplicationStatus.SUBMITTED } }),
            prisma.application.count({ where: { ...where, status: ApplicationStatus.MANDAL_REVIEW } }),
            prisma.application.count({ where: { ...where, status: ApplicationStatus.DISTRICT_REVIEW } }),
            prisma.application.count({ where: { ...where, status: ApplicationStatus.STATE_REVIEW } }),
            prisma.application.count({ where: { ...where, status: ApplicationStatus.APPROVED } }),
            prisma.application.count({ where: { ...where, status: ApplicationStatus.REJECTED } }),
            prisma.application.count({ where: { ...where, status: ApplicationStatus.CORRECTION_REQUIRED } }),
        ]);

        return {
            total,
            draft,
            submitted,
            mandalReview,
            districtReview,
            stateReview,
            approved,
            rejected,
            correctionRequired,
        };
    }

    async createRolePreference(data: {
        applicationId: string;
        preferredRole1Id?: string;
        preferredRole2Id?: string;
        preferredRole3Id?: string;
        flexibilityAgreed: boolean;
    }) {
        return prisma.rolePreference.create({ data });
    }

    async updateRolePreference(applicationId: string, data: {
        preferredRole1Id?: string;
        preferredRole2Id?: string;
        preferredRole3Id?: string;
        flexibilityAgreed: boolean;
    }) {
        return prisma.rolePreference.upsert({
            where: { applicationId },
            update: data,
            create: { applicationId, ...data },
        });
    }
}
