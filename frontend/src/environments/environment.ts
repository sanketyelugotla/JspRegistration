export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    uploadMaxSize: 10485760, // 10MB
    allowedFileTypes: ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'],
    otpLength: 6,
    otpResendDelay: 60, // seconds
};
