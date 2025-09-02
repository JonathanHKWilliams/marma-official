# MARMA Official - Backend Server

A comprehensive Node.js/Express backend for the MARMA registration management system with PostgreSQL database and JWT authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database setup**
   ```bash
   # Run migrations
   npm run migrate
   
   # Seed initial data (optional)
   npm run seed
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📋 Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marma_db
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 🔐 Default Admin Account

After running seeds:
- **Email**: admin@marma.org
- **Password**: admin123456
- **Role**: super_admin

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
Login with admin credentials
```json
{
  "email": "admin@marma.org",
  "password": "admin123456"
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication)

#### POST `/api/auth/create-admin`
Create new admin user (super admin only)

### Registration Endpoints

#### POST `/api/registrations`
Create new registration (public endpoint)

#### GET `/api/registrations`
Get paginated registrations with filters
- Query params: `page`, `limit`, `country`, `status`, `search`, `startDate`, `endDate`

#### GET `/api/registrations/:id`
Get single registration by ID

#### PUT `/api/registrations/:id`
Update registration status (admin only)

#### DELETE `/api/registrations/:id`
Delete registration (admin only)

#### GET `/api/registrations/stats`
Get registration statistics

#### GET `/api/registrations/recent`
Get recent registrations

#### GET `/api/registrations/search`
Advanced search with query parameters

#### GET `/api/registrations/country/:country`
Get registrations by country

#### GET `/api/registrations/check-duplicates`
Check for duplicate email/phone

#### POST `/api/registrations/validate`
Validate registration data

#### PUT `/api/registrations/bulk-update`
Bulk update multiple registrations (admin only)

#### POST `/api/registrations/export`
Export registrations to CSV/Excel/PDF (admin only)

## 🗄️ Database Schema

### Users Table
- Authentication and authorization
- Role-based access (admin, super_admin)
- Password hashing with bcrypt

### Registrations Table
- Complete member registration data
- Auto-generated regional codes and ID numbers
- Status tracking with timestamps
- Full-text search capabilities

## 🛡️ Security Features

- JWT token authentication
- Role-based authorization
- Password hashing with bcrypt
- Input validation with express-validator
- CORS configuration
- Global error handling
- SQL injection prevention with Sequelize ORM

## 🔧 Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run migrate      # Run database migrations
npm run migrate:undo # Undo last migration
npm run seed         # Run database seeders
npm test             # Run tests (if configured)
```

## 📁 Project Structure

```
Server/
├── Controller/           # Route handlers
│   ├── authController.js
│   └── registrationController.js
├── Router/              # Route definitions
│   ├── authRoutes.js
│   └── registrationRoutes.js
├── models/              # Database models
│   ├── User.js
│   ├── Registration.js
│   └── index.js
├── middleware/          # Custom middleware
│   └── auth.js
├── migrations/          # Database migrations
├── seeders/            # Database seeders
├── utils/              # Utility functions
│   └── errorHandler.js
├── config/             # Configuration files
│   └── config.js
└── server.js           # Main application file
```

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## 📊 Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```