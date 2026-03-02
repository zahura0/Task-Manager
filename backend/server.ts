import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db';
import authRoutes from './src/routes/authRoutes';
import taskRoutes from './src/routes/taskRoutes';
import boardRoutes from './src/routes/boardRoutes';

dotenv.config();

const app: Express = express();
const PORT = 5000;
const ALLOWED_ORIGINS = ['https://example.com'];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
      return res.sendStatus(403);
    }
    return res.sendStatus(200);
  }

  next();
});

// Connect to MongoDB on startup
connectDB().catch(err => console.error('Failed to connect to MongoDB:', err));

// Root route - API status
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '✅ Task Manager Backend API is working!',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date(),
    endpoints: {
      auth: '/api/auth',
      boards: '/api/boards',
      tasks: '/api/tasks',
      health: '/api/health'
    }
  });
});

// Auth routes
app.use('/api/auth', authRoutes)

// Board routes (protected)
app.use('/api/boards', boardRoutes)

// Task routes (protected)
app.use('/api/tasks', taskRoutes)

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    message: '✅ Task Manager Backend API is working!',
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 API Health: http://localhost:${PORT}/api/health`);
  });
}

// Export for Vercel serverless
export default app;
