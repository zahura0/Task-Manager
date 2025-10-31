import '../styles/MoveTaskModal.css'

interface MoveTaskModalProps {
  taskTitle: string
  currentColumn: string
  columnOptions: { id: string; name: string }[]
  onMove: (toColumnId: string) => void
  onClose: () => void
}

function MoveTaskModal({
  taskTitle,
  currentColumn,
  columnOptions,
  onMove,
  onClose
}: MoveTaskModalProps) {
  const handleMove = (toColumnId: string) => {
    onMove(toColumnId)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content move-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Move Task</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="move-modal-body">
          <p className="task-info">
            <span className="info-label">Task:</span> 
            <span className="task-name">{taskTitle}</span>
          </p>
          <p className="current-location">
            <span className="info-label">Current Location:</span> 
            <span className="column-badge">{currentColumn}</span>
          </p>

          <div className="move-options">
            <p className="options-label">Select Destination:</p>
            <div className="options-container">
              {columnOptions.map(option => (
                <button
                  key={option.id}
                  className="move-option-btn"
                  onClick={() => handleMove(option.id)}
                >
                  <span className="arrow-icon">→</span>
                  <span className="option-name">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default MoveTaskModal
