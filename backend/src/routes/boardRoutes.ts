import { Router } from 'express'
import { createBoard, getMyBoards, addMemberToBoard, getBoardTasks } from '../controllers/boardController'
import authMiddleware from '../middleware/auth'

const router = Router()

// All board routes require authentication
router.use(authMiddleware)

// Create a new board
router.post('/', createBoard)

// Get all boards for logged-in user
router.get('/', getMyBoards)

// Add member to board
router.post('/:boardId/members', addMemberToBoard)

// Get all tasks for a board
router.get('/:boardId/tasks', getBoardTasks)

export default router
