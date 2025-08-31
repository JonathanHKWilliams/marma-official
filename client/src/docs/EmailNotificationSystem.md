# Email Notification System Documentation

## Overview

The MARMA (Mano River Ministerial Alliance) email notification system handles automated communications for the registration process. It sends emails for:

1. Registration confirmation to users
2. New registration notifications to administrators
3. Status update notifications (approval/denial) to users

## System Architecture

The system is currently implemented as a frontend simulation that logs email details to the console. For production, it should be replaced with a backend implementation using Nodemailer or a similar email service.

### Key Components

- **emailService.ts**: Contains email templates and sending functions
- **registrationService.ts**: Handles registration logic and triggers email notifications
- **RegistrationModal.tsx**: Admin interface for approving/declining registrations

## Email Types

### 1. Registration Confirmation Email

Sent to users immediately after registration submission.

**Function**: `sendRegistrationConfirmation(registrationData)`

**Template**: HTML email with:
- MARMA branding
- Welcome message
- Registration details summary
- Next steps information

### 2. Admin Notification Email

Sent to administrators when a new registration is submitted.

**Function**: `notifyAdminOfNewRegistration(registrationData)`

**Template**: HTML email with:
- MARMA branding
- Notification of new registration
- Registration details summary
- Link to admin dashboard (to be implemented)

### 3. Status Update Email

Sent to users when their registration status changes (approved/declined).

**Function**: `sendStatusUpdateEmail(registrationData, status, message)`

**Template**: HTML email with:
- MARMA branding
- Status update message (approval or decline)
- Custom message from administrator
- Next steps based on status

## Implementation Details

### Current Implementation (Frontend Simulation)

The current implementation uses a mock email sending function that logs email details to the console:

```typescript
// Mock email sending function
const sendEmail = (options: any): Promise<void> => {
  return new Promise((resolve) => {
    console.log('------ EMAIL SENT ------');
    console.log('From:', options.from);
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('Content:', options.html);
    console.log('-----------------------');
    resolve();
  });
};
```

### Production Implementation (Backend)

For production, replace the mock implementation with a real email service:

```typescript
// Example Nodemailer implementation for backend
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or another service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = (options: any): Promise<void> => {
  return transporter.sendMail(options);
};
```

## Environment Variables

For production deployment, the following environment variables should be set:

- `EMAIL_USER`: Email account username
- `EMAIL_PASSWORD`: Email account password
- `ADMIN_EMAIL`: Administrator's email address

## Integration with Registration Service

The email service is integrated with the registration service at key points:

1. **New Registration**: 
   ```typescript
   // In createRegistration function
   await sendRegistrationConfirmation(registrationData);
   await notifyAdminOfNewRegistration(registrationData);
   ```

2. **Status Update**:
   ```typescript
   // In updateRegistrationStatus function
   await sendStatusUpdateEmail(registration, status, message);
   ```

## Integration with Admin Interface

The admin interface in `RegistrationModal.tsx` allows administrators to:

1. View registration details
2. Approve or decline registrations with a custom message
3. Authenticate with password before status changes

When a status is updated, the `onStatusUpdate` callback triggers the email notification.

## Testing

Use the test component at `/test-registration` to test the complete registration flow and email notifications.

## Security Considerations

1. **Email Credentials**: Never expose email credentials in frontend code
2. **Admin Authentication**: Require password confirmation for status changes
3. **Email Templates**: Avoid including sensitive information in email templates
4. **Rate Limiting**: Implement rate limiting for email sending in production

## Future Enhancements

1. **Email Queue**: Implement a queue system for reliable email delivery
2. **Email Analytics**: Track email open and click rates
3. **HTML/Text Alternatives**: Provide both HTML and plain text versions of emails
4. **Localization**: Support for multiple languages in email templates
5. **Email Verification**: Add email verification step to registration process
