import React from 'react'

const JournalEntry = ({ entry, onDelete, onEdit, onToggleImportant }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      onDelete(entry.id)
    }
  }

  return (
    <div className={`journal-entry ${entry.important ? 'important' : ''}`}>
      <div className="entry-header">
        <h3 className="entry-title">{entry.title}</h3>
        <div className="entry-actions">
          <button
            onClick={() => onToggleImportant(entry.id)}
            className={`btn btn-icon ${entry.important ? 'important' : ''}`}
            title={entry.important ? 'Remove from important' : 'Mark as important'}
          >
            ⭐
          </button>
          <button
            onClick={() => onEdit(entry)}
            className="btn btn-icon"
            title="Edit entry"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-icon"
            title="Delete entry"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="entry-body">
        <p>{entry.body}</p>
      </div>
      
      <div className="entry-footer">
        <span className="entry-date">
          Entry #{entry.id}
        </span>
        {entry.important && (
          <span className="important-badge">Important</span>
        )}
      </div>
    </div>
  )
}

export default JournalEntry