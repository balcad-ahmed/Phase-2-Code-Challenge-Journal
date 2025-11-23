import React, { useState } from 'react'
import JournalEntry from './JournalEntry'

const JournalList = ({ entries, onDelete, onUpdate, onToggleImportant, loading }) => {
  const [editingId, setEditingId] = useState(null)
  const [editFormData, setEditFormData] = useState(null)

  const handleEdit = (entry) => {
    setEditingId(entry.id)
    setEditFormData(entry)
  }

  const handleUpdate = async (entryData) => {
    await onUpdate(editingId, entryData)
    setEditingId(null)
    setEditFormData(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditFormData(null)
  }

  if (loading && entries.length === 0) {
    return <div className="loading-state">Loading your journal entries...</div>
  }

  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <p>No journal entries yet. Start writing your thoughts!</p>
      </div>
    )
  }

  return (
    <div className="journal-list">
      {editingId && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <JournalForm
              initialData={editFormData}
              onSubmit={handleUpdate}
              onCancel={handleCancelEdit}
            />
          </div>
        </div>
      )}
      
      {entries.map(entry => (
        <JournalEntry
          key={entry.id}
          entry={entry}
          onDelete={onDelete}
          onEdit={handleEdit}
          onToggleImportant={onToggleImportant}
        />
      ))}
    </div>
  )
}

export default JournalList