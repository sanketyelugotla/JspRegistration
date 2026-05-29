import { z } from 'zod';

export const sendOtpSchema = z.object({
    body: z.object({
        phone: z
            .string()
            .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number')
            .length(10, 'Phone number must be 10 digits'),
    }),
});

export const verifyOtpSchema = z.object({
    body: z.object({
        phone: z
            .string()
            .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number')
            .length(10, 'Phone number must be 10 digits'),
        otp: z.string().length(6, 'OTP must be 6 digits'),
    }),
});

export const officerLoginSchema = z.object({
    body: z.object({
        phone: z
            .string()
            .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number')
            .length(10, 'Phone number must be 10 digits'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
});

export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required'),
    }),
});
