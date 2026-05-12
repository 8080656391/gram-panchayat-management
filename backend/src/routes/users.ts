import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/userController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.get('/stats', authorize('admin'), getUserStats);

// Routes accessible by staff and admin
router.get('/', authorize('staff', 'admin'), getUsers);

// Create user (admin/staff)
import { createUser } from '../controllers/userController.js';
router.post('/', authorize('staff', 'admin'), createUser);

router.get('/:id', authorize('staff', 'admin'), getUser);
router.put('/:id', authorize('staff', 'admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;