# Quick Start Checklist

## ✅ Completed Tasks

- [x] Backend project scaffolding
- [x] Prisma schema with 12 models
- [x] Backend infrastructure (config, utils, middlewares)
- [x] 5 Backend modules (Auth, Location, PartyRole, Application, Document)
- [x] 27 API endpoints implemented
- [x] Seed data for 4 districts, 8 constituencies, 8 mandals, 7 test users
- [x] Frontend Angular project setup
- [x] Angular Material + Tailwind CSS configuration
- [x] Frontend core layer (39 files: models, services, repositories, interceptors, guards)
- [x] HTTP interceptors (Auth, Error, Loading)
- [x] Route guards (Auth, Role)
- [x] Documentation (3 README files + 1 implementation summary)

## 🚧 Immediate Next Steps

### Before You Can Run the Application

1. **Install PostgreSQL**

   ```
   Download from: https://www.postgresql.org/download/windows/
   ```

2. **Create Database**

   ```sql
   CREATE DATABASE jsp_registration;
   ```

3. **Configure Backend Environment**

   ```powershell
   cd c:\Users\sanke\Documents\JSPForm\backend
   ```

   Edit `.env` file and update line 2 with your PostgreSQL password:

   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/jsp_registration?schema=public"
   ```

4. **Run Database Migrations**

   ```powershell
   cd c:\Users\sanke\Documents\JSPForm\backend
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

5. **Start Backend Server**

   ```powershell
   cd c:\Users\sanke\Documents\JSPForm\backend
   npm run dev
   ```

   Should see: "🚀 Server is running on port 3000"

6. **Test Backend API**
   Open browser: http://localhost:3000/health
   Should see: `{"status":"ok","timestamp":"..."}`

7. **Start Frontend Server**

   ```powershell
   cd c:\Users\sanke\Documents\JSPForm\frontend
   ng serve
   ```

   Should see: "Application bundle generation complete."

8. **Open Frontend**
   Open browser: http://localhost:4200
   (Will show Angular welcome page since feature modules not created yet)

## 🔍 Test the Backend APIs

### Test 1: Get Districts (Public)

```powershell
curl http://localhost:3000/api/locations/districts
```

Should return 4 districts (Visakhapatnam, Vijayawada, Guntur, Tirupati)

### Test 2: Get Party Roles (Public)

```powershell
curl http://localhost:3000/api/party-roles
```

Should return 3 roles (a, b, c)

### Test 3: Send OTP

```powershell
curl -X POST http://localhost:3000/api/auth/send-otp -H "Content-Type: application/json" -d "{\"phone\":\"9876543210\"}"
```

Should return masked phone and OTP sent confirmation

### Test 4: Verify OTP (Login)

```powershell
curl -X POST http://localhost:3000/api/auth/verify-otp -H "Content-Type: application/json" -d "{\"phone\":\"9876543210\",\"otp\":\"123456\"}"
```

Should return access token and user data

### Test 5: Officer Login

```powershell
curl -X POST http://localhost:3000/api/auth/officer/login -H "Content-Type: application/json" -d "{\"phone\":\"9999999999\",\"password\":\"admin123\"}"
```

Should return Super Admin user and tokens

## 📊 Database Verification

### Check Tables

```powershell
cd c:\Users\sanke\Documents\JSPForm\backend
npx prisma studio
```

Opens Prisma Studio at http://localhost:5555

Verify:

- User table has 7 records (1 Super Admin, 2 Mandal Officers, 2 District Officers, 2 State Officers)
- District table has 4 records
- Constituency table has 8 records
- Mandal table has 8 records
- PartyRole table has 3 records (a, b, c)

## 🐛 Common Issues & Fixes

### Issue 1: "P1000: Authentication failed against database server"

**Fix**: Update DATABASE_URL in `backend/.env` with correct PostgreSQL password

### Issue 2: "Cannot find module '@prisma/client'"

**Fix**:

```powershell
cd backend
npx prisma generate
```

### Issue 3: "Error: connect ECONNREFUSED 127.0.0.1:5432"

**Fix**: Ensure PostgreSQL service is running

```powershell
# Check service status in Windows Services
# Or restart from pgAdmin
```

### Issue 4: Frontend shows empty/welcome page

**Expected**: Feature modules (Auth, Application, etc.) not yet created. Only core infrastructure is complete.

### Issue 5: "Port 3000 already in use"

**Fix**: Change PORT in `backend/.env` to 3001 or kill the process using port 3000

### Issue 6: "Port 4200 already in use"

**Fix**: Run `ng serve --port 4201`

## 📋 Test Accounts

Use these accounts to test the system once UI is built:

| Role                             | Phone      | Password    |
| -------------------------------- | ---------- | ----------- |
| Super Admin                      | 9999999999 | admin123    |
| Mandal Officer (Gajuwaka)        | 9111111111 | mandal123   |
| Mandal Officer (Machavaram)      | 9222222222 | mandal123   |
| District Officer (Visakhapatnam) | 9333333333 | district123 |
| District Officer (Vijayawada)    | 9444444444 | district123 |
| State Officer 1                  | 9555555555 | state123    |
| State Officer 2                  | 9666666666 | state123    |

**Applicant Login**: Use any 10-digit phone number starting with 6-9. OTP is always `123456`.

## 🎯 What to Build Next

### Option 1: Build Auth Pages (Easiest)

- Phone input page
- OTP verification page
- Officer login page
- Use existing AuthRepository and AuthService

### Option 2: Build Application Form (Most Important)

- JSP registration form (multi-section)
- Use existing ApplicationRepository
- Implement auto-save with RxJS debounceTime

### Option 3: Complete Backend First (Recommended)

- Add Approval module (approve/reject/correction endpoints)
- Add Dashboard module (statistics aggregation)
- Add Reports module (Excel/CSV/PDF export)
- Add User/Admin module (officer CRUD)

## 📚 Additional Resources

- **Main README**: `c:\Users\sanke\Documents\JSPForm\README.md`
- **Backend README**: `c:\Users\sanke\Documents\JSPForm\backend\README.md`
- **Frontend README**: `c:\Users\sanke\Documents\JSPForm\frontend\README.md`
- **Implementation Summary**: `c:\Users\sanke\Documents\JSPForm\IMPLEMENTATION_SUMMARY.md`
- **Prisma Schema**: `c:\Users\sanke\Documents\JSPForm\backend\prisma\schema.prisma`
- **Session Plan**: Check `/memories/session/plan.md` in your workspace

## ✅ Success Indicators

You'll know everything is working when:

- ✅ `npm run dev` in backend shows "Server is running on port 3000"
- ✅ `ng serve` in frontend shows no compilation errors
- ✅ http://localhost:3000/health returns `{"status":"ok"}`
- ✅ http://localhost:3000/api/locations/districts returns 4 districts
- ✅ Prisma Studio shows all seeded data
- ✅ POST requests to auth endpoints return tokens
- ✅ Protected endpoints return 401 without tokens

---

**Last Updated**: May 29, 2026  
**Status**: Infrastructure Complete, Ready for Feature Development
