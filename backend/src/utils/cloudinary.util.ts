import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.config';
import { env } from '../config/env.config';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../constants/documents';

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Determine file type for folder organization
        const fileType = file.mimetype.startsWith('image/') ? 'images' : 'documents';

        return {
            folder: `${env.CLOUDINARY_FOLDER}/${fileType}`,
            allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
            resource_type: 'auto' as const,
        };
    },
});

// File filter to validate file types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, PNG, JPG, and JPEG are allowed.'));
    }
};

// Configure Multer with Cloudinary storage
export const uploadToCloudinary = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
});

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Deleted file from Cloudinary: ${publicId}`);
    } catch (error) {
        console.error('❌ Error deleting file from Cloudinary:', error);
        throw new Error('Failed to delete file from Cloudinary');
    }
};

// Extract public ID from Cloudinary URL
export const extractPublicId = (url: string): string => {
    // Extract public ID from Cloudinary URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return '';

    // Get everything after /upload/ and before the file extension
    const pathAfterUpload = parts.slice(uploadIndex + 2).join('/');
    return pathAfterUpload.split('.')[0]; // Remove file extension
};
