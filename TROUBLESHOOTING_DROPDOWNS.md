# Troubleshooting Dropdown Issues

## Issue: Constituencies and Mandals not appearing in dropdowns

### ✅ What's Already Verified:

1. **Backend APIs Working**:
   - Districts API: http://localhost:3000/api/locations/districts ✅
   - Constituencies API: http://localhost:3000/api/locations/constituencies?districtId=X ✅
   - Mandals API: http://localhost:3000/api/locations/mandals?constituencyId=X ✅
   - Party Roles API: http://localhost:3000/api/party-roles ✅

2. **Database Seeded**:
   - 26 districts
   - 23 constituencies
   - 60+ mandals
   - 10 party roles

3. **Code Structure**:
   - Frontend repository calls with correct query parameters
   - Backend routes properly configured
   - API endpoints registered in app.ts
   - Models match database schema

### 🔍 Debug Steps (In Browser):

#### Step 1: Open Developer Console

1. Open http://localhost:4200 in Chrome/Edge/Firefox
2. Press **F12** to open Developer Tools
3. Go to **Console** tab

#### Step 2: Login

- Phone: 9999999999
- OTP: 123456
- Click "Start JSP Registration Application"

#### Step 3: Check Console Logs

You should see:

```
🚀 Registration Form Component Initialized
✅ User authenticated: {phone: "9999999999", role: "SUPER_ADMIN", ...}
📝 Form initialized
🔍 Loading districts...
🔍 Loading party roles...
✅ Districts loaded: {success: true, message: "Districts fetched successfully", data: Array(26)}
📊 Districts count: 26
✅ Party roles loaded: {success: true, message: "Party roles fetched successfully", data: Array(10)}
📊 Party roles count: 10
```

#### Step 4: Select a District

- Click on the District dropdown
- Select any district (e.g., "Visakhapatnam")
- Check console for:

```
🔄 District changed: [district-id-uuid]
🔍 Loading constituencies for district: [district-id-uuid]
✅ Constituencies loaded: {success: true, data: Array(3)}
📊 Constituencies count: 3
```

#### Step 5: Check Network Tab

1. Go to **Network** tab in Developer Tools
2. Select a district
3. Look for request: `http://localhost:3000/api/locations/constituencies?districtId=...`
4. Click on it to see:
   - **Status**: Should be 200
   - **Response**: Should show JSON with constituencies array

### 🚨 Common Issues and Fixes:

#### Issue 1: CORS Error

**Error in Console:**

```
Access to XMLHttpRequest at 'http://localhost:3000/api/locations/constituencies?districtId=...' from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Fix:**
Check backend .env file has:

```env
CORS_ORIGIN="http://localhost:4200"
```

#### Issue 2: 404 Not Found

**Error in Console:**

```
GET http://localhost:3000/api/locations/constituencies?districtId=xxx 404 (Not Found)
```

**Fix:**

- Backend not running, restart: `cd backend && npm run dev`
- Routes not registered properly (but we verified this)

#### Issue 3: Empty Response

**Status 200 but data array is empty:**

```json
{
  "success": true,
  "message": "Constituencies fetched successfully",
  "data": []
}
```

**Fix:**

- Database not seeded properly
- Run: `cd backend && npm run prisma:seed`

#### Issue 4: 401 Unauthorized

**Error:**

```
GET http://localhost:3000/api/locations/constituencies?districtId=xxx 401 (Unauthorized)
```

**Fix:**

- Auth interceptor blocking request
- Location endpoints should skip auth (already configured)

#### Issue 5: Dropdowns Stay Disabled

**Constituencies dropdown remains grayed out even after selecting district**

**Check:**

- In console, verify `🔄 District changed:` appears with valid UUID
- Check if `districtId` form control has value: `console.log(this.registrationForm.get('districtId')?.value)`

#### Issue 6: Districts Dropdown Empty

**Districts dropdown only shows "Select District"**

**Check Console for:**

- `❌ Failed to load districts:` error message
- If districts count is 0, backend may not be running or database not seeded

### 🔧 Manual API Tests:

#### Test 1: Districts

```bash
curl http://localhost:3000/api/locations/districts -UseBasicParsing
```

Should return JSON with 26 districts.

#### Test 2: Constituencies (replace UUID with actual district ID)

```bash
curl "http://localhost:3000/api/locations/constituencies?districtId=YOUR_DISTRICT_ID" -UseBasicParsing
```

#### Test 3: Mandals (replace UUID with actual constituency ID)

```bash
curl "http://localhost:3000/api/locations/mandals?constituencyId=YOUR_CONSTITUENCY_ID" -UseBasicParsing
```

### ✅ Verification Checklist:

- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 4200
- [ ] PostgreSQL database running
- [ ] Database seeded with data
- [ ] Can access http://localhost:3000/api/locations/districts in browser
- [ ] User logged in to frontend
- [ ] On JSP Registration Form page
- [ ] Browser console open (F12)
- [ ] Network tab shows requests going out
- [ ] No CORS errors in console
- [ ] Districts dropdown populated with 26 districts
- [ ] Selecting district triggers console log "🔄 District changed:"
- [ ] Constituencies API call visible in Network tab
- [ ] Constituencies dropdown populates after selecting district

### 📊 Expected Behavior:

1. **Page Load**:
   - Districts dropdown shows 26 options
   - Constituencies dropdown is disabled (grayed out)
   - Mandals dropdown is disabled (grayed out)
   - Role dropdowns show 10 options

2. **Select District**:
   - Constituencies dropdown becomes enabled
   - Constituencies dropdown populates with 2-3 options
   - Mandals dropdown stays disabled

3. **Select Constituency**:
   - Mandals dropdown becomes enabled
   - Mandals dropdown populates with 2-3 options

### 🎯 If Everything Fails:

1. **Clear browser cache**: Ctrl+F5
2. **Restart both servers**:

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run start
   ```

3. **Check for TypeScript/compilation errors** in both terminals
4. **Try different browser** (Chrome, Edge, Firefox)
5. **Check firewall** - Allow port 3000 and 4200

---

## 📝 Share This Information:

When reporting issues, provide:

1. Screenshot of browser console (F12 → Console tab)
2. Screenshot of Network tab showing API request/response
3. Any error messages in red in the console
4. Backend terminal output
5. Frontend terminal output

This will help diagnose the exact issue quickly!
