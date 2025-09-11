# Railway Deployment Setup Guide

## Service URLs
- **Frontend**: `https://idc1-production.up.railway.app` (Port: 3000)
- **Backend**: `https://faithful-laughter-production.up.railway.app` (Port: 3001)
- **PostgreSQL**: `shinkansen.proxy.rlwy.net:57658` (Internal: `postgres.railway.internal`)

## Environment Variables to Set in Railway

### Backend Service (`faithful-laughter-production`)
Set these environment variables in Railway dashboard:

```env
NODE_ENV=production
PORT=3001
HOST=0.0.0.0
CORS_ORIGIN=https://idc1-production.up.railway.app
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
```

**Note**: `DATABASE_URL` should be automatically set by Railway when you connect the PostgreSQL service.

### Frontend Service (`idc1-production`)
Environment variables are already configured in `.env.production` file:

```env
REACT_APP_API_BASE_URL=https://faithful-laughter-production.up.railway.app
GENERATE_SOURCEMAP=false
SKIP_PREFLIGHT_CHECK=true
```

### PostgreSQL Service
- Should be automatically connected to the backend service
- Railway will provide `DATABASE_URL` automatically

## Deployment Order
1. ✅ Deploy PostgreSQL service first
2. ✅ Deploy Backend service (connect to PostgreSQL)
3. ✅ Deploy Frontend service

## Troubleshooting
- If CORS errors occur, make sure `CORS_ORIGIN` is set correctly in backend
- If database connection fails, check that PostgreSQL service is connected to backend
- If frontend can't reach backend, verify the `REACT_APP_API_BASE_URL` in frontend build

## Test Your Deployment
After both services are deployed:
1. Visit: `https://faithful-laughter-production.up.railway.app/health` (Backend health check)
2. Visit: `https://idc1-production.up.railway.app` (Frontend application)
3. Try the delete functionality - it should now work!