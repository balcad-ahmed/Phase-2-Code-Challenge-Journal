import React, { useState, useEffect } from 'react'
import JournalForm from './components/JournalForm'
import JournalList from './components/JournalList'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

const API_URL = 'https://jsonplaceholder.typicode.com/posts'

function App() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [filterImportant, setFilterImportant] = useState(false)

  // Fetch entries on component mount
  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      // Add important property to each entry
      const entriesWithImportant = data.slice(0, 10).map(entry => ({
        ...entry,
        important: false
      }))
      setEntries(entriesWithImportant)
    } catch (error) {
      console.error('Error fetching entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const createEntry = async (entryData) => {
    setLoading(true)
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: entryData.title,
          body: entryData.body,
          userId: 1,
        }),
      })
      const newEntry = await response.json()
      
      // Add to local state with important property
      const entryWithImportant = {
        ...newEntry,
        id: Date.now(), // Temporary ID since API returns same ID
        important: false
      }
      
      setEntries(prev => [entryWithImportant, ...prev])
      setShowForm(false)
    } catch (error) {
      console.error('Error creating entry:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteEntry = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })
      // Update UI even if API call fails (since JSONPlaceholder doesn't persist)
      setEntries(prev => prev.filter(entry => entry.id !== id))
    } catch (error) {
      console.error('Error deleting entry:', error)
      // Still update UI for better UX
      setEntries(prev => prev.filter(entry => entry.id !== id))
    }
  }

  const updateEntry = async (id, entryData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title: entryData.title,
          body: entryData.body,
          userId: 1,
        }),
      })
      const updatedEntry = await response.json()
      
      setEntries(prev => prev.map(entry => 
        entry.id === id 
          ? { ...updatedEntry, important: entry.important }
          : entry
      ))
    } catch (error) {
      console.error('Error updating entry:', error)
    }
  }

  const toggleImportant = (id) => {
    setEntries(prev => prev.map(entry =>
      entry.id === id ? { ...entry, important: !entry.important } : entry
    ))
  }

  const filteredEntries = filterImportant 
    ? entries.filter(entry => entry.important)
    : entries

  return (
    <div className="app">
      <header className="app-header">
        <h1>📖 My Journal</h1>
        <p>Capture your thoughts and reflections</p>
      </header>

      <div className="app-controls">
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ New Entry'}
        </button>
        
        <button 
          className={`btn btn-secondary ${filterImportant ? 'active' : ''}`}
          onClick={() => setFilterImportant(!filterImportant)}
        >
          {filterImportant ? 'Show All' : 'Important Only'}
        </button>
      </div>

      {showForm && (
        <JournalForm 
          onSubmit={createEntry}
          onCancel={() => setShowForm(false)}
          loading={loading}
        />
      )}

      {loading && <LoadingSpinner />}

      <JournalList 
        entries={filteredEntries}
        onDelete={deleteEntry}
        onUpdate={updateEntry}
        onToggleImportant={toggleImportant}
        loading={loading}
      />
    </div>
  )
}

export default App