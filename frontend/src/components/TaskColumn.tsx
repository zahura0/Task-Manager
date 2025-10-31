import type { Column, Task } from './Dashboard'
import TaskCard from './TaskCard'
import '../styles/TaskColumn.css'

interface TaskColumnProps {
  column: Column
  onAddTask: () => void
  onDeleteTask: (taskId: string) => void
  onEditTask: (task: Task) => void
  onMoveTask: (taskId: string, toColumnId: string) => void
  onMoveClick?: (taskId: string, fromColumnId: string) => void
  onDeleteClick?: (taskId: string, taskTitle: string, columnId: string) => void
}

function TaskColumn({
  column,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onMoveTask,
  onMoveClick,
  onDeleteClick
}: TaskColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    const fromColumnId = e.dataTransfer.getData('fromColumnId')
    if (fromColumnId !== column.id) {
      onMoveTask(taskId, column.id)
    }
  }

  return (
    <div className="task-column">
      <div className="column-header">
        <h2 className="column-title">{column.title}</h2>
        <span className="task-count">{column.tasks.length}</span>
      </div>

      <div
        className="tasks-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {column.tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={column.id}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
            onMoveClick={onMoveClick}
            onDeleteClick={onDeleteClick ? (taskId, taskTitle) => onDeleteClick(taskId, taskTitle, column.id) : undefined}
          />
        ))}
        {column.tasks.length === 0 && (
          <div className="empty-state">
            <p>No tasks yet</p>
            <p className="empty-hint">Drag tasks here or create new ones</p>
          </div>
        )}
      </div>

      <button className="btn-add-task" onClick={onAddTask}>
        ➕ Add Task
      </button>
    </div>
  )
}

export default TaskColumn
