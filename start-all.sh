#!/bin/bash

echo "🚀 Starting DCOPS Budget System..."

# Start backend with PM2 (auto-restart enabled)
echo "📡 Starting backend with PM2..."
cd backend
pm2 start dist/index.js --name "dcops-backend" --watch --ignore-watch="node_modules" 2>/dev/null || pm2 restart dcops-backend

# Start frontend
echo "🌐 Starting frontend..."
cd ../frontend
PORT=3004 npm start &

echo "✅ System started!"
echo "🌐 Frontend: http://localhost:3004"
echo "📡 Backend: http://localhost:3001"
echo "📊 PM2 Monitor: pm2 monit"
echo ""
echo "To stop all services: pm2 stop all && pkill -f 'react-scripts start'"