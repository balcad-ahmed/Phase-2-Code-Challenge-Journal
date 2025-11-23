import React, { useState, useEffect } from 'react'

const JournalForm = ({ onSubmit, onCancel, loading, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    body: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        body: initialData.body
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'Body is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      if (!initialData) {
        // Reset form only for new entries, not edits
        setFormData({ title: '', body: '' })
      }
    }
  }

  return (
    <div className="journal-form-container">
      <form onSubmit={handleSubmit} className="journal-form">
        <h3>{initialData ? 'Edit Entry' : 'New Journal Entry'}</h3>
        
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            disabled={loading}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="body">Content *</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows="6"
            className={errors.body ? 'error' : ''}
            disabled={loading}
          />
          {errors.body && <span className="error-message">{errors.body}</span>}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default JournalForm