import express from 'express';
import path from 'path';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import sequelize from './config/database';
import corsMiddleware from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
import { defineAssociations } from './models';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Security middleware
app.use(helmet());

// CORS middleware
app.use(corsMiddleware);

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Health check endpoint
app.get('/health', async (req, res) => {
  let dbStatus = 'unknown';
  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
  } catch (error) {
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
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

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
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        break;
      } catch (error) {
        retries--;
        console.log(`Database connection failed. Retries left: ${retries}`);
        if (retries === 0) {
          console.error('Failed to connect to database after all retries:', error);
          return; // Continue without database
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      }
    }

    // Sync database models BEFORE defining associations to avoid conflicts
    console.log('Syncing database models...');
    await sequelize.sync({ force: true });
    console.log('Database models synchronized with force recreate.');

    // Define model associations after sync
    console.log('Defining model associations...');
    defineAssociations();
    console.log('Model associations defined successfully.');

  } catch (error) {
    console.error('Database initialization error:', error);
    console.log('Server will continue running without database functionality.');
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down server...');
  try {
    await sequelize.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();