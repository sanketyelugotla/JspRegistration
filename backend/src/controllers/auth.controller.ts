import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { logger } from '../utils/logger';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    sendOtp = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { phone } = req.body;
            const result = await this.authService.sendOtp(phone);
            return successResponse(res, result, 'OTP sent successfully');
        } catch (error: any) {
            logger.error('Send OTP error:', error);
            return errorResponse(res, error.message || 'Failed to send OTP', 500);
        }
    };

    verifyOtp = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { phone, otp } = req.body;
            const result = await this.authService.verifyOtp(phone, otp);
            return successResponse(res, result, 'OTP verified successfully');
        } catch (error: any) {
            logger.error('Verify OTP error:', error);
            return errorResponse(res, error.message || 'Failed to verify OTP', 400);
        }
    };

    officerLogin = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { phone, password } = req.body;
            const result = await this.authService.officerLogin(phone, password);
            return successResponse(res, result, 'Login successful');
        } catch (error: any) {
            logger.error('Officer login error:', error);
            return errorResponse(res, error.message || 'Login failed', 401);
        }
    };

    refreshToken = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { refreshToken } = req.body;
            const result = await this.authService.refreshToken(refreshToken);
            return successResponse(res, result, 'Token refreshed successfully');
        } catch (error: any) {
            logger.error('Refresh token error:', error);
            return errorResponse(res, error.message || 'Failed to refresh token', 401);
        }
    };

    logout = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { refreshToken } = req.body;
            await this.authService.logout(refreshToken);
            return successResponse(res, null, 'Logout successful');
        } catch (error: any) {
            logger.error('Logout error:', error);
            return errorResponse(res, error.message || 'Logout failed', 500);
        }
    };
}
