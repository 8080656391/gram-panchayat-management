import express from 'express';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import {
  getSchemes,
  getScheme,
  createScheme,
  updateScheme,
  deleteScheme,
  deleteAllSchemes,
  getSchemesByCategory
} from '../controllers/schemeController.js';

const router = express.Router();

// Public routes (optional auth for better UX)
router.get('/', optionalAuth, getSchemes);
router.get('/category/:category', optionalAuth, getSchemesByCategory);
router.get('/:id', optionalAuth, getScheme);

// Protected routes (Admin only for CRUD)
router.use(protect);
router.use(authorize('admin'));

router.post('/', createScheme);
router.delete('/', deleteAllSchemes);
router.put('/:id', updateScheme);
router.delete('/:id', deleteScheme);

export default router;