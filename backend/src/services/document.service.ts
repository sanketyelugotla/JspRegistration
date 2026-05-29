import { DocumentRepository } from '../repositories/document.repository';
import { DocumentType } from '@prisma/client';
import { deleteFile } from '../utils/file.util';
import { deleteFromCloudinary, extractPublicId } from '../utils/cloudinary.util';
import path from 'path';
import { env } from '../config/env.config';

export class DocumentService {
    private documentRepository: DocumentRepository;

    constructor() {
        this.documentRepository = new DocumentRepository();
    }

    async uploadDocument(
        applicationId: string,
        documentType: DocumentType,
        file: Express.Multer.File
    ) {
        let generatedFilename: string;
        let fileUrl: string | undefined;

        // Handle Cloudinary vs Local storage
        if (env.STORAGE_TYPE === 'cloudinary') {
            // For Cloudinary, the file path is the Cloudinary URL
            fileUrl = (file as any).path; // Cloudinary URL
            generatedFilename = (file as any).filename || file.originalname;
        } else {
            // For local storage, use the filename
            generatedFilename = file.filename;
        }

        const document = await this.documentRepository.create({
            applicationId,
            documentType,
            originalFilename: file.originalname,
            generatedFilename,
            mimeType: file.mimetype,
            fileSize: file.size,
            ...(fileUrl && { fileUrl }), // Add fileUrl if using Cloudinary
        });

        return document;
    }

    async getDocumentsByApplicationId(applicationId: string) {
        return this.documentRepository.findByApplicationId(applicationId);
    }

    async getDocumentById(id: string) {
        const document = await this.documentRepository.findById(id);
        if (!document) {
            throw new Error('Document not found');
        }
        return document;
    }

    async deleteDocument(id: string) {
        const document = await this.documentRepository.findById(id);
        if (!document) {
            throw new Error('Document not found');
        }

        // Delete physical file based on storage type
        if (env.STORAGE_TYPE === 'cloudinary' && document.fileUrl) {
            const publicId = extractPublicId(document.fileUrl);
            await deleteFromCloudinary(publicId);
        } else {
            // Local storage
            deleteFile(document.generatedFilename);
        }

        // Delete database record
        await this.documentRepository.delete(id);
    }

    getFilePath(filename: string): string {
        return path.join(env.UPLOAD_DIR, filename);
    }
}
