import { Request, Response } from 'express';
import Scheme from '../models/Scheme.js';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Public (with optional auth)
export const getSchemes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query: any = { isActive: true };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Search by name or description
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Execute query
    const schemes = await Scheme.find(query)
      .populate('createdBy', 'name')
      .sort({ lastUpdated: -1 })
      .limit(limit)
      .skip(startIndex);

    // Get total count for pagination
    const total = await Scheme.countDocuments(query);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSchemes: total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      data: {
        schemes,
        pagination
      }
    });
  } catch (error: any) {
    console.error('Get schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get schemes by category
// @route   GET /api/schemes/category/:category
// @access  Public (with optional auth)
export const getSchemesByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const schemes = await Scheme.find({
      category: req.params.category,
      isActive: true
    }).populate('createdBy', 'name').sort({ lastUpdated: -1 });

    res.status(200).json({
      success: true,
      data: { schemes }
    });
  } catch (error: any) {
    console.error('Get schemes by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single scheme
// @route   GET /api/schemes/:id
// @access  Public (with optional auth)
export const getScheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const scheme = await Scheme.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!scheme || !scheme.isActive) {
      res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { scheme }
    });
  } catch (error: any) {
    console.error('Get scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new scheme
// @route   POST /api/schemes
// @access  Private (Admin)
export const createScheme = async (req: AuthRequest, res: Response, next: any): Promise<void> => {
  try {
    const {
      name,
      description,
      category,
      eligibility,
      benefits,
      applicationProcess,
      applicationLink,
      contactInfo
    } = req.body;

    // Validate required fields
    if (!name || !description || !category || !eligibility || !benefits || !applicationProcess || !contactInfo) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!description) missingFields.push('description');
      if (!category) missingFields.push('category');
      if (!eligibility) missingFields.push('eligibility');
      if (!benefits) missingFields.push('benefits');
      if (!applicationProcess) missingFields.push('applicationProcess');
      if (!contactInfo) missingFields.push('contactInfo');
      
      res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
      return;
    }

    // Validate name object
    if (!name.en || !name.mr) {
      res.status(400).json({
        success: false,
        message: 'Scheme name must be provided in both English and Marathi'
      });
      return;
    }

    // Validate description object
    if (!description.en || !description.mr) {
      res.status(400).json({
        success: false,
        message: 'Description must be provided in both English and Marathi'
      });
      return;
    }

    // Validate eligibility object
    if (!eligibility.en || !Array.isArray(eligibility.en) || eligibility.en.length === 0 ||
        !eligibility.mr || !Array.isArray(eligibility.mr) || eligibility.mr.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Eligibility criteria must be provided in both English and Marathi (at least one item each)'
      });
      return;
    }

    // Validate benefits object
    if (!benefits.en || !Array.isArray(benefits.en) || benefits.en.length === 0 ||
        !benefits.mr || !Array.isArray(benefits.mr) || benefits.mr.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Benefits must be provided in both English and Marathi (at least one item each)'
      });
      return;
    }

    // Validate applicationProcess object
    if (!applicationProcess.en || !applicationProcess.mr) {
      res.status(400).json({
        success: false,
        message: 'Application process must be provided in both English and Marathi'
      });
      return;
    }

    // Validate contactInfo object
    if (!contactInfo.department || !contactInfo.phone || !contactInfo.email) {
      res.status(400).json({
        success: false,
        message: 'All contact information fields (department, phone, email) are required'
      });
      return;
    }

    // Create scheme
    const scheme = await Scheme.create({
      name,
      description,
      category,
      eligibility,
      benefits,
      applicationProcess,
      applicationLink,
      contactInfo,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data: { scheme }
    });
  } catch (error: any) {
    console.error('Create scheme error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', ');
      res.status(400).json({
        success: false,
        message: `Validation error: ${messages}`
      });
      return;
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Scheme with this name already exists'
      });
      return;
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update scheme
// @route   PUT /api/schemes/:id
// @access  Private (Admin)
export const updateScheme = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      category,
      eligibility,
      benefits,
      applicationProcess,
      contactInfo,
      isActive
    } = req.body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (eligibility !== undefined) updateData.eligibility = eligibility;
    if (benefits !== undefined) updateData.benefits = benefits;
    if (applicationProcess !== undefined) updateData.applicationProcess = applicationProcess;
    if (contactInfo !== undefined) updateData.contactInfo = contactInfo;
    if (isActive !== undefined) updateData.isActive = isActive;

    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!scheme) {
      res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Scheme updated successfully',
      data: { scheme }
    });
  } catch (error: any) {
    console.error('Update scheme error:', error);

    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Scheme with this name already exists'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete scheme
// @route   DELETE /api/schemes/:id
// @access  Private (Admin)
export const deleteScheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
      return;
    }

    // Soft delete by deactivating
    await Scheme.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Scheme deactivated successfully'
    });
  } catch (error: any) {
    console.error('Delete scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete all schemes
// @route   DELETE /api/schemes
// @access  Private (Admin)
export const deleteAllSchemes = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Scheme.deleteMany({});

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} scheme(s) deleted successfully`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error: any) {
    console.error('Delete all schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};