"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const budgetVersionController_1 = require("../controllers/budgetVersionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploads_1 = require("../config/uploads");
const router = express_1.default.Router();
// Configure multer for file uploads (budget PPT/PDF/images)
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, (0, uploads_1.ensureUploadsDir)());
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `budget-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for PPT files
    fileFilter: (req, file, cb) => {
        const allowedExtensions = /ppt|pptx|pdf|jpeg|jpg|png/;
        const extname = allowedExtensions.test(path_1.default.extname(file.originalname).toLowerCase());
        // MIME types: ppt/pptx = powerpoint/presentationml, pdf = pdf, images = image/jpeg etc.
        const allowedMimeTypes = /powerpoint|presentationml|pdf|image/;
        const mimetype = allowedMimeTypes.test(file.mimetype);
        // 只要扩展名或MIME类型其一匹配即可
        if (mimetype || extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('只允许上传 PPT, PDF 或图片文件！'));
        }
    },
});
// 创建预算版本 - 只有杨雯宇可以上传
router.post('/', authMiddleware_1.optionalAuth, authMiddleware_1.checkDeletePermission, upload.single('file'), budgetVersionController_1.createBudgetVersion);
// 获取所有预算版本
router.get('/', budgetVersionController_1.getAllBudgetVersions);
// 获取当前激活的预算版本
router.get('/active/:budgetYear', budgetVersionController_1.getActiveBudgetVersion);
// 设置激活版本 - 只有杨雯宇可以操作
router.put('/:id/activate', authMiddleware_1.optionalAuth, authMiddleware_1.checkDeletePermission, budgetVersionController_1.setActiveBudgetVersion);
// 删除预算版本 - 只有杨雯宇可以删除
router.delete('/:id', authMiddleware_1.optionalAuth, authMiddleware_1.checkDeletePermission, budgetVersionController_1.deleteBudgetVersion);
exports.default = router;
//# sourceMappingURL=budgetVersions.js.map