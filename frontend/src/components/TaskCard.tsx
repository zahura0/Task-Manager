import type { Task } from './Dashboard'
import '../styles/TaskCard.css'

interface TaskCardProps {
  task: Task
  columnId: string
  onEdit: (task: Task) => void
  onMoveClick?: (taskId: string, fromColumnId: string) => void
  onDeleteClick?: (taskId: string, taskTitle: string) => void
}

function TaskCard({ task, columnId, onEdit, onMoveClick, onDeleteClick }: TaskCardProps) {
  const priorityColors: Record<string, string> = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336'
  }

  const getColumnOptions = () => {
    const allColumns = ['todo', 'inprogress', 'done']
    return allColumns.filter(col => col !== columnId)
  }

  const handleMoveButtonClick = () => {
    if (onMoveClick) {
      onMoveClick(task.id, columnId)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('taskId', task.id)
    e.dataTransfer.setData('fromColumnId', columnId)
  }

  const handleDeleteClick = () => {
    if (onDeleteClick) {
      onDeleteClick(task.id, task.title)
    }
  }

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span
          className="priority-badge"
          style={{ backgroundColor: priorityColors[task.priority] }}
        >
          {task.priority}
        </span>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <div className="meta-item">
          <span className="meta-label">👤</span>
          <span>{task.assignee}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">📅</span>
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="task-actions">
        <button className="btn-edit" onClick={() => onEdit(task)} title="Edit task">
          ✏️
        </button>
        <button className="btn-delete" onClick={handleDeleteClick} title="Delete task">
          🗑️
        </button>
        {getColumnOptions().length > 0 && (
          <button
            className="btn-move"
            onClick={handleMoveButtonClick}
            title="Move task"
          >
            ➡️
          </button>
        )}
      </div>
    </div>
  )
}

export default TaskCard
