# Frontend Environment Configuration

## Important Note about .env Files in Angular

Unlike Node.js applications, Angular **does not** automatically read `.env` files at runtime. The `.env` file you created in the frontend root directory is primarily for documentation purposes.

## How Angular Handles Environment Variables

Angular uses **build-time** environment files located in `src/environments/`:

- **Development**: `environment.ts` - Used when running `ng serve`
- **Production**: `environment.prod.ts` - Used when running `ng build --configuration production`

## Current Configuration

The backend URL is already configured in `src/environments/environment.ts`:

```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',  // ← This is your BACKEND_URL
    uploadMaxSize: 10485760,
    allowedFileTypes: ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'],
    otpLength: 6,
    otpResendDelay: 60,
};
```

## Usage in Code

All API calls use the environment configuration:

```typescript
// In api.constants.ts
export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: `${environment.apiUrl}/auth/send-otp`,
    // ... other endpoints
  }
};
```

## Changing the Backend URL

To change the backend URL:

1. **For Development**: Edit `frontend/src/environments/environment.ts`
2. **For Production**: Edit `frontend/src/environments/environment.prod.ts`
3. Restart the dev server (`ng serve`) for changes to take effect

## Alternative: Use .env with Custom Build Script

If you want Angular to read `.env` files, you would need to:

1. Install `dotenv` and `@angular-builders/custom-webpack`
2. Create a custom webpack configuration
3. Modify `angular.json` to use the custom builder

However, for this project, the standard Angular environment file approach is sufficient and recommended.

---

**Bottom Line**: Your `.env` file is for reference. The actual configuration is in `src/environments/environment.ts` and already uses `http://localhost:3000` as the backend URL.
