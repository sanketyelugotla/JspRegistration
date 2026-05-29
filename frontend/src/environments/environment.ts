const backendBaseUrl =
    (import.meta.env.NG_APP_BACKEND_URL as string | undefined) ||
    (import.meta.env.VITE_BACKEND_URL as string | undefined) ||
    'https://jspregistration.onrender.com';
const normalizedBackendBaseUrl = backendBaseUrl.replace(/\/$/, '');

export const environment = {
    production: false,
    apiUrl: `${normalizedBackendBaseUrl}/api`,
    uploadMaxSize: 10485760, // 10MB
    allowedFileTypes: ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'],
    otpLength: 6,
    otpResendDelay: 60, // seconds
};
