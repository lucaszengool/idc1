"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['http://localhost:3000'] // Add production domains here
        : ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3003', 'http://127.0.0.1:3000', 'http://127.0.0.1:3002', 'http://127.0.0.1:3003'],
    credentials: true,
    optionsSuccessStatus: 200,
};
exports.default = (0, cors_1.default)(corsOptions);
//# sourceMappingURL=cors.js.map