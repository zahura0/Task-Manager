import { useState } from 'react'
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
  dueDate: string
  assignee: string
  priority: 'low' | 'medium' | 'high'
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

function Dashboard({ userName = 'User', onLogout = () => {} }: DashboardProps) {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        {
          id: '1',
          title: 'Design homepage',
          description: 'Create mockups and wireframes',
          dueDate: '2025-11-05',
          assignee: 'John',
          priority: 'high'
        }
      ]
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      tasks: [
        {
          id: '2',
          title: 'Implement authentication',
          description: 'Add login and signup features',
          dueDate: '2025-11-03',
          assignee: 'Sarah',
          priority: 'high'
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [
        {
          id: '3',
          title: 'Setup project structure',
          description: 'Initialize React and TypeScript',
          dueDate: '2025-10-28',
          assignee: 'Mike',
          priority: 'medium'
        }
      ]
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<'todo' | 'inprogress' | 'done' | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)
  const [taskToMove, setTaskToMove] = useState<{ taskId: string; fromColumnId: string } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ taskId: string; taskTitle: string; columnId: string } | null>(null)

  const handleAddTask = (columnId: 'todo' | 'inprogress' | 'done') => {
    setSelectedColumn(columnId)
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      // Update existing task
      setColumns(columns.map(col => ({
        ...col,
        tasks: col.tasks.map(t => t.id === editingTask.id ? task : t)
      })))
    } else {
      // Add new task
      if (!selectedColumn) return
      const newTask = { ...task, id: Date.now().toString() }
      setColumns(columns.map(col =>
        col.id === selectedColumn
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      ))
    }
    setIsModalOpen(false)
  }

  const handleDeleteTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
        : col
    ))
  }

  const handleDeleteTaskClick = (taskId: string, taskTitle: string, columnId: string) => {
    setDeleteConfirm({ taskId, taskTitle, columnId })
  }

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      handleDeleteTask(deleteConfirm.columnId, deleteConfirm.taskId)
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

  const handleConfirmMove = (toColumnId: string) => {
    if (taskToMove) {
      handleMoveTask(taskToMove.taskId, taskToMove.fromColumnId, toColumnId)
      setIsMoveModalOpen(false)
      setTaskToMove(null)
    }
  }

  const handleMoveTask = (taskId: string, fromColumnId: string, toColumnId: string) => {
    let taskToMove: Task | null = null

    // Find the task
    const updatedColumns = columns.map(col => {
      if (col.id === fromColumnId) {
        const task = col.tasks.find(t => t.id === taskId)
        if (task) taskToMove = task
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
      }
      return col
    })

    // Add task to new column
    if (taskToMove) {
      const finalColumns = updatedColumns.map(col =>
        col.id === toColumnId
          ? { ...col, tasks: [...col.tasks, taskToMove as Task] }
          : col
      )
      setColumns(finalColumns)
    }
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
