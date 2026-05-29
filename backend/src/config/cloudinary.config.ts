import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.config';

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
});

export default cloudinary;

// Helper function to generate secure URLs
export const getSecureUrl = (publicId: string): string => {
    return cloudinary.url(publicId, {
        secure: true,
        transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' }
        ]
    });
};

// Helper function to delete a file from Cloudinary
export const deleteFile = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw error;
    }
};
