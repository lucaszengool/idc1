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
const models_1 = require("./models");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
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
app.get('/health', async (req, res) => {
    let dbStatus = 'unknown';
    try {
        await database_1.default.authenticate();
        dbStatus = 'connected';
    }
    catch (error) {
        dbStatus = 'disconnected';
    }
    res.json({
        success: true,
        message: 'DCOPS Budget System API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: dbStatus
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
    // Start server immediately for health checks
    const server = app.listen(Number(PORT), HOST, () => {
        console.log(`🚀 Server is running on ${HOST}:${PORT}`);
        console.log(`📊 DCOPS Budget Management System API`);
        console.log(`🔗 Health check: http://${HOST}:${PORT}/health`);
        console.log(`📚 API base URL: http://${HOST}:${PORT}/api`);
    });
    // Initialize database in background
    initializeDatabase();
    return server;
};
const initializeDatabase = async () => {
    try {
        console.log('Initializing database...');
        // Test database connection with retry logic
        let retries = 5;
        while (retries > 0) {
            try {
                await database_1.default.authenticate();
                console.log('Database connection has been established successfully.');
                break;
            }
            catch (error) {
                retries--;
                console.log(`Database connection failed. Retries left: ${retries}`);
                if (retries === 0) {
                    console.error('Failed to connect to database after all retries:', error);
                    return; // Continue without database
                }
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            }
        }
        // Define model associations
        (0, models_1.defineAssociations)();
        console.log('Model associations defined.');
        // Sync database models (create tables if they don't exist)
        await database_1.default.sync({ force: false, alter: true });
        console.log('Database models synchronized.');
    }
    catch (error) {
        console.error('Database initialization error:', error);
        console.log('Server will continue running without database functionality.');
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