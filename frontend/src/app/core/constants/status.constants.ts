export enum ApplicationStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    MANDAL_REVIEW = 'MANDAL_REVIEW',
    DISTRICT_REVIEW = 'DISTRICT_REVIEW',
    STATE_REVIEW = 'STATE_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CORRECTION_REQUIRED = 'CORRECTION_REQUIRED',
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
    [ApplicationStatus.DRAFT]: 'Draft',
    [ApplicationStatus.SUBMITTED]: 'Submitted',
    [ApplicationStatus.MANDAL_REVIEW]: 'Mandal Review',
    [ApplicationStatus.DISTRICT_REVIEW]: 'District Review',
    [ApplicationStatus.STATE_REVIEW]: 'State Review',
    [ApplicationStatus.APPROVED]: 'Approved',
    [ApplicationStatus.REJECTED]: 'Rejected',
    [ApplicationStatus.CORRECTION_REQUIRED]: 'Correction Required',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
    [ApplicationStatus.DRAFT]: 'gray',
    [ApplicationStatus.SUBMITTED]: 'blue',
    [ApplicationStatus.MANDAL_REVIEW]: 'orange',
    [ApplicationStatus.DISTRICT_REVIEW]: 'orange',
    [ApplicationStatus.STATE_REVIEW]: 'orange',
    [ApplicationStatus.APPROVED]: 'green',
    [ApplicationStatus.REJECTED]: 'red',
    [ApplicationStatus.CORRECTION_REQUIRED]: 'yellow',
};
