import type { Task } from './Dashboard'
import '../styles/TaskCard.css'

interface TaskCardProps {
  task: Task
  columnId: string
  onDelete: (taskId: string) => void
  onEdit: (task: Task) => void
  onMove: (taskId: string, toColumnId: string) => void
}

function TaskCard({ task, columnId, onDelete, onEdit, onMove }: TaskCardProps) {
  const priorityColors: Record<string, string> = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336'
  }

  const getColumnOptions = () => {
    const allColumns = ['todo', 'inprogress', 'done']
    return allColumns.filter(col => col !== columnId)
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('taskId', task.id)
    e.dataTransfer.setData('fromColumnId', columnId)
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
        <button className="btn-delete" onClick={() => onDelete(task.id)} title="Delete task">
          🗑️
        </button>
        {getColumnOptions().length > 0 && (
          <div className="move-dropdown">
            <button className="btn-move" title="Move task">
              ➡️
            </button>
            <div className="dropdown-menu">
              {getColumnOptions().map(columnId => {
                const columnNames: Record<string, string> = {
                  todo: 'To Do',
                  inprogress: 'In Progress',
                  done: 'Done'
                }
                return (
                  <button
                    key={columnId}
                    onClick={() => onMove(task.id, columnId)}
                    className="dropdown-item"
                  >
                    {columnNames[columnId]}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskCard
