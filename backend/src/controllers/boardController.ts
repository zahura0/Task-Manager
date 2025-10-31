import { Request, Response } from 'express'
import Board from '../models/Board'
import Task from '../models/Task'
import mongoose from 'mongoose'

export const createBoard = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body
    const userId = req.userId

    if (!name) {
      return res.status(400).json({ message: 'Board name is required' })
    }

    const board = new Board({
      name,
      description: description || '',
      creator: new mongoose.Types.ObjectId(userId),
      members: [new mongoose.Types.ObjectId(userId)] // Creator is automatically a member
    })

    await board.save()

    return res.status(201).json({
      message: 'Board created successfully',
      board
    })
  } catch (error) {
    console.error('Create board error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getMyBoards = async (req: Request, res: Response) => {
  try {
    const userId = req.userId

    // Get all boards where user is a member
    const boards = await Board.find({
      members: new mongoose.Types.ObjectId(userId)
    })
      .populate('creator', 'fullName email')
      .populate('members', 'fullName email')
      .sort({ createdAt: -1 })

    return res.json({
      message: 'Boards retrieved successfully',
      boards
    })
  } catch (error) {
    console.error('Get boards error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const addMemberToBoard = async (req: Request, res: Response) => {
  try {
    const { boardId, memberEmail } = req.body
    const userId = req.userId

    // Find board and verify user is creator or member
    const board = await Board.findById(boardId)
    if (!board) {
      return res.status(404).json({ message: 'Board not found' })
    }

    // Check if user has permission to add members (creator or admin)
    if (board.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Only board creator can add members' })
    }

    // Find user by email
    const User = require('../models/User').default
    const userToAdd = await User.findOne({ email: memberEmail })
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if already a member
    if (board.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User is already a member' })
    }

    // Add member
    board.members.push(userToAdd._id)
    await board.save()

    return res.json({
      message: 'Member added successfully',
      board
    })
  } catch (error) {
    console.error('Add member error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getBoardTasks = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params
    const userId = req.userId

    // Verify board exists and user is a member
    const board = await Board.findById(boardId)
    if (!board) {
      return res.status(404).json({ message: 'Board not found' })
    }

    if (!board.members.includes(new mongoose.Types.ObjectId(userId))) {
      return res.status(403).json({ message: 'You are not a member of this board' })
    }

    // Get all tasks for this board with user info
    const tasks = await Task.find({ boardId: new mongoose.Types.ObjectId(boardId) })
      .populate('userId', 'fullName email _id')
      .sort({ createdAt: -1 })

    // Add a field to indicate if current user is the task owner
    const tasksWithOwnerInfo = tasks.map((task: any) => ({
      ...task.toObject(),
      isOwner: task.userId._id.toString() === userId
    }))

    return res.json({
      message: 'Tasks retrieved successfully',
      tasks: tasksWithOwnerInfo
    })
  } catch (error) {
    console.error('Get board tasks error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export default { createBoard, getMyBoards, addMemberToBoard, getBoardTasks }
