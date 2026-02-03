"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const executionController_1 = require("../controllers/executionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploads_1 = require("../config/uploads");
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, (0, uploads_1.ensureUploadsDir)());
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `voucher-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // 支持图片、PDF、Word、Excel格式
        const allowedExtensions = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
        const allowedMimeTypes = /jpeg|jpg|png|pdf|msword|officedocument|excel|spreadsheet/;
        const extname = allowedExtensions.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedMimeTypes.test(file.mimetype);
        if (mimetype || extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image (png/jpg), document (pdf/doc/docx), and spreadsheet (xls/xlsx) formats allowed!'));
        }
    },
});
router.post('/', upload.single('voucher'), executionController_1.createExecution);
router.get('/', executionController_1.getExecutions);
router.get('/project/:projectId', executionController_1.getExecutionsByProject);
router.put('/:id', executionController_1.updateExecution);
router.delete('/:id', authMiddleware_1.optionalAuth, authMiddleware_1.checkDeletePermission, executionController_1.deleteExecution);
exports.default = router;
//# sourceMappingURL=executions.js.map