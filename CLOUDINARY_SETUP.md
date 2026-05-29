# Cloudinary Setup Guide

## Overview

This guide explains how to configure Cloudinary for file uploads in the JSP Party Registration System. Cloudinary will handle all PDF documents and images (bio data, supporting documents).

## 📋 Prerequisites

- Node.js backend running
- PostgreSQL database configured
- Internet connection (for Cloudinary API)

---

## 🔧 Step 1: Create Cloudinary Account

1. **Sign Up for Cloudinary** (FREE)
   - Visit: [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
   - Create a free account (no credit card required)
   - Free tier includes:
     - 25 GB storage
     - 25 GB bandwidth/month
     - 25,000 transformations/month

2. **Verify Your Email**
   - Check your inbox for verification email
   - Click the verification link

3. **Access Dashboard**
   - Login to: [https://cloudinary.com/console](https://cloudinary.com/console)
   - You'll see your Dashboard with credentials

---

## 📝 Step 2: Get Cloudinary Credentials

From your Cloudinary Dashboard, copy these values:

1. **Cloud Name**
   - Located at the top of the dashboard
   - Example: `dk1a2b3c4d`

2. **API Key**
   - Found under "Account Details" section
   - Example: `123456789012345`

3. **API Secret**
   - Click the "eye" icon to reveal it
   - Example: `abcdefghijklmnopqrstuvwxyz1234`

⚠️ **IMPORTANT**: Keep your API Secret confidential! Never commit it to version control.

---

## 🔑 Step 3: Configure Backend Environment Variables

1. **Open Backend `.env` File**

   ```
   C:\Users\sanke\Documents\JSPForm\backend\.env
   ```

2. **Update Cloudinary Configuration**
   Replace the placeholder values with your actual credentials:

   ```env
   # File Upload Storage Configuration
   STORAGE_TYPE="cloudinary"

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME="your_actual_cloud_name"
   CLOUDINARY_API_KEY="your_actual_api_key"
   CLOUDINARY_API_SECRET="your_actual_api_secret"
   CLOUDINARY_FOLDER="jsp-party-registrations"
   ```

3. **Example (with sample credentials)**:
   ```env
   STORAGE_TYPE="cloudinary"
   CLOUDINARY_CLOUD_NAME="dk1a2b3c4d"
   CLOUDINARY_API_KEY="123456789012345"
   CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz1234"
   CLOUDINARY_FOLDER="jsp-party-registrations"
   ```

---

## 🗂️ Step 4: Update Database Schema

The Document model has been updated to support Cloudinary URLs. Run the migration:

```powershell
cd backend
npx prisma db push
```

This adds a `fileUrl` field to store Cloudinary URLs.

---

## 🧪 Step 5: Test Cloudinary Integration

### 5.1 Start Backend Server

```powershell
cd backend
npm run dev
```

Check console output - you should see:

```
✅ Cloudinary configured successfully
🚀 Server running on port 3000
```

### 5.2 Test File Upload via Frontend

1. **Start Frontend**

   ```powershell
   cd frontend
   npm run start
   ```

2. **Login to Application**
   - Navigate to `http://localhost:4200`
   - Login with test account (phone: 9999999999, OTP: 123456)

3. **Upload Test Document**
   - Go to JSP Registration Form
   - Upload a bio data file (PDF or image)
   - Upload supporting documents

4. **Verify Upload**
   - Check Cloudinary Dashboard
   - Navigate to "Media Library" → "jsp-party-registrations" folder
   - You should see uploaded files organized in subfolders:
     - `jsp-party-registrations/images/` (for JPG, PNG)
     - `jsp-party-registrations/documents/` (for PDFs)

---

## 📊 Step 6: Monitor Cloudinary Usage

### View Media Library

1. Go to Cloudinary Dashboard → **Media Library**
2. Browse uploaded files
3. Click on any file to see:
   - Public URL
   - File size
   - Upload date
   - Transformations available

### Check Usage Stats

1. Go to **Dashboard** → **Usage**
2. Monitor:
   - Storage used (out of 25 GB)
   - Bandwidth consumed
   - Transformations performed

---

## 🔄 Switching Between Local and Cloudinary Storage

The system supports both storage types. To switch:

### Use Cloudinary (Recommended for Production)

```env
STORAGE_TYPE="cloudinary"
```

### Use Local Storage (For Development/Testing)

```env
STORAGE_TYPE="local"
UPLOAD_DIR="./uploads"
```

---

## 🔒 Security Best Practices

1. **Never Commit Credentials**
   - `.env` file is in `.gitignore`
   - Don't share your API Secret publicly

2. **Use Environment-Specific Credentials**
   - Development: Use free tier account
   - Production: Use paid account with higher limits

3. **Enable Signed URLs** (Optional - for restricted access)
   Add to Cloudinary config:

   ```typescript
   signed: true,
   signUrl: true
   ```

4. **Set Upload Presets** (Optional - for advanced control)
   - Go to Cloudinary Dashboard → Settings → Upload
   - Create upload presets with:
     - File size limits
     - Format restrictions
     - Auto-transformations

---

## 🛠️ Troubleshooting

### Error: "Invalid Cloudinary credentials"

✅ **Solution**: Double-check your `.env` values match Cloudinary Dashboard

### Error: "Cloudinary API Secret not found"

✅ **Solution**: Ensure API Secret is copied correctly (no extra spaces)

### Files not appearing in Cloudinary

✅ **Solution**:

- Check `STORAGE_TYPE` is set to `"cloudinary"`
- Verify backend restarted after `.env` changes
- Check backend logs for upload errors

### Uploads working but files show as broken links

✅ **Solution**:

- Verify Cloud Name is correct
- Check Cloudinary Dashboard → Settings → Security
- Ensure "Resource list" is enabled for your account

---

## 📚 Additional Resources

- **Cloudinary Documentation**: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Node.js SDK Guide**: [https://cloudinary.com/documentation/node_integration](https://cloudinary.com/documentation/node_integration)
- **Upload API Reference**: [https://cloudinary.com/documentation/upload_images](https://cloudinary.com/documentation/upload_images)

---

## 🎯 Expected File Structure in Cloudinary

After successful setup, your Cloudinary Media Library will look like:

```
jsp-party-registrations/
├── images/
│   ├── 1717012345-profile_photo.jpg
│   ├── 1717012346-id_card.png
│   └── ...
└── documents/
    ├── 1717012347-bio_data.pdf
    ├── 1717012348-experience_certificate.pdf
    └── ...
```

Each file is named with a timestamp prefix to prevent naming conflicts.

---

## ✅ Verification Checklist

- [ ] Cloudinary account created
- [ ] Cloud Name, API Key, and API Secret copied
- [ ] Backend `.env` file updated with Cloudinary credentials
- [ ] `STORAGE_TYPE` set to `"cloudinary"`
- [ ] Database migrated (`npx prisma db push`)
- [ ] Backend server restarted
- [ ] Test file upload successful
- [ ] Files visible in Cloudinary Media Library
- [ ] File URLs accessible from browser

---

## 📞 Need Help?

If you encounter issues:

1. Check backend console logs for detailed error messages
2. Verify all credentials are correct
3. Ensure internet connection is stable
4. Check Cloudinary service status: [https://status.cloudinary.com](https://status.cloudinary.com)

---

**Setup Complete!** 🎉 Your JSP Party Registration System is now using Cloudinary for secure, scalable file storage.
