import { UserRole } from '../constants/roles.constants';

export interface User {
    id: string;
    phone: string;
    role: UserRole;
    assignedDistrictId?: string;
    assignedConstituencyId?: string;
    assignedMandalId?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface SendOtpRequest {
    phone: string;
}

export interface SendOtpResponse {
    message: string;
    maskedPhone: string;
    expiresIn: number;
}

export interface VerifyOtpRequest {
    phone: string;
    otp: string;
}

export interface OfficerLoginRequest {
    phone: string;
    password: string;
}
