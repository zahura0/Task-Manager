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

// Auth routes
app.use('/api/auth', authRoutes)

// Board routes (protected)
app.use('/api/boards', boardRoutes)

// Task routes (protected)
app.use('/api/tasks', taskRoutes)

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: '✅ Backend is running', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 API Health: http://localhost:${PORT}/api/health`);
});

export default app;
