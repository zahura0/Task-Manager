import { Router } from 'express'
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController'
import authMiddleware from '../middleware/auth'

const router = Router()

// All task routes require authentication
router.use(authMiddleware)

// Create a new task
router.post('/', createTask)

// Get all tasks for logged-in user (with optional filters: status, priority)
router.get('/', getTasks)

// Update a task
router.put('/:id', updateTask)

// Delete a task
router.delete('/:id', deleteTask)

export default router
