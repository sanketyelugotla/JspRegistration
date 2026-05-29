# JSP Party Role Registration & Multi-Level Approval System

## Project Overview

A production-grade full-stack web application for Jana Sena Party (JSP) role registration with a three-level approval workflow (Mandal → District → State).

## Repository Structure

```
JSPForm/
├── backend/          # Node.js + Express + TypeScript + Prisma + PostgreSQL
├── frontend/         # Angular 20+ Standalone Components
└── README.md         # This file
```

---

## 🎯 Implementation Status

### ✅ Phase 1: Backend (COMPLETE)

#### Infrastructure

- ✅ Project scaffolding with TypeScript
- ✅ Prisma ORM with PostgreSQL
- ✅ Environment configuration with Zod validation
- ✅ Winston logger
- ✅ JWT authentication (Access + Refresh tokens)
- ✅ File upload handling (Multer)
- ✅ Security (Helmet, CORS, Rate Limiting)

#### Database Schema (12 Models)

- ✅ User (5 roles: Super Admin, Mandal Officer, District Officer, State Officer, Applicant)
- ✅ OtpSession (dummy OTP for dev)
- ✅ RefreshToken
- ✅ District, Constituency, Mandal (location hierarchy)
- ✅ PartyRole (admin-managed)
- ✅ Application (JSP registration data)
- ✅ RolePreference (3 preferred roles + flexibility)
- ✅ Document (bio data + supporting docs)
- ✅ ApprovalHistory (full audit trail)
- ✅ AuditLog (system-wide logging)

#### Modules (Clean Architecture)

- ✅ **Auth Module**: OTP login, officer login, JWT refresh/logout
- ✅ **Location Module**: Districts, constituencies, mandals (cascading)
- ✅ **Party Role Module**: CRUD for admin, public active list
- ✅ **Application Module**: Create, update, submit, list (role-scoped)
- ✅ **Document Module**: Upload (10MB PDF/PNG/JPG/JPEG), download, delete

#### Middleware

- ✅ Authentication (JWT verification)
- ✅ Authorization (Role-based access control)
- ✅ Validation (Zod schemas)
- ✅ Global error handling
- ✅ Audit logging

#### Seed Data

- ✅ 4 Districts (Visakhapatnam, Vijayawada, Guntur, Tirupati)
- ✅ 8 Constituencies
- ✅ 8 Mandals
- ✅ 3 Party roles (a, b, c - placeholders)
- ✅ 7 Test user accounts (1 Super Admin, 2 Mandal Officers, 2 District Officers, 2 State Officers)

#### API Endpoints (27 routes)

```
Auth:          POST /api/auth/send-otp, verify-otp, officer/login, refresh, logout
Locations:     GET /api/locations/districts, constituencies, mandals
Party Roles:   GET/POST/PUT/DELETE /api/party-roles
Applications:  POST/PUT/GET /api/applications, /applications/:id/submit
Documents:     POST/GET/DELETE /api/documents
```

---

### ✅ Phase 2: Frontend Core (COMPLETE)

#### Infrastructure

- ✅ Angular 20+ standalone project
- ✅ Angular Material + Tailwind CSS configured
- ✅ ApexCharts, ngx-toastr installed
- ✅ Environment configuration (dev + prod)
- ✅ App config with HTTP interceptors

#### Core Layer (27 files)

- ✅ **Constants**: API endpoints, roles, status
- ✅ **Models**: 12 TypeScript interfaces (Application, Auth, Document, Location, etc.)
- ✅ **Services**: AuthService (Signals), LoadingService
- ✅ **Repositories**: 5 repositories (Auth, Application, Location, PartyRole, Document)
- ✅ **Interceptors**: Auth (JWT), Error (global handling), Loading
- ✅ **Guards**: AuthGuard, RoleGuard

---

### 🚧 Phase 3: Frontend Features (TO BE CREATED)

#### Shared Components

- ⬜ Data Table Component (pagination, sorting, filtering)
- ⬜ File Upload Component (drag-drop, preview, progress)
- ⬜ Status Badge Component
- ⬜ Loading Spinner Component
- ⬜ Confirm Dialog Component

#### Feature Modules

- ⬜ **Auth Feature**: Phone input, OTP verify, Officer login pages
- ⬜ **Application Feature**: JSP registration form (multi-section), My Applications list
- ⬜ **Approvals Feature**: Review queue, approval history timeline
- ⬜ **Dashboard Feature**: Statistics cards, charts (Mandal/District/State views)
- ⬜ **Admin Feature**: Officer management, party roles management

#### Layouts

- ⬜ Main Layout (sidebar + header + router-outlet)
- ⬜ Auth Layout (centered card)

#### Routing

- ⬜ Route configuration with guards
- ⬜ Lazy loading for feature modules

---

## 🗂️ Database Schema Highlights

### Application Flow

```
DRAFT → SUBMITTED → MANDAL_REVIEW → DISTRICT_REVIEW → STATE_REVIEW → APPROVED
                         ↓                ↓                 ↓
                    REJECTED / CORRECTION_REQUIRED (loops back to applicant)
```

### Location Hierarchy

```
District → Constituency → Mandal
```

### Role-Based Access

