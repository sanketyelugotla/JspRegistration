import { Response } from 'express';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

export const successResponse = <T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    meta?: ApiResponse['meta']
): Response => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data,
        ...(meta && { meta }),
    };
    return res.status(statusCode).json(response);
};

export const errorResponse = (
    res: Response,
    message: string = 'Error',
    statusCode: number = 500,
    data?: any
): Response => {
    const response: ApiResponse = {
        success: false,
        message,
        ...(data && { data }),
    };
    return res.status(statusCode).json(response);
};
