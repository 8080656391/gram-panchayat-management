// @desc    Create user
// @route   POST /api/users
// @access  Private (Staff, Admin)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone, village, aadharNumber, dateOfBirth, address } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role || !phone || !village) {
      res.status(400).json({
        success: false,
        message: 'Name, email, password, role, phone, and village are required.'
      });
      return;
    }

    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email already in use.'
      });
      return;
    }

    // Check for existing aadhar number
    if (aadharNumber) {
      const existingAadhar = await User.findOne({ aadharNumber });
      if (existingAadhar) {
        res.status(400).json({
          success: false,
          message: 'Aadhar number already registered.'
        });
        return;
      }
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role,
      phone,
      village,
      aadharNumber,
      dateOfBirth,
      address
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: { ...user.toObject(), password: undefined } }
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    sendErrorResponse(res, error);
  }
};
import { Request, Response } from 'express';
import User from '../models/User.js';
import { sendErrorResponse } from '../utils/errorParser.js';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Staff, Admin)
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query: any = {};

    // Filter by role if specified
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Filter by village if specified
    if (req.query.village) {
      query.village = req.query.village;
    }

    // Filter by active status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Execute query
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Pagination info
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination
      }
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Staff, Admin)
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    sendErrorResponse(res, error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Staff, Admin)
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      village: req.body.village,
      role: req.body.role,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth,
      aadharNumber: req.body.aadharNumber,
      isActive: req.body.isActive
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key =>
      fieldsToUpdate[key as keyof typeof fieldsToUpdate] === undefined &&
      delete fieldsToUpdate[key as keyof typeof fieldsToUpdate]
    );

    // Check if email is being updated and if it's already taken
    if (fieldsToUpdate.email) {
      const existingUser = await User.findOne({
        email: fieldsToUpdate.email,
        _id: { $ne: req.params.id }
      });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
        return;
      }
    }

    // Check if aadhar number is being updated and if it's already taken
    if (fieldsToUpdate.aadharNumber) {
      const existingUser = await User.findOne({
        aadharNumber: fieldsToUpdate.aadharNumber,
        _id: { $ne: req.params.id }
      });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Aadhar number already registered'
        });
        return;
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    sendErrorResponse(res, error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Soft delete by deactivating
    await User.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    sendErrorResponse(res, error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin only)
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: ['$isActive', 1, 0] }
          }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Get users by village
    const villageStats = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$village',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        roleStats: stats,
        villageStats
      }
    });
  } catch (error: any) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};