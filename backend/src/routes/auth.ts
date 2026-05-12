import express from 'express';
import { body } from 'express-validator';
import { register, login, logout, getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('village').trim().notEmpty().withMessage('Village is required'),
  body('role').optional().isIn(['citizen', 'staff', 'admin']).withMessage('Invalid role'),
  body('aadharNumber')
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^\d{12}$/)
    .withMessage('Aadhar number must be 12 digits'),
  body('dateOfBirth')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('address')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address cannot be more than 200 characters')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;