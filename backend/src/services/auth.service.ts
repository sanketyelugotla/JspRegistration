import bcrypt from 'bcryptjs';
import { AuthRepository } from '../repositories/auth.repository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import { otpProvider } from '../providers/otp.provider';
import { env } from '../config/env.config';

export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    async sendOtp(phone: string) {
        // Generate 6-digit OTP (in dev, always 123456 for convenience)
        const otp = env.NODE_ENV === 'development' ? '123456' : this.generateOtp();

        const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

        await this.authRepository.createOtpSession(phone, otp, expiresAt);
        await otpProvider.sendOtp(phone, otp);

        return {
            message: 'OTP sent successfully',
            maskedPhone: this.maskPhone(phone),
            expiresIn: env.OTP_EXPIRY_MINUTES,
        };
    }

    async verifyOtp(phone: string, otp: string) {
        const otpSession = await this.authRepository.findOtpSession(phone, otp);

        if (!otpSession) {
            throw new Error('Invalid or expired OTP');
        }

        await this.authRepository.markOtpVerified(otpSession.id);

        // Get or create user
        let user = await this.authRepository.findUserByPhone(phone);
        if (!user) {
            user = await this.authRepository.createUser(phone);
        }

        const tokens = this.generateTokens(
            user.id,
            user.phone,
            user.role,
            user.assignedDistrictId,
            user.assignedConstituencyId,
            user.assignedMandalId
        );

        return {
            user: {
                id: user.id,
                phone: user.phone,
                role: user.role,
            },
            ...tokens,
        };
    }

    async officerLogin(phone: string, password: string) {
        const user = await this.authRepository.findUserByPhoneAndPassword(phone);

        if (!user || !user.password) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Officers must not be APPLICANT role
        if (user.role === 'APPLICANT') {
            throw new Error('Invalid credentials');
        }

        const tokens = this.generateTokens(
            user.id,
            user.phone,
            user.role,
            user.assignedDistrictId,
            user.assignedConstituencyId,
            user.assignedMandalId
        );

        return {
            user: {
                id: user.id,
                phone: user.phone,
                role: user.role,
                assignedDistrictId: user.assignedDistrictId,
                assignedConstituencyId: user.assignedConstituencyId,
                assignedMandalId: user.assignedMandalId,
            },
            ...tokens,
        };
    }

    async refreshToken(refreshToken: string) {
        try {
            const decoded = verifyRefreshToken(refreshToken);
            const tokenRecord = await this.authRepository.findRefreshToken(refreshToken);

            if (!tokenRecord) {
                throw new Error('Invalid refresh token');
            }

            // Revoke old token
            await this.authRepository.revokeRefreshToken(refreshToken);

            // Generate new tokens
            const tokens = this.generateTokens(
                tokenRecord.user.id,
                tokenRecord.user.phone,
                tokenRecord.user.role,
                tokenRecord.user.assignedDistrictId,
                tokenRecord.user.assignedConstituencyId,
                tokenRecord.user.assignedMandalId
            );

            return tokens;
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    async logout(refreshToken: string) {
        await this.authRepository.revokeRefreshToken(refreshToken);
    }

    private generateTokens(
        userId: string,
        phone: string,
        role: string,
        assignedDistrictId?: string | null,
        assignedConstituencyId?: string | null,
        assignedMandalId?: string | null
    ) {
        const payload = {
            userId,
            phone,
            role,
            assignedDistrictId,
            assignedConstituencyId,
            assignedMandalId,
        };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        // Save refresh token
        const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        this.authRepository.saveRefreshToken(userId, refreshToken, refreshExpiresAt);

        return { accessToken, refreshToken };
    }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private maskPhone(phone: string): string {
        if (phone.length < 4) return phone;
        return phone.slice(0, 2) + '****' + phone.slice(-2);
    }
}
