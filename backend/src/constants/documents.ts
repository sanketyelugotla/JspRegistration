export const DOCUMENT_TYPE = {
    BIO_DATA: 'BIO_DATA',
    SUPPORTING: 'SUPPORTING',
} as const;

export type DocumentType = typeof DOCUMENT_TYPE[keyof typeof DOCUMENT_TYPE];

export const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/png',
    'image/jpg',
    'image/jpeg',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
