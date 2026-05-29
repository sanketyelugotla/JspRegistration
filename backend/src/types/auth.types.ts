import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface AuthenticatedUser {
    userId: string;
    phone: string;
    role: UserRole;
    assignedDistrictId?: string | null;
    assignedConstituencyId?: string | null;
    assignedMandalId?: string | null;
}

export interface AuthRequest extends Request {
    user?: AuthenticatedUser;
}
