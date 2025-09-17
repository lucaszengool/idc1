import cors from 'cors';

const getAllowedOrigins = () => {
  const baseOrigins = ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004',
                       'http://127.0.0.1:3000', 'http://127.0.0.1:3002', 'http://127.0.0.1:3003', 'http://127.0.0.1:3004'];
  
  if (process.env.NODE_ENV === 'production') {
    // Add Railway and production domains
    const productionOrigins = [
      'https://*.railway.app',
      'https://*.up.railway.app'
    ];
    
    // Add custom domain if specified
    if (process.env.CORS_ORIGIN) {
      const customOrigins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
      productionOrigins.push(...customOrigins);
    }
    
    return [...baseOrigins, ...productionOrigins];
  }
  
  return baseOrigins;
};

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = getAllowedOrigins();
    
    // Check for exact matches
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check for Railway domains (wildcard matching)
    if (process.env.NODE_ENV === 'production' && 
        (origin.includes('.railway.app') || origin.includes('.up.railway.app'))) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default cors(corsOptions);