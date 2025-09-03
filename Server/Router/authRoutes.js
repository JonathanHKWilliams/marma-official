import express from 'express';
import { body } from 'express-validator';
import {
  login,
  createAdmin,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  logout
} from '../Controller/authController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const authRouter = express.Router();

// Validation middleware
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const createAdminValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('role').optional().isIn(['admin', 'super_admin']).withMessage('Invalid role')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Public routes
authRouter.post('/login', loginValidation, login);
authRouter.post('/refresh', refreshToken);

// Protected routes
authRouter.post('/logout', authenticateToken, logout);
authRouter.get('/me', authenticateToken, getProfile);
authRouter.put('/profile', authenticateToken, updateProfile);
authRouter.put('/change-password', authenticateToken, changePasswordValidation, changePassword);
authRouter.get('/verify', authenticateToken, (req, res) => {
  res.json({ success: true, data: { valid: true } });
});

// Super admin only routes
authRouter.post('/create-admin', authenticateToken, authorizeRoles('super_admin'), createAdminValidation, createAdmin);

export default authRouter;

