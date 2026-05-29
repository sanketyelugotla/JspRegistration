import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { errorResponse } from '../utils/response.util';
import { AuthRequest } from '../types/auth.types';
import { UserRole } from '@prisma/client';

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Response | void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 'No token provided', 401);
        }

        const token = authHeader.substring(7);

        try {
            const decoded = verifyAccessToken(token);
            req.user = {
                userId: decoded.userId,
                phone: decoded.phone,
                role: decoded.role as any,
                assignedDistrictId: decoded.assignedDistrictId,
                assignedConstituencyId: decoded.assignedConstituencyId,
                assignedMandalId: decoded.assignedMandalId,
            };
            next();
        } catch (error) {
            return errorResponse(res, 'Invalid or expired token', 401);
        }
    } catch (error) {
        return errorResponse(res, 'Authentication error', 500);
    }
};

export const authorize = (allowedRoles: UserRole[]) => {
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
