import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_env_secret'

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email and password are required' })
    }

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already in use' })

    const hashed = await bcrypt.hash(password, 10)

    const user = new User({ fullName, email, password: hashed /* role defaults to 'member' */ })
    await user.save()

    return res.status(201).json({
      message: 'User created',
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    })
  } catch (error) {
    console.error('Register error', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ message: 'Server configuration error' })
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5h' })

    return res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } })
  } catch (error) {
    console.error('Login error', error)
    return res.status(500).json({ message: 'Internal server error', error: (error as Error).message })
  }
}

export default { register, login }
