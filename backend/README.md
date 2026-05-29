# JSP Party Role Registration System - Backend

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Initial Setup

### 1. Install Dependencies

```powershell
cd backend
npm install
```

### 2. Database Setup

#### Install PostgreSQL (if not already installed)

Download and install PostgreSQL from: https://www.postgresql.org/download/windows/

#### Create Database

Open PostgreSQL (pgAdmin or psql) and create a new database:

```sql
CREATE DATABASE jsp_registration;
```

#### Configure Environment Variables

The `.env` file is already created. Update it if your PostgreSQL credentials are different:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/jsp_registration?schema=public"
```

Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

### 3. Run Prisma Migrations

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Seed Database

```powershell
npm run prisma:seed
```

This will create:

- Sample districts, constituencies, and mandals (Andhra Pradesh data)
- Party roles (a, b, c - placeholders)
- Test user accounts (see below)

### 5. Start Development Server

```powershell
npm run dev
```

The API will be available at: `http://localhost:3000`

## Test Accounts

After seeding, you can use these accounts for testing:

| Role             | Phone      | Password    | Access Level           |
| ---------------- | ---------- | ----------- | ---------------------- |
| Super Admin      | 9999999999 | admin123    | Full system access     |
| Mandal Officer   | 9111111111 | mandal123   | Gajuwaka Mandal        |
| Mandal Officer   | 9222222222 | mandal123   | Machavaram Mandal      |
| District Officer | 9333333333 | district123 | Visakhapatnam District |
| District Officer | 9444444444 | district123 | Vijayawada District    |
| State Officer    | 9555555555 | state123    | State level            |
| State Officer    | 9666666666 | state123    | State level            |

**Applicants**: Use any 10-digit phone number. OTP will be `123456` (dev mode).

## API Endpoints

### Authentication

- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login (applicants)
- `POST /api/auth/officer/login` - Officer login with phone/password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Locations (Public)

- `GET /api/locations/districts` - Get all districts
- `GET /api/locations/constituencies?districtId=<id>` - Get constituencies by district
- `GET /api/locations/mandals?constituencyId=<id>` - Get mandals by constituency

### Party Roles

- `GET /api/party-roles` - Get active party roles (public)
- `GET /api/party-roles/all` - Get all roles (admin only)
- `POST /api/party-roles` - Create role (admin only)
- `PUT /api/party-roles/:id` - Update role (admin only)
- `DELETE /api/party-roles/:id` - Delete role (admin only)

### Applications (Protected)

- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application (draft only)
- `POST /api/applications/:id/submit` - Submit application for approval
- `GET /api/applications/:id` - Get application by ID
- `GET /api/applications` - List applications (filtered by role)
- `GET /api/applications/stats/summary` - Get statistics

### Documents (Protected)

- `POST /api/documents/upload` - Upload document (multipart/form-data)
- `GET /api/documents/application/:applicationId` - Get documents for application
- `GET /api/documents/:id/download` - Download document
- `DELETE /api/documents/:id` - Delete document

### Health Check

- `GET /health` - Server health status

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data script
├── src/
│   ├── config/              # Configuration files
│   ├── constants/           # Constants and enums
│   ├── controllers/         # Request handlers
│   ├── middlewares/         # Express middlewares
│   ├── providers/           # External service providers (OTP, etc.)
│   ├── repositories/        # Database access layer
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic layer
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── validators/          # Zod validation schemas
│   ├── app.ts               # Express app configuration
│   └── server.ts            # Server entry point
├── uploads/                 # File upload directory
├── logs/                    # Application logs
├── .env                     # Environment variables
├── .env.example             # Example environment file
├── package.json
└── tsconfig.json
```

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Architecture

This backend follows **Clean Architecture** principles:

### Layers:

1. **Repository Layer** - Pure database operations
   - No business logic
   - Returns raw Prisma models
   - Located in `src/repositories/`

2. **Service Layer** - Business logic
   - Data transformation
   - Workflow management
   - Authorization logic
   - Located in `src/services/`

3. **Controller Layer** - HTTP request handling
   - Request parsing
   - Response formatting
   - Error handling
   - Located in `src/controllers/`

4. **Routes Layer** - Endpoint definitions
   - Route registration
   - Middleware application
   - Validation
   - Located in `src/routes/`

### Flow:

```
Request → Middleware → Route → Controller → Service → Repository → Database
```

## Security Features

- **JWT Authentication** - Access (15min) + Refresh (7d) tokens
- **Role-Based Access Control** - 5 user roles with distinct permissions
- **Rate Limiting** - 5 OTP requests per 15 minutes, 100 general requests
- **Helmet** - Security headers
- **CORS** - Restricted to configured origin
- **File Upload Validation** - MIME type + size checks (10MB max)
- **Input Validation** - Zod schemas for all requests
- **Audit Logging** - All actions logged with user/IP/timestamp

## Troubleshooting

### Database Connection Errors

1. Ensure PostgreSQL service is running
2. Verify credentials in `.env` file
3. Check if database `jsp_registration` exists
4. Test connection: `npx prisma db push`

### Migration Errors

If migrations fail, you can reset the database:

```powershell
npx prisma migrate reset
npm run prisma:seed
```

⚠️ **Warning**: This will delete all data!

### Port Already in Use

If port 3000 is occupied, change it in `.env`:

```env
PORT=3001
```

## Next Steps

1. Set up PostgreSQL and create the database
2. Run migrations and seed data
3. Test authentication endpoints using Postman or similar tool
4. Proceed with frontend development

## Support

For issues or questions, check:

- Prisma Docs: https://www.prisma.io/docs
- Express Docs: https://expressjs.com/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
