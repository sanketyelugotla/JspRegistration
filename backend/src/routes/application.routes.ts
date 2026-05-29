import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createApplicationSchema, updateApplicationSchema, approveApplicationSchema } from '../validators/application.validator';
import { auditLog } from '../middlewares/audit.middleware';
import { UserRole } from '@prisma/client';

const router = Router();
const applicationController = new ApplicationController();

// All routes require authentication
router.use(authenticate);

router.post(
    '/',
    validate(createApplicationSchema),
    auditLog('CREATE_APPLICATION', 'Application'),
    applicationController.createApplication
);

router.put(
    '/:id',
    validate(updateApplicationSchema),
    auditLog('UPDATE_APPLICATION', 'Application'),
    applicationController.updateApplication
);

router.post(
    '/:id/submit',
    auditLog('SUBMIT_APPLICATION', 'Application'),
    applicationController.submitApplication
);

router.post(
    '/:id/approve',
    requireRole(UserRole.MANDAL_OFFICER, UserRole.DISTRICT_OFFICER, UserRole.STATE_OFFICER),
    validate(approveApplicationSchema),
    auditLog('APPROVE_APPLICATION', 'Application'),
    applicationController.approveApplication
);

router.post(
    '/:id/reject',
    requireRole(UserRole.MANDAL_OFFICER, UserRole.DISTRICT_OFFICER, UserRole.STATE_OFFICER),
    validate(approveApplicationSchema),
    auditLog('REJECT_APPLICATION', 'Application'),
    applicationController.rejectApplication
);

router.post(
    '/:id/request-correction',
    requireRole(UserRole.MANDAL_OFFICER, UserRole.DISTRICT_OFFICER, UserRole.STATE_OFFICER),
    validate(approveApplicationSchema),
    auditLog('REQUEST_CORRECTION_APPLICATION', 'Application'),
    applicationController.requestCorrectionApplication
);

router.get('/:id', applicationController.getApplicationById);

router.get('/', applicationController.getApplications);

router.get('/stats/summary', applicationController.getStatistics);

export default router;
