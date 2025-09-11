"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.errors.map((err) => ({
                field: err.path,
                message: err.message,
            })),
        });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            message: 'Resource already exists',
            errors: error.errors.map((err) => ({
                field: err.path,
                message: err.message,
            })),
        });
    }
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            success: false,
            message: 'File too large. Maximum size is 5MB.',
        });
    }
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map