import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { errorResponse } from '../utils/response.util';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    if (err.name === 'MulterError') {
        if (err.message.includes('File too large')) {
            return errorResponse(res, 'File size exceeds 10MB limit', 400);
        }
        return errorResponse(res, err.message, 400);
    }

    if (err.message.includes('Invalid file type')) {
        return errorResponse(res, err.message, 400);
    }

    return errorResponse(res, 'Internal server error', 500);
};
