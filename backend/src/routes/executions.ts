import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createExecution,
  getExecutions,
  getExecutionsByProject,
  updateExecution,
  deleteExecution,
} from '../controllers/executionController';
import { optionalAuth, checkDeletePermission } from '../middleware/authMiddleware';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `voucher-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, .jpeg and .pdf format allowed!'));
    }
  },
});

router.post('/', upload.single('voucher'), createExecution);
router.get('/', getExecutions);
router.get('/project/:projectId', getExecutionsByProject);
router.put('/:id', updateExecution);
router.delete('/:id', optionalAuth, checkDeletePermission, deleteExecution);

export default router;