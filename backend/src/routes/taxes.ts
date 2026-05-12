import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getTaxRecords,
  getTaxRecord,
  createTaxRecord,
  updateTaxRecord,
  deleteTaxRecord,
  getMyTaxRecords,
  recordPayment,
  getTaxStats
} from '../controllers/taxController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Citizen routes
router.get('/my-records', authorize('citizen'), getMyTaxRecords);
router.post('/:id/payment', authorize('citizen'), recordPayment);

// Staff/Admin routes
router.get('/', authorize('staff', 'admin'), getTaxRecords);
router.get('/stats', authorize('staff', 'admin'), getTaxStats);
router.get('/:id', authorize('staff', 'admin', 'citizen'), getTaxRecord);
router.post('/', authorize('staff', 'admin'), createTaxRecord);
router.put('/:id', authorize('staff', 'admin'), updateTaxRecord);
router.delete('/:id', authorize('admin'), deleteTaxRecord);

export default router;