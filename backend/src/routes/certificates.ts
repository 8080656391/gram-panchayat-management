import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect, authorize } from '../middleware/auth.js';
import {
  getCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  uploadDocument,
  getMyCertificates,
  partialReviewCertificate,
  adminApproveCertificate,
  downloadCertificate,
  downloadDocument
} from '../controllers/certificateController.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadDir = path.resolve(__dirname, '../../uploads/certificates');
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
    // Allow images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
});

// All routes require authentication
router.use(protect);

// Citizen routes
router.get('/my-certificates', getMyCertificates);
router.get('/:id/download', downloadCertificate); // Must come before /:id route
router.post('/', authorize('citizen'), upload.any(), createCertificate);

// Staff/Admin routes
router.get('/', authorize('staff', 'admin'), getCertificates);
router.get('/:id/documents/:docType', authorize('staff', 'admin'), downloadDocument);
router.get('/:id', authorize('staff', 'admin'), getCertificate);
router.put('/:id', authorize('staff', 'admin'), updateCertificate);
router.put('/:id/partial-review', authorize('staff', 'admin'), partialReviewCertificate);
router.put('/:id/admin-approve', authorize('admin'), adminApproveCertificate);
router.delete('/:id', authorize('admin'), deleteCertificate);

// Document upload route
router.post('/:id/upload', authorize('staff', 'admin'), upload.single('document'), uploadDocument);

export default router;