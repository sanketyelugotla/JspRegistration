import prisma from '../config/database.config';
import { UserRole } from '@prisma/client';

export class AuthRepository {
    async createOtpSession(phone: string, otp: string, expiresAt: Date) {
        return prisma.otpSession.create({
            data: { phone, otp, expiresAt },
        });
    }

    async findOtpSession(phone: string, otp: string) {
        return prisma.otpSession.findFirst({
            where: {
                phone,
                otp,
                verified: false,
                expiresAt: { gte: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async markOtpVerified(id: string) {
        return prisma.otpSession.update({
            where: { id },
            data: { verified: true },
        });
    }

    async findUserByPhone(phone: string) {
        return prisma.user.findUnique({
            where: { phone },
        });
    }

    async createUser(phone: string, role: UserRole = UserRole.APPLICANT) {
        return prisma.user.create({
            data: { phone, role },
        });
    }

    async findUserByPhoneAndPassword(phone: string) {
        return prisma.user.findUnique({
            where: { phone },
            select: {
                id: true,
                phone: true,
                password: true,
                role: true,
                assignedDistrictId: true,
                assignedConstituencyId: true,
                assignedMandalId: true,
            },
        });
    }

    async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
        return prisma.refreshToken.create({
            data: { userId, token, expiresAt },
        });
    }

    async findRefreshToken(token: string) {
        return prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });
    }

    async revokeRefreshToken(token: string) {
        return prisma.refreshToken.delete({
            where: { token },
        });
    }

    async revokeAllUserTokens(userId: string) {
        return prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }
}
