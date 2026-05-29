import { ApplicationStatus } from '../constants/status.constants';
import { District, Constituency, Mandal } from './location.model';
import { PartyRole } from './party-role.model';
import { Document } from './document.model';
import { ApprovalHistory } from './approval.model';

export interface Application {
    id: string;
    applicantPhone: string;
    jspId: string;
    fullName: string;
    districtId: string;
    constituencyId: string;
    mandalId: string;
    villageWard: string;
    pollingBooth: string;
    shortDescription?: string;
    status: ApplicationStatus;
    currentLevel?: string;
    createdAt: string;
    updatedAt: string;

    district?: District;
    constituency?: Constituency;
    mandal?: Mandal;
    rolePreference?: RolePreference;
    documents?: Document[];
    approvalHistory?: ApprovalHistory[];
}

export interface RolePreference {
    id: string;
    applicationId: string;
    preferredRole1Id?: string;
    preferredRole2Id?: string;
    preferredRole3Id?: string;
    flexibilityAgreed: boolean;
    createdAt: string;
    updatedAt: string;

    preferredRole1?: PartyRole;
    preferredRole2?: PartyRole;
    preferredRole3?: PartyRole;
}

export interface CreateApplicationRequest {
    jspId: string;
    fullName: string;
    districtId: string;
    constituencyId: string;
    mandalId: string;
    villageWard: string;
    pollingBooth: string;
    shortDescription?: string;
    rolePreferences?: {
        preferredRole1Id?: string;
        preferredRole2Id?: string;
        preferredRole3Id?: string;
        flexibilityAgreed: boolean;
    };
}

export interface UpdateApplicationRequest extends Partial<CreateApplicationRequest> { }

export interface ApplicationStatistics {
    total: number;
    draft: number;
    submitted: number;
    mandalReview: number;
    districtReview: number;
    stateReview: number;
    approved: number;
    rejected: number;
    correctionRequired: number;
}
