import { useState, useEffect } from 'react'
import TaskColumn from './TaskColumn'
import AddTaskModal from './AddTaskModal'
import MoveTaskModal from './MoveTaskModal'
import ConfirmModal from './ConfirmModal'
import Sidebar from './Sidebar'
import Stats from './Stats'
import UserProfile from './UserProfile'
import logoImg from '../assets/logo.png'
import '../styles/Dashboard.css'

export interface Task {
  id: string
  title: string
  description: string
  dueDate?: string
  assignee?: string
  priority: 'low' | 'medium' | 'high'
  status?: 'todo' | 'inprogress' | 'done'
  _id?: string
}

export interface Column {
  id: 'todo' | 'inprogress' | 'done'
  title: string
  tasks: Task[]
}

interface DashboardProps {
  userName?: string
  onLogout?: () => void
}

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'

function Dashboard({ userName = 'User', onLogout = () => {} }: DashboardProps) {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'inprogress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<'todo' | 'inprogress' | 'done' | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)
  const [taskToMove, setTaskToMove] = useState<{ taskId: string; fromColumnId: string } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ taskId: string; taskTitle: string; columnId: string } | null>(null)

  // Get token from localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem('tm_token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  // Fetch tasks from database
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'GET',
        headers: getAuthHeader()
      })

      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      const data = await response.json()
      const tasks = data.tasks || []

      // Map MongoDB _id to id field for frontend compatibility
      const mappedTasks = tasks.map((t: any) => ({
        ...t,
        id: t._id || t.id
      }))

      // Group tasks by status
      const groupedColumns = [
        { id: 'todo' as const, title: 'To Do', tasks: mappedTasks.filter((t: any) => t.status === 'todo') },
        { id: 'inprogress' as const, title: 'In Progress', tasks: mappedTasks.filter((t: any) => t.status === 'in-progress') },
        { id: 'done' as const, title: 'Done', tasks: mappedTasks.filter((t: any) => t.status === 'done') }
      ]

      setColumns(groupedColumns)
    } catch (err) {
      console.error('Error fetching tasks:', err)
    }
  }

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAddTask = (columnId: 'todo' | 'inprogress' | 'done') => {
    setSelectedColumn(columnId)
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleSaveTask = async (task: Task) => {
    try {
      if (editingTask) {
        // Update existing task
        const response = await fetch(`${API_URL}/api/tasks/${editingTask._id || editingTask.id}`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify({
            title: task.title,
            description: task.description,
            priority: task.priority,
            assignee: task.assignee,
            dueDate: task.dueDate,
            status: selectedColumn
          })
        })

        if (!response.ok) {
          throw new Error('Failed to update task')
        }

        // Refresh tasks from DB
        await fetchTasks()
      } else {
        // Add new task
        if (!selectedColumn) return

        const response = await fetch(`${API_URL}/api/tasks`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({
            title: task.title,
            description: task.description,
            priority: task.priority,
            assignee: task.assignee,
            dueDate: task.dueDate,
            status: selectedColumn
          })
        })

        if (!response.ok) {
          throw new Error('Failed to create task')
        }

        // Refresh tasks from DB
        await fetchTasks()
      }

      setIsModalOpen(false)
    } catch (err) {
      console.error('Error saving task:', err)
      alert('Failed to save task')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      if (!taskId) {
        alert('Error: Task ID is missing')
        return
      }

      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      // Refresh tasks from DB
      await fetchTasks()
    } catch (err) {
      console.error('Error deleting task:', err)
      alert('Failed to delete task')
    }
  }

  const handleDeleteTaskClick = (taskId: string, taskTitle: string, columnId: string) => {
    setDeleteConfirm({ taskId, taskTitle, columnId })
  }

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      handleDeleteTask(deleteConfirm.taskId)
      setDeleteConfirm(null)
    }
  }

  const handleEditTask = (task: Task, columnId: string) => {
    setEditingTask(task)
    setSelectedColumn(columnId as 'todo' | 'inprogress' | 'done')
    setIsModalOpen(true)
  }

  const handleMoveTaskClick = (taskId: string, fromColumnId: string) => {
    setTaskToMove({ taskId, fromColumnId })
    setIsMoveModalOpen(true)
  }

  const handleConfirmMove = async (toColumnId: string) => {
    if (taskToMove) {
      try {
        // Find the task to update
        const task = columns
          .find(col => col.id === taskToMove.fromColumnId)
          ?.tasks.find(t => t.id === taskToMove.taskId || t._id === taskToMove.taskId)

        if (task) {
          const response = await fetch(`${API_URL}/api/tasks/${task._id || task.id}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify({
              title: task.title,
              description: task.description,
              priority: task.priority,
              status: toColumnId
            })
          })

          if (!response.ok) {
            throw new Error('Failed to move task')
          }

          // Refresh tasks from DB
          await fetchTasks()
        }

        setIsMoveModalOpen(false)
        setTaskToMove(null)
      } catch (err) {
        console.error('Error moving task:', err)
        alert('Failed to move task')
      }
    }
  }

  const handleMoveTask = (taskId: string, fromColumnId: string, toColumnId: string) => {
    // Unused but kept for API compatibility
    void taskId
    void fromColumnId
    void toColumnId
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-logo">
          <img src={logoImg} alt="Task Manager Logo" className="logo-image" />
        </div>
        <div className="header-left">
          <h1>📋 Task Dashboard</h1>
          <p className="subtitle">Organize your team's work like a pro</p>
        </div>
        <UserProfile userName={userName} onLogout={onLogout} />
      </header>

      <Stats columns={columns} />

      <div className="dashboard-wrapper">
        <Sidebar />

        <div className="dashboard-main">
          <div className="dashboard-board">
            {columns.map(column => (
              <TaskColumn
                key={column.id}
                column={column}
                onAddTask={() => handleAddTask(column.id)}
                onEditTask={(task: Task) => handleEditTask(task, column.id)}
                onMoveTask={(taskId: string, toColumnId: string) => handleMoveTask(taskId, column.id, toColumnId)}
                onMoveClick={handleMoveTaskClick}
                onDeleteClick={handleDeleteTaskClick}
              />
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AddTaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isMoveModalOpen && taskToMove && (
        <MoveTaskModal
          taskTitle={
            columns
              .find(col => col.id === taskToMove.fromColumnId)
              ?.tasks.find(t => t.id === taskToMove.taskId)?.title || ''
          }
          currentColumn={
            columns.find(col => col.id === taskToMove.fromColumnId)?.title || ''
          }
          columnOptions={
            columns
              .filter(col => col.id !== taskToMove.fromColumnId)
              .map(col => ({ id: col.id, name: col.title }))
          }
          onMove={handleConfirmMove}
          onClose={() => {
            setIsMoveModalOpen(false)
            setTaskToMove(null)
          }}
        />
      )}

      {deleteConfirm && (
        <ConfirmModal
          title="Delete Task"
          message={`Are you sure you want to delete "${deleteConfirm.taskTitle}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          isDangerous={true}
        />
      )}
    </div>
  )
}

export default Dashboard
