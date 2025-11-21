import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createBudgetVersion,
  getAllBudgetVersions,
  getActiveBudgetVersion,
  setActiveBudgetVersion,
  deleteBudgetVersion,
} from '../controllers/budgetVersionController';
import { optionalAuth, checkDeletePermission } from '../middleware/authMiddleware';

const router = express.Router();

// Configure multer for file uploads (budget PPT/PDF/images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `budget-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for PPT files
  fileFilter: (req, file, cb) => {
    const allowedTypes = /ppt|pptx|pdf|jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /powerpoint|pdf|image/.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传 PPT, PDF 或图片文件！'));
    }
  },
});

// 创建预算版本 - 只有杨雯宇可以上传
router.post('/', optionalAuth, checkDeletePermission, upload.single('file'), createBudgetVersion);

// 获取所有预算版本
router.get('/', getAllBudgetVersions);

// 获取当前激活的预算版本
router.get('/active/:budgetYear', getActiveBudgetVersion);

// 设置激活版本 - 只有杨雯宇可以操作
router.put('/:id/activate', optionalAuth, checkDeletePermission, setActiveBudgetVersion);

// 删除预算版本 - 只有杨雯宇可以删除
router.delete('/:id', optionalAuth, checkDeletePermission, deleteBudgetVersion);

export default router;
