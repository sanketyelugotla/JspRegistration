# Registration Form E2E Test

This test file comprehensively tests the JSP Party Role Registration Form with dummy data and document uploads.

## Test Coverage

### Full E2E Flow Test
- ✅ Phone number pre-filled (from auth)
- ✅ Fill JSP ID: `JSP12345`
- ✅ Fill Full Name: `Rajesh Kumar Reddy`
- ✅ Select District: `Visakhapatnam`
- ✅ Select Constituency: `Gajuwaka`
- ✅ Select Mandal: `Gajuwaka Urban`
- ✅ Fill Village/Ward: `Seethammadhara`
- ✅ Fill Polling Booth: `ZPHS Seethammadhara - Booth 101`
- ✅ Fill Short Description: `Active party worker with 10 years of experience...`
- ✅ Select Role Preferences:
  - First: `President`
  - Second: `Vice President`
  - Third: `Secretary`
- ✅ Upload Bio Data: `test-biodata.pdf`
- ✅ Upload Supporting Document: `test-supporting.pdf`
- ✅ Check Flexibility Checkbox
- ✅ Submit Form
- ✅ Verify documents uploaded to Cloudinary
- ✅ Verify application submitted successfully

### Validation Tests
- ✅ Required fields validation
- ✅ Bio data file required before submission
- ✅ Flexibility checkbox required
- ✅ Constituency clears when district changes
- ✅ Mandal clears when constituency changes
- ✅ Document upload error handling

## Test Files Created

1. **Test Spec**: `registration-form.component.spec.ts` - Comprehensive E2E test suite
2. **Test PDFs**: 
   - `public/test-biodata.pdf` - Mock bio data document
   - `public/test-supporting.pdf` - Mock supporting document

## Running the Tests

### Install Dependencies (if needed)
```bash
npm install --save-dev @analogjs/vite-plugin-angular
```

### Run All Tests
```bash
npm run test
```

### Run Tests in Watch Mode
```bash
npm run test -- --watch
```

### Run Tests with Coverage
```bash
npm run test -- --coverage
```

### Run Specific Test File
```bash
npm run test -- registration-form.component.spec.ts
```

## Test Output

When you run the tests, you'll see console output like:

```
✅ Component initialized successfully
✅ Step 1: Filled JSP ID and Full Name
✅ Step 2: Selected District - Visakhapatnam
✅ Step 3: Selected Constituency - Gajuwaka
✅ Step 4: Selected Mandal - Gajuwaka Urban
✅ Step 5: Filled Village/Ward and Polling Booth
✅ Step 6: Filled Short Description
✅ Step 7: Selected Role Preferences
✅ Step 8: Uploaded Bio Data Document
✅ Step 9: Uploaded Supporting Document
✅ Step 10: Agreed to flexibility
✅ Form validation passed - Ready to submit
✅ Step 11: Form submitted successfully
✅ Documents uploaded to Cloudinary
✅ Application submitted for review
🎉 E2E Test completed successfully!
```

## Test Architecture

### Mocked Services
- `AuthService` - Returns mock authenticated user
- `LocationRepository` - Returns mock districts, constituencies, mandals
- `PartyRoleRepository` - Returns mock party roles
- `ApplicationRepository` - Mocks create/update application
- `DocumentRepository` - Mocks document upload to Cloudinary
- `ApplicationService` - Mocks submit application

### Dummy Data
All test data is defined in the test file:
- **Districts**: Visakhapatnam, Krishna, Guntur
- **Constituencies**: Gajuwaka, Pendurthi (under Visakhapatnam)
- **Mandals**: Gajuwaka Urban, Pedagantyada (under Gajuwaka)
- **Party Roles**: President, Vice President, Secretary, Treasurer
- **User**: Phone `9550572255`, Role `APPLICANT`

## Test Scenarios

### 1. Happy Path (E2E)
Tests complete form submission with all valid data and documents.

### 2. Bio Data Validation
Tests that form cannot be submitted without bio data document.

### 3. Flexibility Validation
Tests that form cannot be submitted without checking flexibility.

### 4. Document Upload Error
Tests graceful error handling when document upload fails.

### 5. Field Validations
Tests all required field validations.

### 6. Cascading Dropdowns
Tests that child dropdowns clear when parent changes.

## Notes

- Tests use Vitest (Angular's modern testing framework)
- All tests are isolated with mocked dependencies
- Mock PDF files are created programmatically
- No actual API calls or file uploads during testing
- Tests verify the complete user journey from start to finish

## Troubleshooting

If tests fail to run:

1. **Check Node Version**: Ensure Node.js 18+ is installed
2. **Clear Cache**: `rm -rf node_modules/.vite`
3. **Reinstall**: `npm install`
4. **Check Config**: Verify `vitest.config.ts` exists
5. **Check Setup**: Verify `src/test-setup.ts` exists
