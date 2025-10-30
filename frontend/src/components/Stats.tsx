import type { Column } from './Dashboard'

interface StatsProps {
  columns: Column[]
}

export default function Stats({ columns }: StatsProps) {
  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0)
  const todoTasks = columns.find(col => col.id === 'todo')?.tasks.length || 0
  const inProgressTasks = columns.find(col => col.id === 'inprogress')?.tasks.length || 0
  const doneTasks = columns.find(col => col.id === 'done')?.tasks.length || 0

  return (
    <div className="stats-bar">
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-value">{doneTasks}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card todo">
          <div className="stat-value">{todoTasks}</div>
          <div className="stat-label">To Do</div>
        </div>
        <div className="stat-card inprogress">
          <div className="stat-value">{inProgressTasks}</div>
          <div className="stat-label">In Progress</div>
        </div>
      </div>
    </div>
  )
}
