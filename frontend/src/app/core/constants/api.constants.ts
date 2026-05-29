import { environment } from '../../../environments/environment';

export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        SEND_OTP: `${environment.apiUrl}/auth/send-otp`,
        VERIFY_OTP: `${environment.apiUrl}/auth/verify-otp`,
        OFFICER_LOGIN: `${environment.apiUrl}/auth/officer/login`,
        REFRESH: `${environment.apiUrl}/auth/refresh`,
        LOGOUT: `${environment.apiUrl}/auth/logout`,
    },

    // Locations
    LOCATIONS: {
        DISTRICTS: `${environment.apiUrl}/locations/districts`,
        CONSTITUENCIES: `${environment.apiUrl}/locations/constituencies`,
        MANDALS: `${environment.apiUrl}/locations/mandals`,
    },

    // Party Roles
    PARTY_ROLES: {
        BASE: `${environment.apiUrl}/party-roles`,
        ALL: `${environment.apiUrl}/party-roles/all`,
    },

    // Applications
    APPLICATIONS: {
        BASE: `${environment.apiUrl}/applications`,
        SUBMIT: (id: string) => `${environment.apiUrl}/applications/${id}/submit`,
        APPROVE: (id: string) => `${environment.apiUrl}/applications/${id}/approve`,
        REJECT: (id: string) => `${environment.apiUrl}/applications/${id}/reject`,
        REQUEST_CORRECTION: (id: string) => `${environment.apiUrl}/applications/${id}/request-correction`,
        STATISTICS: `${environment.apiUrl}/applications/stats/summary`,
    },

    // Documents
    DOCUMENTS: {
        UPLOAD: `${environment.apiUrl}/documents/upload`,
        BY_APPLICATION: (appId: string) => `${environment.apiUrl}/documents/application/${appId}`,
        DOWNLOAD: (id: string) => `${environment.apiUrl}/documents/${id}/download`,
        VIEW: (id: string) => `${environment.apiUrl}/documents/${id}/view`,
        DELETE: (id: string) => `${environment.apiUrl}/documents/${id}`,
    },
};
