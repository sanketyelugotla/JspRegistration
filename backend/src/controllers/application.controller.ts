import { Response } from 'express';
import { ApplicationService } from '../services/application.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { logger } from '../utils/logger';
import { AuthRequest } from '../types/auth.types';
import { ApplicationStatus } from '@prisma/client';

export class ApplicationController {
    private applicationService: ApplicationService;

    constructor() {
        this.applicationService = new ApplicationService();
    }

    createApplication = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return errorResponse(res, 'Unauthorized', 401);
            }

            const data = {
                ...req.body,
                applicantPhone: req.user.phone,
            };

            const application = await this.applicationService.createDraft(data);
            return successResponse(res, application, 'Application created successfully', 201);
        } catch (error: any) {
            logger.error('Create application error:', error);
            return errorResponse(res, error.message || 'Failed to create application', 500);
        }
    };

    updateApplication = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const application = await this.applicationService.updateDraft(id, req.body);
            return successResponse(res, application, 'Application updated successfully');
        } catch (error: any) {
            logger.error('Update application error:', error);
            return errorResponse(res, error.message || 'Failed to update application', 500);
        }
    };

    submitApplication = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const application = await this.applicationService.submitApplication(id);
            return successResponse(res, application, 'Application submitted successfully');
        } catch (error: any) {
            logger.error('Submit application error:', error);
            return errorResponse(res, error.message || 'Failed to submit application', 400);
        }
    };

    approveApplication = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return errorResponse(res, 'Unauthorized', 401);
            }

            const { id } = req.params;
            const { remarks } = req.body || {};

            const application = await this.applicationService.approveApplication(
                id,
                {
                    userId: req.user.userId,
                    role: req.user.role,
                    assignedDistrictId: req.user.assignedDistrictId || undefined,
                    assignedMandalId: req.user.assignedMandalId || undefined,
                },
                req.ip,
                remarks
            );

            return successResponse(res, application, 'Application approved successfully');
        } catch (error: any) {
            logger.error('Approve application error:', error);
            return errorResponse(res, error.message || 'Failed to approve application', 400);
        }
    };

    rejectApplication = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return errorResponse(res, 'Unauthorized', 401);
            }

            const { id } = req.params;
            const { remarks } = req.body || {};

            const application = await this.applicationService.rejectApplication(
                id,
                {
                    userId: req.user.userId,
                    role: req.user.role,
                    assignedDistrictId: req.user.assignedDistrictId || undefined,
                    assignedMandalId: req.user.assignedMandalId || undefined,
                },
                req.ip,
                remarks
            );

            return successResponse(res, application, 'Application rejected successfully');
        } catch (error: any) {
            logger.error('Reject application error:', error);
            return errorResponse(res, error.message || 'Failed to reject application', 400);
        }
    };

    requestCorrectionApplication = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return errorResponse(res, 'Unauthorized', 401);
            }

            const { id } = req.params;
            const { remarks } = req.body || {};

            const application = await this.applicationService.requestCorrectionApplication(
                id,
                {
                    userId: req.user.userId,
                    role: req.user.role,
                    assignedDistrictId: req.user.assignedDistrictId || undefined,
                    assignedMandalId: req.user.assignedMandalId || undefined,
                },
                req.ip,
                remarks
            );

            return successResponse(res, application, 'Correction requested successfully');
        } catch (error: any) {
            logger.error('Request correction error:', error);
            return errorResponse(res, error.message || 'Failed to request correction', 400);
        }
    };

    getApplicationById = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return errorResponse(res, 'Unauthorized', 401);
            }

            const { id } = req.params;
            const application = await this.applicationService.getApplicationById(
                id,
                req.user.role,
                {
                    mandalId: req.user.assignedMandalId || undefined,
                    constituencyId: req.user.assignedConstituencyId || undefined,
                    districtId: req.user.assignedDistrictId || undefined,
                    phone: req.user.phone,
                }
            );
            return successResponse(res, application, 'Application fetched successfully');
        } catch (error: any) {
            logger.error('Get application error:', error);
            return errorResponse(res, error.message || 'Failed to fetch application', 500);
        }
    };

    getApplications = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return errorResponse(res, 'Unauthorized', 401);
            }

            const { status, applicantPhone, jspId, fromDate, toDate, page = '1', limit = '10' } = req.query;

            const result = await this.applicationService.getApplications(
                {
                    status: status as ApplicationStatus,
                    applicantPhone: applicantPhone as string,
                    jspId: jspId as string,
                    fromDate: fromDate as string,
                    toDate: toDate as string,
                },
                parseInt(page as string),
                parseInt(limit as string),
                req.user.role,
                {
                    mandalId: req.user.assignedMandalId || undefined,
                    constituencyId: req.user.assignedConstituencyId || undefined,
                    districtId: req.user.assignedDistrictId || undefined,
                }
            );

            return successResponse(res, result.applications, 'Applications fetched successfully', 200, {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
            });
        } catch (error: any) {
            logger.error('Get applications error:', error);
            return errorResponse(res, error.message || 'Failed to fetch applications', 500);
        }
    };

    getStatistics = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return errorResponse(res, 'Unauthorized', 401);
            }

            const stats = await this.applicationService.getStatistics(req.user.role, {
                mandalId: req.user.assignedMandalId || undefined,
                constituencyId: req.user.assignedConstituencyId || undefined,
                districtId: req.user.assignedDistrictId || undefined,
            });

            return successResponse(res, stats, 'Statistics fetched successfully');
        } catch (error: any) {
            logger.error('Get statistics error:', error);
            return errorResponse(res, error.message || 'Failed to fetch statistics', 500);
        }
    };
}
