import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check for token in cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    console.log('Auth middleware - Token present:', !!token);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      console.log('Auth middleware - Decoded token:', decoded);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      console.log('Auth middleware - User found:', !!user, user?.role);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      if (!user.isActive) {
        res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.log('Auth middleware - Token verification failed:', error);
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this resource`
      });
      return;
    }

    next();
  };
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
        const user = await User.findById(decoded.id).select('-password');

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid but we don't throw error for optional auth
      }
    }

    next();
  } catch (error) {
    next();
  }
};