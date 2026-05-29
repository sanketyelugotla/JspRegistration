import { Router, Response } from 'express';
import { DocumentService } from '../services/document.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { logger } from '../utils/logger';
import { AuthRequest } from '../types/auth.types';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../utils/file.util';
import { uploadToCloudinary } from '../utils/cloudinary.util';
import { DocumentType } from '@prisma/client';
import { createReadStream } from 'fs';
import { env } from '../config/env.config';

const router = Router();
const documentService = new DocumentService();

// Select upload middleware based on storage type
const uploadMiddleware = env.STORAGE_TYPE === 'cloudinary' ? uploadToCloudinary : upload;

// All routes require authentication
router.use(authenticate);

router.post('/upload', uploadMiddleware.single('file'), async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return errorResponse(res, 'No file uploaded', 400);
        }

        const { applicationId, documentType } = req.body;

        if (!applicationId || !documentType) {
            return errorResponse(res, 'Application ID and document type are required', 400);
        }

        if (!['BIO_DATA', 'SUPPORTING'].includes(documentType)) {
            return errorResponse(res, 'Invalid document type', 400);
        }

        const document = await documentService.uploadDocument(
            applicationId,
            documentType as DocumentType,
            req.file
        );

        logger.info(`Document uploaded successfully: ${document.id} (Storage: ${env.STORAGE_TYPE})`);
        return successResponse(res, document, 'Document uploaded successfully', 201);
    } catch (error: any) {
        logger.error('Upload document error:', error);
        return errorResponse(res, error.message || 'Failed to upload document', 500);
    }
});

router.get('/application/:applicationId', async (req: AuthRequest, res: Response) => {
    try {
        const { applicationId } = req.params;
        const documents = await documentService.getDocumentsByApplicationId(applicationId);
        return successResponse(res, documents, 'Documents fetched successfully');
    } catch (error: any) {
        logger.error('Get documents error:', error);
        return errorResponse(res, error.message || 'Failed to fetch documents', 500);
    }
});

router.get('/:id/download', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const document = await documentService.getDocumentById(id);
        await streamDocumentResponse(document, res, 'attachment');
        return;
    } catch (error: any) {
        logger.error('Get document error:', error);
        return errorResponse(res, error.message || 'Failed to get document', 500);
    }
});

router.get('/:id/view', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const document = await documentService.getDocumentById(id);
        await streamDocumentResponse(document, res, 'inline');
        return;
    } catch (error: any) {
        logger.error('Get document error:', error);
        return errorResponse(res, error.message || 'Failed to get document', 500);
    }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await documentService.deleteDocument(id);
        return successResponse(res, null, 'Document deleted successfully');
    } catch (error: any) {
        logger.error('Delete document error:', error);
        return errorResponse(res, error.message || 'Failed to delete document', 500);
    }
});

async function streamDocumentResponse(
    document: Awaited<ReturnType<DocumentService['getDocumentById']>>,
    res: Response,
    disposition: 'attachment' | 'inline'
): Promise<void> {
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader(
        'Content-Disposition',
        `${disposition}; filename*=UTF-8''${encodeURIComponent(document.originalFilename)}`
    );

    if (document.fileUrl) {
        const upstreamResponse = await fetch(document.fileUrl);

        if (!upstreamResponse.ok) {
            throw new Error('Failed to fetch document from cloud storage');
        }

        const arrayBuffer = await upstreamResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.setHeader('Content-Length', buffer.length.toString());
        res.end(buffer);
        return;
    }

    const filePath = documentService.getFilePath(document.generatedFilename);
    createReadStream(filePath).pipe(res);
}

export default router;
