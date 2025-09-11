"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const cors_1 = __importDefault(require("./middleware/cors"));
const errorHandler_1 = require("./middleware/errorHandler");
const routes_1 = __importDefault(require("./routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security middleware
app.use((0, helmet_1.default)());
// CORS middleware
app.use(cors_1.default);
// Logging middleware
app.use((0, morgan_1.default)('combined'));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Static file serving for uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Create uploads directory if it doesn't exist
const fs_1 = __importDefault(require("fs"));
const uploadsDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'DCOPS Budget System API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// API routes
app.use('/api', routes_1.default);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});
// Database connection and server startup
const startServer = async () => {
    try {
        // Test database connection
        await database_1.default.authenticate();
        console.log('Database connection has been established successfully.');
        // Sync database models (create tables if they don't exist)
        await database_1.default.sync({ alter: false }); // Set to true for development
        console.log('Database models synchronized.');
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📊 DCOPS Budget Management System API`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API base URL: http://localhost:${PORT}/api`);
        });
    }
    catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};
// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔄 Shutting down server...');
    try {
        await database_1.default.close();
        console.log('Database connection closed.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});
startServer();
//# sourceMappingURL=index.js.map