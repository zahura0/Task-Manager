import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'replace_this_with_env_secret'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.slice(7) // Remove 'Bearer ' prefix

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    req.userId = decoded.id
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export default authMiddleware
