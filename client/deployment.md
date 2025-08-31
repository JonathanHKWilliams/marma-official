# Marma Registration System Deployment Guide

This document provides instructions for deploying the Marma Registration System to production.

## Quick Access Links

- **Main Site**: `/` - Home page with registration information
- **Registration Form**: `/register` - Member registration form
- **Admin Login**: `/admin/login` - Admin portal login
- **Admin Dashboard**: `/admin/dashboard` - Protected admin dashboard (requires login)

## Prerequisites

- Node.js 16+ and npm 8+
- Access to a hosting service (Netlify, Vercel, or similar for frontend)
- Backend API server with email capabilities (if using real email sending)
- Email service account credentials

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```
# Email Configuration
REACT_APP_EMAIL_FROM=marmalliance@gmail.com
REACT_APP_ADMIN_EMAIL=marmalliance@gmail.com

# Email Service Configuration (for production)
REACT_APP_EMAIL_SERVICE=gmail
REACT_APP_EMAIL_USER=your-email@gmail.com
REACT_APP_EMAIL_PASSWORD=your-app-password

# API Configuration
REACT_APP_API_URL=https://api.marma.org/v1
```

2. Replace placeholder values with your actual credentials.
3. Make sure `.env` is added to `.gitignore` to prevent exposing sensitive information.

## Build Process

1. Install dependencies:
```bash
npm install
```

2. Build the production version:
```bash
npm run build
```

3. The build output will be in the `build` directory.

## Deployment Options

### Option 1: Render Deployment

1. Connect your repository to Render.
2. Configure environment variables in the Render dashboard.
3. Set the build command to `npm run build`.
4. Set the publish directory to `build`.
5. Ensure the `render.yaml` and `static.json` files are in the repository root.

### Option 2: Other Static Hosting (Netlify, Vercel, etc.)

1. Connect your repository to the hosting service.
2. Configure environment variables in the hosting service dashboard.
3. Set the build command to `npm run build`.
4. Set the publish directory to `build`.
5. Configure rewrites/redirects to handle client-side routing.

### Option 2: Manual Deployment

1. Build the project as described above.
2. Upload the contents of the `build` directory to your web server.
3. Configure your web server to serve the `index.html` file for all routes.

## Backend API Integration

For the registration system to work with real data storage and email sending, you need to implement a backend API with the following endpoints:

1. `/registrations` - GET, POST, PATCH methods for managing registrations
2. `/email/send` - POST method for sending emails

The frontend is already configured to use these endpoints when `REACT_APP_API_URL` is set.

## Backend Implementation Notes

The backend should implement:

1. Data persistence (database storage for registrations)
2. Email sending using Nodemailer or similar
3. Authentication for admin routes
4. Validation for registration data

## Testing Deployment

1. Verify that the registration form works correctly.
2. Test email sending functionality.
3. Access the admin login page via the link in the footer.
4. Log in with the admin credentials (default: admin@marma.org / @Liight).
5. Confirm that the admin dashboard is accessible after login.
6. Verify that the admin approval process works.
7. Check that data persistence is working properly.
8. Test that direct navigation to `/admin/dashboard` redirects to login when not authenticated.

## Troubleshooting

- If emails are not being sent, check email service credentials and firewall settings.
- If data is not being saved, verify API connectivity and database configuration.
- For routing issues, ensure that the server is configured to handle client-side routing.

## Security Considerations

1. Use HTTPS for all communications.
2. Store sensitive credentials in environment variables.
3. Implement proper authentication for admin functions.
4. Validate all user inputs on both client and server sides.
5. Implement rate limiting to prevent abuse.
