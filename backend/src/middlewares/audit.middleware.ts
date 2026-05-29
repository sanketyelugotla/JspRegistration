import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';
import prisma from '../config/database.config';
import { logger } from '../utils/logger';

export const auditLog = (action: string, entityType: string) => {
    return async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const originalJson = res.json.bind(res);

        res.json = function (body: any) {
            // Only log if request was successful
            if (body.success) {
                const entityId = req.params.id || body.data?.id || null;
                const ipAddress = req.ip || req.socket.remoteAddress || null;

                prisma.auditLog
                    .create({
                        data: {
                            userId: req.user?.userId || null,
                            role: req.user?.role || null,
                            action,
                            entityType,
                            entityId,
                            ipAddress,
                            remarks: JSON.stringify({
                                method: req.method,
                                path: req.path,
                            }),
                        },
                    })
                    .catch((error) => {
                        logger.error('Failed to create audit log:', error);
                    });
            }

            return originalJson(body);
        };

        next();
    };
};
