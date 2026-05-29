import { ApplicationStatus } from '../constants/status.constants';
import { UserRole } from '../constants/roles.constants';

export enum ApprovalAction {
    APPROVE = 'APPROVE',
    REJECT = 'REJECT',
    REQUEST_CORRECTION = 'REQUEST_CORRECTION',
}

export interface ApprovalHistory {
    id: string;
    applicationId: string;
    officerId: string;
    role: UserRole;
    action: ApprovalAction;
    remarks?: string;
    previousStatus: ApplicationStatus;
    newStatus: ApplicationStatus;
    ipAddress?: string;
    createdAt: string;

    officer?: {
        id: string;
        phone: string;
        role: UserRole;
    };
}

export interface ApprovalRequest {
    remarks?: string;
}
