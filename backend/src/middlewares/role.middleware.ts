import { Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { errorResponse } from '../utils/response.util';
import { AuthRequest } from '../types/auth.types';

export const requireRole = (...allowedRoles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
        if (!req.user) {
            return errorResponse(res, 'Unauthorized', 401);
        }

        if (!allowedRoles.includes(req.user.role)) {
            return errorResponse(res, 'Forbidden: Insufficient permissions', 403);
        }

        next();
    };
};
