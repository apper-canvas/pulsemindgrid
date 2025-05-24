import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { toast } from 'react-toastify'
import ApperIcon from '../ApperIcon'

export default function NoteEditor({ note, onClose }) {
  const dispatch = useDispatch()
  const { tasks, goals, notes } = useSelector(state => state)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    linkedTaskId: '',
    linkedGoalId: '',
    linkedNoteIds: [],
    tags: []
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content || '',
        linkedTaskId: note.linkedTaskId || '',
        linkedGoalId: note.linkedGoalId || '',
        linkedNoteIds: note.linkedNoteIds || [],
        tags: note.tags || []
      })
    }
  }, [note])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      newErrors.content = 'Content is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }

    setIsSubmitting(true)

    try {
      const noteData = {
        ...formData,
        id: note?.id || Date.now().toString(),
        createdAt: note?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (note) {
        dispatch({ type: 'UPDATE_NOTE', payload: noteData })
        toast.success('Note updated successfully!')
      } else {
        dispatch({ type: 'ADD_NOTE', payload: noteData })
        toast.success('Note created successfully!')
      }

      // Link note to task if specified
      if (formData.linkedTaskId) {
        dispatch({
          type: 'LINK_NOTE_TO_TASK',
          payload: { noteId: noteData.id, taskId: formData.linkedTaskId }
        })
      }

      // Link note to goal if specified
      if (formData.linkedGoalId) {
        dispatch({
          type: 'LINK_NOTE_TO_GOAL',
          payload: { noteId: noteData.id, goalId: formData.linkedGoalId }
        })
      }

      onClose()
    } catch (error) {
      toast.error('Failed to save note. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      [{ 'table': true }],
      ['clean']
    ]
  }

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'align',
    'link', 'image', 'blockquote', 'code-block', 'table'
  ]

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Note Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
              errors.title 
                ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                : 'border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700'
            }`}
            placeholder="Enter note title..."
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Content
          </label>
          <div className={`border rounded-xl overflow-hidden ${
            errors.content 
              ? 'border-red-300' 
              : 'border-surface-200 dark:border-surface-600'
          }`}>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              modules={quillModules}
              formats={quillFormats}
              className="bg-white dark:bg-surface-700"
            />
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
          )}
        </div>

        {/* Linking Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Link to Task
            </label>
            <select
              value={formData.linkedTaskId}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedTaskId: e.target.value }))}
              className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-surface-700 transition-colors"
            >
              <option value="">Select a task...</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Link to Goal
            </label>
            <select
              value={formData.linkedGoalId}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedGoalId: e.target.value }))}
              className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-surface-700 transition-colors"
            >
              <option value="">Select a goal...</option>
              {goals.map(goal => (
                <option key={goal.id} value={goal.id}>{goal.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end space-x-3 p-6 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 font-medium rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <ApperIcon name="Save" size={16} />
              <span>{note ? 'Update Note' : 'Create Note'}</span>
            </div>
          )}
        </button>
      </div>
    </form>
  )
}