import { Request, Response } from 'express';
import TaxRecord from '../models/Tax.js';
import User from '../models/User.js';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all tax records
// @route   GET /api/taxes
// @access  Private (Staff, Admin)
export const getTaxRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    let limit: number | undefined;
    let startIndex = 0;
    if (req.query.limit === 'all') {
      limit = undefined; // No limit
      startIndex = 0;
    } else {
      limit = parseInt(req.query.limit as string) || 10;
      startIndex = (page - 1) * limit;
    }

    // Build query
    let query: any = {};

    // Filter by taxpayer
    if (req.query.taxpayerId) {
      query.taxpayerId = req.query.taxpayerId;
    }

    // Filter by tax year
    if (req.query.taxYear) {
      query.taxYear = parseInt(req.query.taxYear as string);
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by due date range
    if (req.query.startDate && req.query.endDate) {
      query.dueDate = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string)
      };
    }

    // Search by taxpayer name
    if (req.query.search) {
      // First find users matching the search
      const users = await User.find({
        name: { $regex: req.query.search, $options: 'i' }
      }).select('_id');

      const userIds = users.map(user => user._id);
      query.taxpayerId = { $in: userIds };
    }

    // Execute query with population
    let taxQuery = TaxRecord.find(query)
      .populate('taxpayerId', 'name email phone village')
      .populate('collectedBy', 'name')
      .sort({ dueDate: -1 });
    if (typeof limit === 'number') {
      taxQuery = taxQuery.limit(limit).skip(startIndex);
    }
    const taxRecords = await taxQuery;

    // Get total count for pagination
    const total = await TaxRecord.countDocuments(query);


    let pagination = undefined;
    if (typeof limit === 'number') {
      pagination = {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      };
    }

    res.status(200).json({
      success: true,
      data: {
        taxRecords,
        ...(pagination ? { pagination } : {})
      }
    });
  } catch (error: any) {
    console.error('Get tax records error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single tax record
// @route   GET /api/taxes/:id
// @access  Private (Staff, Admin)
export const getTaxRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taxRecord = await TaxRecord.findById(req.params.id)
      .populate('taxpayerId', 'name email phone village')
      .populate('collectedBy', 'name');

    if (!taxRecord) {
      res.status(404).json({
        success: false,
        message: 'Tax record not found'
      });
      return;
    }

    if (req.user?.role === 'citizen') {
      const ownerId = typeof taxRecord.taxpayerId === 'object'
        ? (taxRecord.taxpayerId as any)._id?.toString()
        : taxRecord.taxpayerId.toString();

      if (ownerId !== req.user._id.toString()) {
        res.status(403).json({
          success: false,
          message: 'You are not authorized to view this tax record'
        });
        return;
      }
    }

    res.status(200).json({
      success: true,
      data: { taxRecord }
    });
  } catch (error: any) {
    console.error('Get tax record error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new tax record
// @route   POST /api/taxes
// @access  Private (Staff, Admin)
export const createTaxRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      taxpayerId,
      houseTaxAmount,
      healthTaxAmount,
      waterTaxAmount,
      amountPaid,
      taxYear,
      dueDate
    } = req.body;

    if (
      houseTaxAmount === undefined ||
      healthTaxAmount === undefined ||
      waterTaxAmount === undefined
    ) {
      res.status(400).json({
        success: false,
        message: 'House, health, and water tax amounts are required'
      });
      return;
    }

    const totalTaxAmount = houseTaxAmount + healthTaxAmount + waterTaxAmount;

    // Verify taxpayer exists
    const taxpayer = await User.findById(taxpayerId);
    if (!taxpayer) {
      res.status(404).json({
        success: false,
        message: 'Taxpayer not found'
      });
      return;
    }

    // Check if tax record already exists for this taxpayer and year
    const existingRecord = await TaxRecord.findOne({
      taxpayerId,
      taxYear
    });

    if (existingRecord) {
      res.status(400).json({
        success: false,
        message: `Tax record already exists for ${taxpayer.name} for year ${taxYear}`
      });
      return;
    }

    // Create tax record
    const taxRecord = await TaxRecord.create({
      taxpayerId,
      taxpayerName: taxpayer.name,
      houseTaxAmount,
      healthTaxAmount,
      waterTaxAmount,
      taxAmount: totalTaxAmount,
      amountPaid: amountPaid ?? 0,
      taxYear,
      dueDate: new Date(dueDate)
    });

    res.status(201).json({
      success: true,
      message: 'Tax record created successfully',
      data: { taxRecord }
    });
  } catch (error: any) {
    console.error('Create tax record error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update tax record
// @route   PUT /api/taxes/:id
// @access  Private (Staff, Admin)
export const updateTaxRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      houseTaxAmount,
      healthTaxAmount,
      waterTaxAmount,
      taxAmount,
      dueDate,
      remarks,
      amountPaid,
      paymentMethod,
      transactionId
    } = req.body;

    const existingRecord = await TaxRecord.findById(req.params.id);
    if (!existingRecord) {
      res.status(404).json({
        success: false,
        message: 'Tax record not found'
      });
      return;
    }

    const updateData: any = {};

    if (houseTaxAmount !== undefined) updateData.houseTaxAmount = houseTaxAmount;
    if (healthTaxAmount !== undefined) updateData.healthTaxAmount = healthTaxAmount;
    if (waterTaxAmount !== undefined) updateData.waterTaxAmount = waterTaxAmount;
    if (taxAmount !== undefined) updateData.taxAmount = taxAmount;
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
    if (remarks !== undefined) updateData.remarks = remarks;
    if (amountPaid !== undefined) updateData.amountPaid = amountPaid;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (transactionId !== undefined) updateData.transactionId = transactionId;

    if (
      houseTaxAmount !== undefined ||
      healthTaxAmount !== undefined ||
      waterTaxAmount !== undefined
    ) {
      const newHouse = houseTaxAmount !== undefined ? houseTaxAmount : existingRecord.houseTaxAmount;
      const newHealth = healthTaxAmount !== undefined ? healthTaxAmount : existingRecord.healthTaxAmount;
      const newWater = waterTaxAmount !== undefined ? waterTaxAmount : existingRecord.waterTaxAmount;
      updateData.taxAmount = newHouse + newHealth + newWater;
    }

    // If amountPaid is being updated, also update paymentDate and collectedBy
    if (amountPaid !== undefined && amountPaid > 0) {
      updateData.paymentDate = new Date();
      updateData.collectedBy = req.user._id;
    }

    const taxRecord = await TaxRecord.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('taxpayerId', 'name email phone village')
     .populate('collectedBy', 'name');

    if (!taxRecord) {
      res.status(404).json({
        success: false,
        message: 'Tax record not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Tax record updated successfully',
      data: { taxRecord }
    });
  } catch (error: any) {
    console.error('Update tax record error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete tax record
// @route   DELETE /api/taxes/:id
// @access  Private (Admin)
export const deleteTaxRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const taxRecord = await TaxRecord.findById(req.params.id);

    if (!taxRecord) {
      res.status(404).json({
        success: false,
        message: 'Tax record not found'
      });
      return;
    }

    await TaxRecord.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Tax record deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete tax record error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's own tax records
// @route   GET /api/taxes/my-records
// @access  Private (Citizen)
export const getMyTaxRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    const query = { taxpayerId: req.user._id };

    // Filter by tax year if specified
    if (req.query.taxYear) {
      query.taxYear = parseInt(req.query.taxYear as string);
    }

    // Filter by status if specified
    if (req.query.status) {
      query.status = req.query.status;
    }

    const taxRecords = await TaxRecord.find(query)
      .sort({ dueDate: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await TaxRecord.countDocuments(query);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      data: {
        taxRecords,
        pagination
      }
    });
  } catch (error: any) {
    console.error('Get my tax records error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Record payment for tax
// @route   POST /api/taxes/:id/payment
// @access  Private (Citizen)
export const recordPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log('recordPayment function called');
  try {
    const {
      amountPaid,
      paymentMethod,
      transactionId
    } = req.body;

    console.log('Payment request:', {
      taxId: req.params.id,
      userId: req.user?._id,
      userRole: req.user?.role,
      amountPaid,
      paymentMethod
    });

    let taxRecord = await TaxRecord.findOne({
      _id: req.params.id,
      taxpayerId: req.user._id
    });

    console.log('Tax record found:', !!taxRecord);

    if (!taxRecord) {
      // Try with string comparison if ObjectId comparison failed
      const taxRecordAlt = await TaxRecord.findOne({
        _id: req.params.id,
        taxpayerId: req.user._id.toString()
      });
      console.log('Tax record found with string comparison:', !!taxRecordAlt);
      if (taxRecordAlt) {
        // Update the record to use ObjectId for consistency
        taxRecordAlt.taxpayerId = req.user._id;
        await taxRecordAlt.save();
        taxRecord = taxRecordAlt;
      }
    }

    if (!taxRecord) {
      res.status(404).json({
        success: false,
        message: 'Tax record not found for this user'
      });
      return;
    }

    // Check if payment amount is valid
    if (amountPaid <= 0 || amountPaid > taxRecord.outstandingAmount) {
      res.status(400).json({
        success: false,
        message: `Invalid payment amount. Outstanding amount is ₹${taxRecord.outstandingAmount}`
      });
      return;
    }

    // Update payment details
    taxRecord.amountPaid += amountPaid;
    taxRecord.paymentDate = new Date();
    taxRecord.paymentMethod = paymentMethod;
    if (transactionId) {
      taxRecord.transactionId = transactionId;
    }

    // Status will be auto-updated by pre-save middleware
    await taxRecord.save();

    res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
      data: { taxRecord }
    });
  } catch (error: any) {
    console.error('Record payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get tax statistics
// @route   GET /api/taxes/stats
// @access  Private (Staff, Admin)
export const getTaxStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentYear = new Date().getFullYear();

    // Get stats for current year
    const currentYearStats = await TaxRecord.getTotalCollection(currentYear);

    // Get overall stats
    const overallStats = await TaxRecord.aggregate([
      {
        $group: {
          _id: null,
          totalTax: { $sum: '$taxAmount' },
          totalPaid: { $sum: '$amountPaid' },
          totalOutstanding: { $sum: { $subtract: ['$taxAmount', '$amountPaid'] } }
        }
      }
    ]);

    // Get status breakdown
    const statusStats = await TaxRecord.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$taxAmount' },
          paidAmount: { $sum: '$amountPaid' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        currentYear: currentYearStats[0] || { totalTax: 0, totalPaid: 0, totalOutstanding: 0 },
        overall: overallStats[0] || { totalTax: 0, totalPaid: 0, totalOutstanding: 0 },
        statusBreakdown: statusStats
      }
    });
  } catch (error: any) {
    console.error('Get tax stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};