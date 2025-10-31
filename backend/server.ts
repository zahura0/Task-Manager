import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db';
import authRoutes from './src/routes/authRoutes';
import taskRoutes from './src/routes/taskRoutes';
import boardRoutes from './src/routes/boardRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple CORS middleware for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    return res.sendStatus(200)
  }
  next()
})

// Connect to MongoDB
connectDB();

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

export default app;
