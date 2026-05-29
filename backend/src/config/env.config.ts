import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_ACCESS_EXPIRY: z.string().default('15m'),
    JWT_REFRESH_EXPIRY: z.string().default('7d'),
    PORT: z.string().transform((val) => parseInt(val, 10)).default('3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    MAX_FILE_SIZE: z.string().transform((val) => parseInt(val, 10)).default('10485760'),
    UPLOAD_DIR: z.string().default('./uploads'),
    STORAGE_TYPE: z.enum(['local', 'cloudinary']).default('local'),
    RATE_LIMIT_WINDOW_MS: z.string().transform((val) => parseInt(val, 10)).default('900000'),
    RATE_LIMIT_MAX_REQUESTS: z.string().transform((val) => parseInt(val, 10)).default('100'),
    OTP_RATE_LIMIT_MAX: z.string().transform((val) => parseInt(val, 10)).default('5'),
    CORS_ORIGIN: z.string().default('http://localhost:4200'),
    OTP_EXPIRY_MINUTES: z.string().transform((val) => parseInt(val, 10)).default('10'),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    CLOUDINARY_FOLDER: z.string().default('jsp-party-registrations'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.format());
    process.exit(1);
}

export const env = parsedEnv.data;
