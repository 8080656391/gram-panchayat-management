import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Certificate from '../models/Certificate.js';
import Grievance from '../models/Grievance.js';
import Tax from '../models/Tax.js';
import User from '../models/User.js';
import Scheme from '../models/Scheme.js';

const router = express.Router();

// @desc    Get dashboard stats for current user
// @route   GET /api/dashboard/stats
// @access  Private (All authenticated users)
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let stats = {
      certificates: { applied: 0, pending: 0, approved: 0, rejected: 0 },
      taxes: { paid: 0, pending: 0, total: 0 },
      grievances: { filed: 0, pending: 0, resolved: 0 },
      users: { citizens: 0, staff: 0, admins: 0 },
      schemes: { available: 0 }
    };

    if (userRole === 'citizen') {
      // Citizen: Get their own data
      const certificates = await Certificate.find({ applicantId: userId });
      stats.certificates = {
        applied: certificates.length,
        pending: certificates.filter(c => c.status === 'pending').length,
        approved: certificates.filter(c => c.status === 'approved').length,
        rejected: certificates.filter(c => c.status === 'rejected').length
      };

      const taxes = await Tax.find({ taxpayerId: userId });
      const paidTaxes = taxes.filter(t => t.paymentStatus === 'paid');
      const pendingTaxes = taxes.filter(t => t.paymentStatus === 'unpaid');
      stats.taxes = {
        paid: paidTaxes.reduce((sum, t) => sum + t.amountPaid, 0),
        pending: pendingTaxes.reduce((sum, t) => sum + t.taxAmount, 0),
        total: taxes.length
      };

      const grievances = await Grievance.find({ complainantId: userId });
      stats.grievances = {
        filed: grievances.length,
        pending: grievances.filter(g => g.status !== 'resolved').length,
        resolved: grievances.filter(g => g.status === 'resolved').length
      };
    } else if (userRole === 'staff' || userRole === 'admin') {
      // Staff/Admin: Get all data with optimized queries

      // Get certificate stats in one query
      const certStats = await Certificate.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const certificatesMap: { [key: string]: number } = {};
      certStats.forEach((stat: any) => {
        certificatesMap[stat._id] = stat.count;
      });

      stats.certificates = {
        applied: certStats.reduce((sum, stat) => sum + stat.count, 0),
        pending: certificatesMap['pending'] || 0,
        approved: certificatesMap['approved'] || 0,
        rejected: certificatesMap['rejected'] || 0,
        underReview: certificatesMap['under-review'] || 0
      };


      // Get tax stats with correct pending amount calculation
      const allTaxes = await Tax.find({});
      let paid = 0;
      let pending = 0;
      let totalAmount = 0;
      console.log('--- TAX RECORDS FOR DASHBOARD ---');
      allTaxes.forEach(tax => {
        console.log(`Tax: taxpayerId=${tax.taxpayerId}, taxAmount=${tax.taxAmount}, amountPaid=${tax.amountPaid}`);
        paid += tax.amountPaid;
        totalAmount += tax.taxAmount;
        if (tax.amountPaid < tax.taxAmount) {
          pending += (tax.taxAmount - tax.amountPaid);
        }
      });
      console.log(`Calculated paid: ${paid}, pending: ${pending}, total: ${allTaxes.length}, totalAmount: ${totalAmount}`);
      stats.taxes = {
        paid,
        pending,
        total: allTaxes.length,
        totalAmount
      };

      // Get user counts by role
      const userStats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      const usersMap: { [key: string]: number } = {};
      userStats.forEach((stat: any) => {
        usersMap[stat._id] = stat.count;
      });

      stats.users = {
        citizens: usersMap['citizen'] || 0,
        staff: usersMap['staff'] || 0,
        admins: usersMap['admin'] || 0
      };

      // Get grievance stats
      const grievanceStats = await Grievance.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const grievancesMap: { [key: string]: number } = {};
      grievanceStats.forEach((stat: any) => {
        grievancesMap[stat._id] = stat.count;
      });

      const totalGrievances = grievanceStats.reduce((sum, stat) => sum + stat.count, 0);
      stats.grievances = {
        filed: totalGrievances,
        pending: totalGrievances - (grievancesMap['resolved'] || 0),
        resolved: grievancesMap['resolved'] || 0
      };
    }

    // Get available schemes (common for all roles)
    const schemes = await Scheme.find({ isActive: true });
    stats.schemes.available = schemes.length;

    res.status(200).json({
      success: true,
      data: stats,
      lastUpdated: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats'
    });
  }
});

export default router;