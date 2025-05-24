import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { format, addHours, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '../ApperIcon'

export default function EventForm({ event, selectedDate, selectedTime, onSave, onDelete, onCancel }) {
  const { tasks, goals } = useSelector(state => state)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'other',
    isAllDay: false,
    location: '',
    attendees: '',
    reminder: 15,
    linkedTaskId: null,
    linkedProjectId: null,
    color: '#6366f1'
  })

  const [errors, setErrors] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const eventTypes = [
    { value: 'meeting', label: 'Meeting', icon: 'Users', color: '#3b82f6' },
    { value: 'work', label: 'Work', icon: 'Briefcase', color: '#10b981' },
    { value: 'personal', label: 'Personal', icon: 'User', color: '#8b5cf6' },
    { value: 'appointment', label: 'Appointment', icon: 'Calendar', color: '#f59e0b' },
    { value: 'reminder', label: 'Reminder', icon: 'Bell', color: '#ef4444' },
    { value: 'other', label: 'Other', icon: 'Circle', color: '#6b7280' }
  ]

  const reminderOptions = [
    { value: null, label: 'No reminder' },
    { value: 5, label: '5 minutes before' },
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' },
    { value: 60, label: '1 hour before' },
    { value: 1440, label: '1 day before' }
  ]

  useEffect(() => {
    if (event) {
      // Edit mode - populate with existing event data
      setFormData({
        title: event.title || '',
        description: event.description || '',
        startTime: event.startTime ? format(parseISO(event.startTime), "yyyy-MM-dd'T'HH:mm") : '',
        endTime: event.endTime ? format(parseISO(event.endTime), "yyyy-MM-dd'T'HH:mm") : '',
        type: event.type || 'other',
        isAllDay: event.isAllDay || false,
        location: event.location || '',
        attendees: event.attendees ? event.attendees.join(', ') : '',
        reminder: event.reminder || 15,
        linkedTaskId: event.linkedTaskId || null,
        linkedProjectId: event.linkedProjectId || null,
        color: event.color || '#6366f1'
      })
    } else {
      // Create mode - set defaults based on selected date/time
      const defaultStart = selectedTime || selectedDate || new Date()
      const defaultEnd = addHours(defaultStart, 1)
      
      setFormData(prev => ({
        ...prev,
        startTime: format(defaultStart, "yyyy-MM-dd'T'HH:mm"),
        endTime: format(defaultEnd, "yyyy-MM-dd'T'HH:mm")
      }))
    }
  }, [event, selectedDate, selectedTime])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
    
    // Auto-adjust end time when start time changes
    if (field === 'startTime' && value && !formData.isAllDay) {
      const startDate = new Date(value)
      const endDate = addHours(startDate, 1)
      setFormData(prev => ({
        ...prev,
        endTime: format(endDate, "yyyy-MM-dd'T'HH:mm")
      }))
    }
    
    // Update color when type changes
    if (field === 'type') {
      const selectedType = eventTypes.find(t => t.value === value)
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          color: selectedType.color
        }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.isAllDay) {
      if (!formData.startTime) {
        newErrors.startTime = 'Start time is required'
      }
      
      if (!formData.endTime) {
        newErrors.endTime = 'End time is required'
      }
      
      if (formData.startTime && formData.endTime && new Date(formData.startTime) >= new Date(formData.endTime)) {
        newErrors.endTime = 'End time must be after start time'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }
    
    const eventData = {
      ...formData,
      attendees: formData.attendees ? formData.attendees.split(',').map(email => email.trim()).filter(email => email) : [],
      startTime: formData.isAllDay ? format(new Date(formData.startTime), 'yyyy-MM-dd') + 'T00:00:00' : new Date(formData.startTime).toISOString(),
      endTime: formData.isAllDay ? format(new Date(formData.startTime), 'yyyy-MM-dd') + 'T23:59:59' : new Date(formData.endTime).toISOString()
    }
    
    onSave(eventData)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    onDelete()
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          Event Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
            errors.title
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-surface-300 dark:border-surface-600'
          } bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100`}
          placeholder="Enter event title..."
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      {/* Event Type */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          Event Type
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {eventTypes.map((type) => (
            <motion.button
              key={type.value}
              type="button"
              onClick={() => handleInputChange('type', type.value)}
              className={`flex items-center space-x-2 p-3 rounded-lg border transition-all ${
                formData.type === type.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-surface-300 dark:border-surface-600 hover:border-primary/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: type.color }} />
              <ApperIcon name={type.icon} size={16} />
              <span className="text-sm font-medium">{type.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* All Day Toggle */}
      <div className="flex items-center space-x-3">
        <motion.button
          type="button"
          onClick={() => handleInputChange('isAllDay', !formData.isAllDay)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            formData.isAllDay ? 'bg-primary' : 'bg-surface-300 dark:bg-surface-600'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
            animate={{ x: formData.isAllDay ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </motion.button>
        <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
          All day event
        </label>
      </div>

      {/* Date and Time */}
      {!formData.isAllDay ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Start Time *
            </label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                errors.startTime
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-surface-300 dark:border-surface-600'
              } bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100`}
            />
            {errors.startTime && <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              End Time *
            </label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                errors.endTime
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-surface-300 dark:border-surface-600'
              } bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100`}
            />
            {errors.endTime && <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>}
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.startTime ? format(new Date(formData.startTime), 'yyyy-MM-dd') : ''}
            onChange={(e) => {
              const dateValue = e.target.value + 'T00:00'
              handleInputChange('startTime', dateValue)
              handleInputChange('endTime', dateValue)
            }}
            className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
          />
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
          placeholder="Add event description..."
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
          placeholder="Enter location..."
        />
      </div>

      {/* Reminder */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          Reminder
        </label>
        <select
          value={formData.reminder || ''}
          onChange={(e) => handleInputChange('reminder', e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
        >
          {reminderOptions.map((option) => (
            <option key={option.value || 'none'} value={option.value || ''}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Link to Task/Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Link to Task
          </label>
          <select
            value={formData.linkedTaskId || ''}
            onChange={(e) => {
              handleInputChange('linkedTaskId', e.target.value || null)
              if (e.target.value) handleInputChange('linkedProjectId', null)
            }}
            className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
          >
            <option value="">Select a task...</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Link to Goal
          </label>
          <select
            value={formData.linkedProjectId || ''}
            onChange={(e) => {
              handleInputChange('linkedProjectId', e.target.value || null)
              if (e.target.value) handleInputChange('linkedTaskId', null)
            }}
            className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
          >
            <option value="">Select a goal...</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0 pt-6 border-t border-surface-200 dark:border-surface-700">
        {event && (
          <motion.button
            type="button"
            onClick={handleDeleteClick}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Trash2" size={16} />
            <span>Delete Event</span>
          </motion.button>
        )}
        
        <div className="flex space-x-3">
          <motion.button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {event ? 'Update Event' : 'Create Event'}
          </motion.button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <motion.div
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
          <motion.div
            className="relative bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h4 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-2">
              Delete Event
            </h4>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </form>
  )
}