import { Router } from 'express';
import { PartyRoleRepository } from '../repositories/party-role.repository';
import { successResponse, errorResponse } from '../utils/response.util';
import { Request, Response } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();
const partyRoleRepository = new PartyRoleRepository();

// Public route - get active roles only
router.get('/', async (req: Request, res: Response) => {
    try {
        const roles = await partyRoleRepository.getAllActiveRoles();
        return successResponse(res, roles, 'Party roles fetched successfully');
    } catch (error: any) {
        return errorResponse(res, error.message || 'Failed to fetch party roles', 500);
    }
});

// Admin routes - protected
router.get(
    '/all',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN),
    async (req: Request, res: Response) => {
        try {
            const roles = await partyRoleRepository.getAllRoles();
            return successResponse(res, roles, 'All party roles fetched successfully');
        } catch (error: any) {
            return errorResponse(res, error.message || 'Failed to fetch party roles', 500);
        }
    }
);

router.post(
    '/',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN),
    async (req: Request, res: Response) => {
        try {
            const { name } = req.body;
            if (!name) {
                return errorResponse(res, 'Role name is required', 400);
            }
            const role = await partyRoleRepository.createRole(name);
            return successResponse(res, role, 'Party role created successfully', 201);
        } catch (error: any) {
            return errorResponse(res, error.message || 'Failed to create party role', 500);
        }
    }
);

router.put(
    '/:id',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN),
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, active } = req.body;
            const role = await partyRoleRepository.updateRole(id, name, active);
            return successResponse(res, role, 'Party role updated successfully');
        } catch (error: any) {
            return errorResponse(res, error.message || 'Failed to update party role', 500);
        }
    }
);

router.delete(
    '/:id',
    authenticate,
    requireRole(UserRole.SUPER_ADMIN),
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await partyRoleRepository.deleteRole(id);
            return successResponse(res, null, 'Party role deleted successfully');
        } catch (error: any) {
            return errorResponse(res, error.message || 'Failed to delete party role', 500);
        }
    }
);

export default router;
