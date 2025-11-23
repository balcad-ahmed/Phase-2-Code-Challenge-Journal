import React, { useState, useEffect } from 'react'
import JournalForm from './components/JournalForm'
import JournalList from './components/JournalList'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

const API_URL = 'https://jsonplaceholder.typicode.com/posts'

// Pre-populated realistic journal entries
const PRE_POPULATED_ENTRIES = [
  {
    id: 1,
    title: "New Beginnings",
    body: "Woke up feeling refreshed today. The rain last night washed everything clean, and the air smells fresh. Been thinking about starting a morning routine - maybe some meditation and journaling. Need to find a better work-life balance. The constant notifications and emails are draining my energy. Starting with 10 minutes of quiet time before checking my phone.\n\nFeeling hopeful about the changes I want to make. Small steps forward are still progress.",
    important: true,
    userId: 1
  },
  {
    id: 2,
    title: "Overwhelmed at Work",
    body: "Another day of back-to-back meetings. The project deadline is looming and I feel like I'm falling behind. Had a difficult conversation with my manager about resource constraints. Need to prioritize better and learn to say no to additional tasks.\n\nTaking a walk during lunch helped clear my head. Remember: progress over perfection. One task at a time.",
    important: false,
    userId: 1
  },
  {
    id: 3,
    title: "Learning to Cook",
    body: "Tried making pad thai from scratch tonight. It was... interesting. The noodles stuck together and I definitely used too much fish sauce. But it was edible! Cooking is harder than it looks on those cooking shows.\n\nThere's something satisfying about creating a meal, even if it's not perfect. Will try again next week with less fish sauce.",
    important: false,
    userId: 1
  },
  {
    id: 4,
    title: "Coffee with Sarah",
    body: "Met Sarah for coffee after months of trying to coordinate schedules. It's amazing how we can pick up right where we left off. She's thinking about changing careers and we talked about taking risks and following passions.\n\nGood friends are like anchors in this chaotic world. Need to make more time for these connections.",
    important: true,
    userId: 1
  },
  {
    id: 5,
    title: "Hiking at Blue Ridge",
    body: "Hiked the Blue Ridge trail today. The view from the summit was breathtaking - layers of mountains fading into the horizon. Met an older couple who've been hiking there for 30 years. They said the trail changes every season but the peace remains the same.\n\nNature has a way of putting things in perspective. All my worries seemed smaller from up there.",
    important: true,
    userId: 1
  },
  {
    id: 6,
    title: "Project Didn't Go as Planned",
    body: "The client wasn't happy with our proposal. All that work and they want us to start over. Feeling frustrated but trying to see it as a learning opportunity. Maybe we weren't listening closely enough to what they really needed.\n\nFailure isn't the opposite of success - it's part of it. Back to the drawing board tomorrow.",
    important: false,
    userId: 1
  },
  {
    id: 7,
    title: "Finally Organized My Desk",
    body: "Cleared out the mountain of papers that had been accumulating for months. Found three pens that actually work and that important document I thought I'd lost. Such a small thing, but it feels like a weight has been lifted.\n\nSometimes the smallest tasks make the biggest difference in how I feel about my space and myself.",
    important: false,
    userId: 1
  },
  {
    id: 8,
    title: "Writing Struggle",
    body: "Stared at a blank page for two hours today. The words just wouldn't come. Tried changing locations, making tea, even cleaning (desperate times). Nothing worked.\n\nMaybe some days are just for collecting experiences rather than creating from them. Tomorrow is another day.",
    important: false,
    userId: 1
  },
  {
    id: 9,
    title: "Rainy Sunday",
    body: "Spent the day reading with the sound of rain against the window. Made soup from scratch and actually followed a recipe for once. The house smelled amazing all afternoon.\n\nThese quiet, simple days are just as important as the exciting ones. Learning to appreciate the stillness.",
    important: true,
    userId: 1
  },
  {
    id: 10,
    title: "Three Good Things",
    body: "Today I'm grateful for:\n1. The way the sunlight came through the window this morning\n2. That random text from an old friend checking in\n3. Finding my favorite tea at the store\n\nIt's easy to focus on what's going wrong, but there's always something to appreciate if I look for it.",
    important: false,
    userId: 1
  }
]

function App() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true) // Start with loading true
  const [showForm, setShowForm] = useState(false)
  const [filterImportant, setFilterImportant] = useState(false)
  const [dataSource, setDataSource] = useState('demo') // 'demo' or 'api'

  // Use pre-populated entries immediately on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setEntries(PRE_POPULATED_ENTRIES)
      setLoading(false)
      setDataSource('demo')
    }, 1000) // Small delay to show loading state
    
    return () => clearTimeout(timer)
  }, [])

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      
      // Use API data but transform it to match our structure
      const apiEntries = data.slice(0, 10).map(entry => ({
        ...entry,
        important: Math.random() > 0.7 // Randomly mark some as important
      }))
      
      setEntries(apiEntries)
      setDataSource('api')
    } catch (error) {
      console.error('Error fetching entries:', error)
      // Fall back to demo data if API fails
      setEntries(PRE_POPULATED_ENTRIES)
      setDataSource('demo')
    } finally {
      setLoading(false)
    }
  }

  const useDemoData = () => {
    setLoading(true)
    const timer = setTimeout(() => {
      setEntries(PRE_POPULATED_ENTRIES)
      setDataSource('demo')
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }

  const createEntry = async (entryData) => {
    setLoading(true)
    try {
      const newEntry = {
        id: Date.now(), // Use timestamp as ID
        title: entryData.title,
        body: entryData.body,
        important: false,
        userId: 1
      }
      
      setEntries(prev => [newEntry, ...prev])
      setShowForm(false)
      
      // Optional: Also try to post to API
      try {
        await fetch(API_URL, {
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
      } catch (apiError) {
        console.log('API post failed, but entry saved locally')
      }
    } catch (error) {
      console.error('Error creating entry:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteEntry = async (id) => {
    try {
      // Try to delete from API
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.log('API delete failed, but removing locally')
    }
    // Always update UI
    setEntries(prev => prev.filter(entry => entry.id !== id))
  }

  const updateEntry = async (id, entryData) => {
    try {
      // Update locally first for better UX
      setEntries(prev => prev.map(entry => 
        entry.id === id 
          ? { ...entry, title: entryData.title, body: entryData.body }
          : entry
      ))
      
      // Try to update via API
      await fetch(`${API_URL}/${id}`, {
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
        <div className={`data-source ${dataSource === 'demo' ? 'demo-notice' : 'api-notice'}`}>
          <small>
            {dataSource === 'demo' 
              ? 'Using realistic demo entries' 
              : 'Using data from API'}
          </small>
        </div>
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

        <button 
          className="btn btn-api"
          onClick={fetchEntries}
          disabled={loading}
          title="Fetch from JSONPlaceholder API"
        >
          {loading ? 'Loading...' : 'API Data'}
        </button>

        <button 
          className="btn btn-demo"
          onClick={useDemoData}
          disabled={loading}
          title="Use realistic demo entries"
        >
          Demo Data
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