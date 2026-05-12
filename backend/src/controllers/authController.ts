import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

interface AuthRequest extends Request {
  user?: any;
}

// Generate JWT Token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  } as jwt.SignOptions);
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { name, email, password, phone, village, role, aadharNumber, dateOfBirth, address } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
      return;
    }

    // Check if aadhar number is already registered (if provided)
    if (aadharNumber) {
      const aadharExists = await User.findOne({ aadharNumber });
      if (aadharExists) {
        res.status(400).json({
          success: false,
          message: 'Aadhar number already registered'
        });
        return;
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      village,
      role: role || 'citizen',
      aadharNumber,
      dateOfBirth,
      address
    });

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          village: user.village,
          registrationDate: user.registrationDate
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Check if account is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          village: user.village,
          registrationDate: user.registrationDate
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: {}
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user!._id,
          name: user!.name,
          email: user!.email,
          role: user!.role,
          phone: user!.phone,
          village: user!.village,
          aadharNumber: user!.aadharNumber,
          dateOfBirth: user!.dateOfBirth,
          address: user!.address,
          registrationDate: user!.registrationDate,
          age: user!.age
        }
      }
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      village: req.body.village,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key =>
      fieldsToUpdate[key as keyof typeof fieldsToUpdate] === undefined &&
      delete fieldsToUpdate[key as keyof typeof fieldsToUpdate]
    );

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user!._id,
          name: user!.name,
          email: user!.email,
          role: user!.role,
          phone: user!.phone,
          village: user!.village,
          aadharNumber: user!.aadharNumber,
          dateOfBirth: user!.dateOfBirth,
          address: user!.address,
          registrationDate: user!.registrationDate,
          age: user!.age
        }
      }
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
};
