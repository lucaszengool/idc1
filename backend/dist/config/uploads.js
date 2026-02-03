"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUploadsDir = exports.getUploadsDir = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Get the uploads directory - use absolute path
const getUploadsDir = () => {
    // If UPLOAD_DIR is set, use it (could be absolute or relative)
    if (process.env.UPLOAD_DIR) {
        const uploadDir = path_1.default.isAbsolute(process.env.UPLOAD_DIR)
            ? process.env.UPLOAD_DIR
            : path_1.default.resolve(process.cwd(), process.env.UPLOAD_DIR);
        return uploadDir;
    }
    // Default: uploads directory relative to the project root
    // In production, __dirname is in dist/, so go up one level
    const uploadsDir = path_1.default.resolve(__dirname, '../../uploads');
    return uploadsDir;
};
exports.getUploadsDir = getUploadsDir;
// Ensure the uploads directory exists
const ensureUploadsDir = () => {
    const uploadsDir = (0, exports.getUploadsDir)();
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        console.log(`📁 Created uploads directory: ${uploadsDir}`);
    }
    return uploadsDir;
};
exports.ensureUploadsDir = ensureUploadsDir;
exports.default = exports.getUploadsDir;
//# sourceMappingURL=uploads.js.map