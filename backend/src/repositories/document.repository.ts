import prisma from '../config/database.config';
import { DocumentType } from '@prisma/client';

export class DocumentRepository {
    async create(data: {
        applicationId: string;
        documentType: DocumentType;
        originalFilename: string;
        generatedFilename: string;
        fileUrl?: string;
        mimeType: string;
        fileSize: number;
    }) {
        return prisma.document.create({ data });
    }

    async findByApplicationId(applicationId: string) {
        return prisma.document.findMany({
            where: { applicationId },
            orderBy: { uploadedAt: 'desc' },
        });
    }

    async findById(id: string) {
        return prisma.document.findUnique({ where: { id } });
    }

    async delete(id: string) {
        return prisma.document.delete({ where: { id } });
    }

    async deleteByApplicationId(applicationId: string) {
        return prisma.document.deleteMany({ where: { applicationId } });
    }
}