- **Mandal Officer**: Sees only applications in assigned mandal
- **District Officer**: Sees applications in assigned district (after mandal approval)
- **State Officer**: Sees all district-approved applications
- **Super Admin**: Full access

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Angular CLI (`npm install -g @angular/cli`)

### Backend Setup

```powershell
cd backend

# Install dependencies
npm install

# Configure database
# Edit .env file with your PostgreSQL credentials
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/jsp_registration"

# Run migrations and seed
npx prisma migrate dev --name init
npm run prisma:seed

# Start server
npm run dev
```

Backend runs at: `http://localhost:3000`

### Frontend Setup

```powershell
cd frontend

# Install dependencies (already done)
npm install

# Start dev server
ng serve
```

Frontend runs at: `http://localhost:4200`

---

## 📝 Test Accounts

| Role             | Phone      | Password    | Access            |
| ---------------- | ---------- | ----------- | ----------------- |
| Super Admin      | 9999999999 | admin123    | Full system       |
| Mandal Officer   | 9111111111 | mandal123   | Gajuwaka Mandal   |
| Mandal Officer   | 9222222222 | mandal123   | Machavaram Mandal |
| District Officer | 9333333333 | district123 | Visakhapatnam     |
| District Officer | 9444444444 | district123 | Vijayawada        |
| State Officer    | 9555555555 | state123    | State level       |
| State Officer    | 9666666666 | state123    | State level       |

**Applicants**: Any 10-digit phone number. OTP is always `123456` in development mode.

---

## 📋 JSP Registration Form Fields

### Section 1: Personal Details

- Phone Number, JSP ID, Full Name
- District, Constituency, Mandal (cascading dropdowns)
- Village/Ward, Polling Booth

### Section 2: Additional Information

- Short Description
- Bio Data Upload (single file)
- Supporting Documents (multiple files)

### Section 3: Expected Roles

- Preferred Role 1, 2, 3 (dropdowns from PartyRole table)
- Flexibility for Other Roles (Agree/Disagree)

### Actions

- Submit Button (enters approval workflow)
- Upgrade Button (rendered, no action yet)

---

## 🏗️ Architecture Decisions

### Backend

- **Clean Architecture**: Repository → Service → Controller → Routes
- **No business logic in controllers** or repositories
- **Zod validation** for all inputs
- **Prisma ORM** with raw SQL for complex queries when needed
- **JWT with refresh tokens** (15min access, 7d refresh)
- **File storage abstraction**: `IStorageProvider` interface (Local for dev, S3-ready)
- **OTP abstraction**: `IOtpProvider` interface (Dummy for dev, SMS-ready)

### Frontend

- **Standalone components** only (no NgModules)
- **Signals** for state management (no NgRx)
- **Repository pattern** for HTTP calls
- **Route guards** for authentication and authorization
- **HTTP interceptors** for global concerns

---

## 📊 API Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Success",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 🔐 Security Features

- **JWT Authentication**: Access + refresh token rotation
- **Role-Based Access Control (RBAC)**: 5 distinct roles
- **Rate Limiting**: 5 OTP requests per 15 minutes, 100 general requests
- **Helmet**: Security HTTP headers
- **CORS**: Restricted to configured origin
- **Input Validation**: Zod schemas on all endpoints
- **File Upload Validation**: MIME type + size checks (10MB max)
- **Audit Logging**: All actions logged with user/IP/timestamp

---

## 🐛 Known Issues & Limitations

### Database

- ⚠️ PostgreSQL must be manually set up and configured (see backend/.env)
- ⚠️ Migration requires valid DB connection

### Frontend

- ⚠️ Feature modules not yet created (only core infrastructure complete)
- ⚠️ No UI components yet (routing will throw errors)

### Development

- ⚠️ OTP is hardcoded to `123456` in development
- ⚠️ Upgrade button has no functionality (deferred feature)

---

## 📦 Dependencies

### Backend

- express, prisma, @prisma/client, jsonwebtoken, bcryptjs, zod, multer, helmet, cors, express-rate-limit, winston, uuid, exceljs, jspdf, csv-writer

### Frontend

- @angular/core, @angular/material, @angular/cdk, tailwindcss, apexcharts, ng-apexcharts, ngx-toastr

---

## 🎯 Next Steps

1. **Complete Frontend Features**
   - Create shared components
   - Build auth, application, approvals, and dashboard modules
   - Wire up routing

2. **Testing**
   - Backend API testing (Postman/Jest)
   - Frontend unit tests (Jasmine/Karma)
   - E2E testing (Playwright)

3. **Production Readiness**
   - Replace dummy OTP with real SMS provider
   - Configure S3 or Azure Blob Storage for file uploads
   - Set up environment-specific configs
   - Add monitoring and error tracking
   - Deploy backend (AWS/Azure/Railway)
   - Deploy frontend (Vercel/Netlify/Cloudflare)

---

## 📚 Documentation

- Backend API docs: See `backend/README.md`
- Frontend architecture: See `frontend/README.md`
- Database schema: See `backend/prisma/schema.prisma`

---

**Project Status**: Core infrastructure complete (Backend 100%, Frontend Core 100%). Ready for frontend feature module development.

**Last Updated**: May 29, 2026
