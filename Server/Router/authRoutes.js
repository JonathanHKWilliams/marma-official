import express from 'express';
import { body } from 'express-validator';
import {
  login,
  createAdmin,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken
} from '../Controller/authController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const authRouter = express.Router();

// Login validation
// const loginValidation = [
//   body('email').isEmail().withMessage('Valid email is required'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
// ];

// Create admin validation
// const createAdminValidation = [
//   body('email').isEmail().withMessage('Valid email is required'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name is required'),
//   body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name is required'),
//   body('role').optional().isIn(['admin', 'super_admin']).withMessage('Invalid role')
// ];

// Change password validation
// const changePasswordValidation = [
//   body('currentPassword').notEmpty().withMessage('Current password is required'),
//   body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
// ];

// Public routes
// authRouter.post('/login', loginValidation, login);

// Protected routes
// authRouter.get('/profile', authenticateToken, getProfile);
// authRouter.put('/profile', authenticateToken, updateProfile);
// authRouter.post('/change-password', authenticateToken, changePasswordValidation, changePassword);
// authRouter.post('/refresh', authenticateToken, refreshToken);

// Super admin only routes
// authRouter.post('/create-admin', authenticateToken, authorizeRoles('super_admin'), createAdminValidation, createAdmin);

export default authRouter;
