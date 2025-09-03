import express from 'express';
import { body } from 'express-validator';
import {
  createRegistration,
  getRegistrations,
  getRegistrationById,
  updateRegistration,
  deleteRegistration,
  getRegistrationStats,
  bulkUpdateRegistrations,
  exportRegistrations,
  getRegistrationsByCountry,
  getRecentRegistrations,
  searchRegistrations,
  validateRegistration,
  checkDuplicate
} from '../Controller/registrationController.js';
import { authenticateToken, authorizeRoles, optionalAuth } from '../middleware/auth.js';
import { uploadPhoto, handleUploadError } from '../middleware/upload.js';

const registrationRouter = express.Router();

// Validation middleware
const registrationValidation = [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('maritalStatus').isIn(['single', 'married', 'divorced', 'widowed']).withMessage('Invalid marital status'),
  body('gender').isIn(['male', 'female']).withMessage('Invalid gender'),
  body('educationLevel').notEmpty().withMessage('Education level is required'),
  body('churchOrganization').notEmpty().withMessage('Church organization is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('recommendationName').notEmpty().withMessage('Recommendation name is required'),
  body('recommendationContact').notEmpty().withMessage('Recommendation contact is required'),
  body('recommendationRelationship').notEmpty().withMessage('Recommendation relationship is required'),
  body('recommendationChurch').notEmpty().withMessage('Recommendation church is required'),
  body('membershipPurpose').notEmpty().withMessage('Membership purpose is required')
];

// Public routes (no authentication required)
registrationRouter.get('/check-duplicates', checkDuplicate);
registrationRouter.post('/validate', validateRegistration);

// Specific protected routes (must come before parameterized routes)
registrationRouter.get('/stats', authenticateToken, getRegistrationStats);
registrationRouter.get('/recent', authenticateToken, getRecentRegistrations);
registrationRouter.get('/search', authenticateToken, searchRegistrations);
registrationRouter.post('/export', authenticateToken, authorizeRoles('admin', 'super_admin'), exportRegistrations);
registrationRouter.put('/bulk-update', authenticateToken, authorizeRoles('admin', 'super_admin'), bulkUpdateRegistrations);

// Country-specific route
registrationRouter.get('/country/:country', authenticateToken, getRegistrationsByCountry);

// Main routes
registrationRouter.post('/', uploadPhoto, handleUploadError, registrationValidation, createRegistration);
// Get all registrations
registrationRouter.get('/', authenticateToken, getRegistrations);

// ID-based routes (must be last)
registrationRouter.get('/:id', authenticateToken, getRegistrationById);
registrationRouter.put('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), updateRegistration);
registrationRouter.delete('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), deleteRegistration);

export default registrationRouter;
