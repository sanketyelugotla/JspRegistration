import jwt from 'jsonwebtoken';
import { env } from '../config/env.config';

export interface JwtPayload {
    userId: string;
    phone: string;
    role: string;
    assignedDistrictId?: string | null;
    assignedConstituencyId?: string | null;
    assignedMandalId?: string | null;
}

export const signAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRY as string,
    });
};

export const signRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRY as string,
    });
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};
