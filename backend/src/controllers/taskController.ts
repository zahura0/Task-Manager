import { Request, Response } from 'express'
import Task from '../models/Task'

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority, assignee, dueDate } = req.body
    const userId = req.userId

    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const task = new Task({
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      assignee: assignee || '',
      dueDate: dueDate || null,
      userId
    })

    await task.save()

    return res.status(201).json({
      message: 'Task created successfully',
      task
    })
  } catch (error) {
    console.error('Create task error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const { status, priority } = req.query

    // Build filter object
    const filter: any = { userId }
    if (status) filter.status = status
    if (priority) filter.priority = priority

    const tasks = await Task.find(filter).sort({ createdAt: -1 })

    return res.json({
      message: 'Tasks retrieved successfully',
      tasks
    })
  } catch (error) {
    console.error('Get tasks error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, description, status, priority, assignee, dueDate } = req.body
    const userId = req.userId

    // Find task and verify ownership
    const task = await Task.findById(id)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this task' })
    }

    // Update fields if provided
    if (title !== undefined) task.title = title
    if (description !== undefined) task.description = description
    if (status !== undefined) task.status = status
    if (priority !== undefined) task.priority = priority
    if (assignee !== undefined) task.assignee = assignee
    if (dueDate !== undefined) task.dueDate = dueDate

    await task.save()

    return res.json({
      message: 'Task updated successfully',
      task
    })
  } catch (error) {
    console.error('Update task error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.userId

    // Find task and verify ownership
    const task = await Task.findById(id)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this task' })
    }

    await Task.deleteOne({ _id: id })

    return res.json({
      message: 'Task deleted successfully'
    })
  } catch (error) {
    console.error('Delete task error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export default { createTask, getTasks, updateTask, deleteTask }
