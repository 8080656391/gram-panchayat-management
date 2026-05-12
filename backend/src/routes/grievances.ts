import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, authorize } from '../middleware/auth.js';
import {
  getGrievances,
  getGrievance,
  createGrievance,
  updateGrievance,
  deleteGrievance,
  uploadAttachment,
  getMyGrievances,
  addFeedback
} from '../controllers/grievanceController.js';

const router = express.Router();

// Ensure upload directories exist
const uploadDir = path.resolve(process.cwd(), '../uploads/grievances');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
  },
  fileFilter: (req, file, cb) => {
    // Allow images, PDFs, and documents
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed'));
    }
  }
});

// All routes require authentication
router.use(protect);

// Citizen routes
router.get('/my-grievances', getMyGrievances);
router.post('/', authorize('citizen'), upload.array('attachments', 5), createGrievance);
router.post('/:id/feedback', authorize('citizen'), addFeedback);
router.put('/:id', authorize('citizen', 'staff', 'admin'), updateGrievance);

// Staff/Admin routes
router.get('/', authorize('staff', 'admin'), getGrievances);
router.get('/:id', authorize('staff', 'admin'), getGrievance);
router.delete('/:id', authorize('admin'), deleteGrievance);

// Attachment upload route
router.post('/:id/upload', authorize('staff', 'admin'), upload.single('attachment'), uploadAttachment);

export default router;