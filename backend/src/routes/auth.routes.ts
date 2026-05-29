import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import {
    sendOtpSchema,
    verifyOtpSchema,
    officerLoginSchema,
    refreshTokenSchema,
} from '../validators/auth.validator';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.config';

const router = Router();
const authController = new AuthController();

// Rate limiting for OTP endpoint
const otpLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.OTP_RATE_LIMIT_MAX,
    message: 'Too many OTP requests, please try again later',
});

router.post('/send-otp', otpLimiter, validate(sendOtpSchema), authController.sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);
router.post('/officer/login', validate(officerLoginSchema), authController.officerLogin);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', validate(refreshTokenSchema), authController.logout);

export default router;
