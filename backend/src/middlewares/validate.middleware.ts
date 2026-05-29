import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errorResponse } from '../utils/response.util';

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): Response | void => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return errorResponse(res, 'Validation failed', 400, { errors });
            }
            return errorResponse(res, 'Validation error', 400);
        }
    };
};
