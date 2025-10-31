import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

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
