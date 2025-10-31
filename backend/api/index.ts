import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/db';
import authRoutes from '../src/routes/authRoutes';
import taskRoutes from '../src/routes/taskRoutes';
import boardRoutes from '../src/routes/boardRoutes';

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    return res.sendStatus(200)
  }
  next()
})

// Connect to MongoDB (non-blocking, don't await here)
connectDB().catch(err => console.error('DB Connection Error:', err));

// Root route - API status with success message
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '✅ API Connected Successfully! Task Manager Backend is Ready',
    status: 'connected',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date(),
    endpoints: {
      auth: '/api/auth',
      boards: '/api/boards',
      tasks: '/api/tasks',
      health: '/api/health'
    }
  });
});

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    message: '✅ API Connected Successfully!',
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Board routes (protected)
app.use('/api/boards', boardRoutes);

// Task routes (protected)
app.use('/api/tasks', taskRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: '❌ Endpoint not found',
    path: req.path,
    method: req.method,
    availableEndpoints: {
      root: 'GET /',
      health: 'GET /api/health',
      auth: 'POST /api/auth/login, POST /api/auth/register',
      boards: 'GET /api/boards, POST /api/boards',
      tasks: 'GET /api/tasks, POST /api/tasks'
    }
  });
});

export default app;
