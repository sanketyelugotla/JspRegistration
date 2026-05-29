export enum DocumentType {
    BIO_DATA = 'BIO_DATA',
    SUPPORTING = 'SUPPORTING',
}

export interface Document {
    id: string;
    applicationId: string;
    documentType: DocumentType;
    originalFilename: string;
    generatedFilename: string;
    fileUrl?: string;
    mimeType: string;
    fileSize: number;
    uploadedAt: string;
}

export interface UploadDocumentRequest {
    applicationId: string;
    documentType: DocumentType;
    file: File;
}
