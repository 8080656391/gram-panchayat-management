import { Request, Response } from 'express';
import Grievance from '../models/Grievance.js';
import User from '../models/User.js';
import fs from 'fs';

interface AuthRequest extends Request {
  user?: any;
  files?: any;
  file?: any;
}

// @desc    Get all grievances
// @route   GET /api/grievances
// @access  Private (Staff, Admin)
export const getGrievances = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query: any = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Filter by assigned staff
    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.filedDate = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string)
      };
    }

    // Search by complainant name or description
    if (req.query.search) {
      query.$or = [
        { complainantName: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Execute query with population
    const grievances = await Grievance.find(query)
      .populate('complainantId', 'name email phone village')
      .populate('assignedTo', 'name email')
      .populate('closedBy', 'name')
      .sort({ filedDate: -1 })
      .limit(limit)
      .skip(startIndex);

    // Get total count for pagination
    const total = await Grievance.countDocuments(query);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalGrievances: total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      data: {
        grievances,
        pagination
      }
    });
  } catch (error: any) {
    console.error('Get grievances error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single grievance
// @route   GET /api/grievances/:id
// @access  Private (Staff, Admin)
export const getGrievance = async (req: Request, res: Response): Promise<void> => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate('complainantId', 'name email phone village')
      .populate('assignedTo', 'name email')
      .populate('closedBy', 'name');

    if (!grievance) {
      res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { grievance }
    });
  } catch (error: any) {
    console.error('Get grievance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new grievance
// @route   POST /api/grievances
// @access  Private (Citizen)
export const createGrievance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      category,
      description,
      location,
      priority
    } = req.body;

    // Get user details
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Process uploaded attachments
    let attachments: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      attachments = req.files.map((file: any) => file.path);
    }

    // Create grievance
    const grievance = await Grievance.create({
      complainantId: req.user._id,
      complainantName: user.name,
      email: user.email,
      phone: user.phone,
      category,
      description,
      location,
      priority: priority || 'medium',
      attachments
    });

    res.status(201).json({
      success: true,
      message: 'Grievance filed successfully',
      data: { grievance }
    });
  } catch (error: any) {
    console.error('Create grievance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update grievance
// @route   PUT /api/grievances/:id
// @access  Private (Staff, Admin)
export const updateGrievance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      priority,
      assignedTo,
      resolution,
      remarks
    } = req.body;

    const updateData: any = {};

    // Check if user is a citizen - they can only update their own grievances
    if (req.user.role === 'citizen') {
      const grievance = await Grievance.findById(req.params.id);
      if (!grievance) {
        res.status(404).json({
          success: false,
          message: 'Grievance not found'
        });
        return;
      }
      // Check if the grievance belongs to this citizen
      if (grievance.complainantId.toString() !== req.user._id.toString()) {
        res.status(403).json({
          success: false,
          message: 'You can only update your own grievances'
        });
        return;
      }
      // Citizens can only update certain fields
      if (status && !['pending', 'cancelled'].includes(status)) {
        res.status(403).json({
          success: false,
          message: 'You cannot change the status of this grievance'
        });
        return;
      }
    }

    if (status) {
      updateData.status = status;
    }

    if (priority) {
      updateData.priority = priority;
    }

    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    if (resolution) {
      updateData.resolution = resolution;
    }

    // First get the existing grievance to check dates
    const existingGrievance = await Grievance.findById(req.params.id);
    
    if (!existingGrievance) {
      res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
      return;
    }

    // Set dates based on status - only if they haven't been set before
    if (status === 'under-review' && !existingGrievance.assignedDate) {
      updateData.assignedDate = new Date();
    } else if (status === 'resolved' && !existingGrievance.resolutionDate) {
      updateData.resolutionDate = new Date();
    } else if (status === 'closed') {
      updateData.closedBy = req.user._id;
      updateData.closedDate = new Date();
    }

    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('complainantId', 'name email phone village')
     .populate('assignedTo', 'name email')
     .populate('closedBy', 'name');

    if (!grievance) {
      res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Grievance updated successfully',
      data: { grievance }
    });
  } catch (error: any) {
    console.error('Update grievance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete grievance
// @route   DELETE /api/grievances/:id
// @access  Private (Admin)
export const deleteGrievance = async (req: Request, res: Response): Promise<void> => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
      return;
    }

    // Delete associated files
    if (grievance.attachments && grievance.attachments.length > 0) {
      grievance.attachments.forEach((attachment: string) => {
        if (fs.existsSync(attachment)) {
          fs.unlinkSync(attachment);
        }
      });
    }

    await Grievance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Grievance deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete grievance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload attachment to grievance
// @route   POST /api/grievances/:id/upload
// @access  Private (Staff, Admin)
export const uploadAttachment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
      return;
    }

    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
      return;
    }

    grievance.attachments = grievance.attachments || [];
    grievance.attachments.push(req.file.path);
    await grievance.save();

    res.status(200).json({
      success: true,
      message: 'Attachment uploaded successfully',
      data: { attachment: req.file.path }
    });
  } catch (error: any) {
    console.error('Upload attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's own grievances
// @route   GET /api/grievances/my-grievances
// @access  Private (Citizen)
export const getMyGrievances = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    const query = { complainantId: req.user._id };

    // Filter by status if specified
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by category if specified
    if (req.query.category) {
      query.category = req.query.category;
    }

    const grievances = await Grievance.find(query)
      .sort({ filedDate: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await Grievance.countDocuments(query);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalGrievances: total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      data: {
        grievances,
        pagination
      }
    });
  } catch (error: any) {
    console.error('Get my grievances error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add feedback to resolved grievance
// @route   POST /api/grievances/:id/feedback
// @access  Private (Citizen)
export const addFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { feedback, feedbackRating } = req.body;

    const grievance = await Grievance.findOne({
      _id: req.params.id,
      complainantId: req.user._id,
      status: 'resolved'
    });

    if (!grievance) {
      res.status(404).json({
        success: false,
        message: 'Grievance not found or not eligible for feedback'
      });
      return;
    }

    grievance.feedback = feedback;
    grievance.feedbackRating = feedbackRating;
    await grievance.save();

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: { grievance }
    });
  } catch (error: any) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};