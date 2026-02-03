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
    // 支持图片、PDF、Word、Excel格式
    const allowedExtensions = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
    const allowedMimeTypes = /jpeg|jpg|png|pdf|msword|officedocument|excel|spreadsheet/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.test(file.mimetype);

    if (mimetype || extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image (png/jpg), document (pdf/doc/docx), and spreadsheet (xls/xlsx) formats allowed!'));
    }
  },
});

router.post('/', upload.single('voucher'), createExecution);
router.get('/', getExecutions);
router.get('/project/:projectId', getExecutionsByProject);
router.put('/:id', updateExecution);
router.delete('/:id', optionalAuth, checkDeletePermission, deleteExecution);

export default router;