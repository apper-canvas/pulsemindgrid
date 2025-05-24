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
    linkedNoteId: '',
    tags: []
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [linkedNotes, setLinkedNotes] = useState([])
  const [showPopularTags, setShowPopularTags] = useState(false)

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content || '',
        linkedTaskId: note.linkedTaskId || '',
        linkedGoalId: note.linkedGoalId || '',
        linkedNoteId: '',
        tags: note.tags || []
      })
      setLinkedNotes(note.linkedNoteIds || [])
    } else {
      setLinkedNotes([])
    }
  }, [note])

  // Get available notes for linking (exclude current note)
  const availableNotes = notes.filter(n => n.id !== note?.id)

  // Get available tasks and goals for linking
  const availableTasks = tasks.filter(task => !task.completed)

  // Popular tags for quick selection
  const popularTags = [
    'important', 'urgent', 'ideas', 'meeting', 'project', 'research',
    'personal', 'work', 'study', 'reference', 'todo', 'reminder',
    'review', 'draft', 'template', 'archive', 'brainstorm', 'feedback'
  ]

  const availablePopularTags = popularTags.filter(tag => !formData.tags.includes(tag))

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
        linkedNoteIds: linkedNotes,
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

      onClose()
    } catch (error) {
      toast.error('Failed to save note. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }))
      setNewTag('')
    }
  }

  const handleAddPopularTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const handleTogglePopularTags = () => setShowPopularTags(!showPopularTags)

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleLinkNote = () => {
    if (formData.linkedNoteId && !linkedNotes.includes(formData.linkedNoteId)) {
      setLinkedNotes(prev => [...prev, formData.linkedNoteId])
      setFormData(prev => ({ ...prev, linkedNoteId: '' }))
    }
  }

  const handleUnlinkNote = (noteId) => {
    setLinkedNotes(prev => prev.filter(id => id !== noteId))
  }

  const getLinkedTaskTitle = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    return task ? task.title : 'Unknown Task'
  }

  const getLinkedGoalTitle = (goalId) => {
    const goal = goals.find(g => g.id === goalId)
    return goal ? goal.title : 'Unknown Goal'
  }

  const getLinkedNoteTitle = (noteId) => {
    const linkedNote = notes.find(n => n.id === noteId)
    return linkedNote ? linkedNote.title : 'Unknown Note'
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
    <form onSubmit={handleSubmit} className="h-full flex flex-col modal-flex-container">
      <div className="flex-1 overflow-y-auto modal-content-scroll modal-scrollbar p-6 space-y-6" style={{ minHeight: 0 }}>
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
        <div className="space-y-6">
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
              {availableTasks.map(task => (
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

        {/* Link to Other Notes */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Link to Other Notes
          </label>
          <div className="flex gap-2">
            <select
              value={formData.linkedNoteId}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedNoteId: e.target.value }))}
              className="flex-1 px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-surface-700 transition-colors"
            >
              <option value="">Select a note...</option>
              {availableNotes.map(availableNote => (
                <option key={availableNote.id} value={availableNote.id}>{availableNote.title}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleLinkNote}
              disabled={!formData.linkedNoteId}
              className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ApperIcon name="Link" size={16} />
            </button>
          </div>
          
          {/* Linked Notes Display */}
          {linkedNotes.length > 0 && (
            <div className="mt-3 space-y-2">
              {linkedNotes.map(noteId => (
                <div key={noteId} className="flex items-center justify-between p-2 bg-surface-50 dark:bg-surface-700 rounded-lg">
                  <span className="text-sm">{getLinkedNoteTitle(noteId)}</span>
                  <button
                    type="button"
                    onClick={() => handleUnlinkNote(noteId)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <ApperIcon name="X" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Tags
            </label>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-2 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-surface-700 transition-colors"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary-dark transition-colors"
            >
              Add Tag
            </button>
            <button
              type="button"
              onClick={handleTogglePopularTags}
              className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-colors"
            >
              <ApperIcon name={showPopularTags ? "ChevronUp" : "ChevronDown"} size={16} />
            </button>
          </div>
          
          {/* Popular Tags Section */}
          {showPopularTags && (
            <div className="mb-4 p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
              <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Popular Tags</h4>
              {availablePopularTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {availablePopularTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddPopularTag(tag)}
                      className="px-3 py-1 bg-white dark:bg-surface-600 border border-surface-200 dark:border-surface-500 text-surface-700 dark:text-surface-300 text-sm rounded-full hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors"
                    >
                      <ApperIcon name="Plus" size={12} className="mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  All popular tags have been added to this note.
                </p>
              )}
            </div>
          )}

          {/* Create Custom Tag Hint */}
          {formData.tags.length === 0 && (
            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-2">
                <ApperIcon name="Lightbulb" size={16} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Pro tip:</strong> Create custom tags by typing in the field above, or choose from popular tags below to organize your notes effectively.
                </div>
              </div>
            </div>
          )}
          
          {/* Tags Display */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-primary/70 hover:text-primary transition-colors"
                  >
                    <ApperIcon name="X" size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Current Links Summary */}
        {(formData.linkedTaskId || formData.linkedGoalId || linkedNotes.length > 0) && (
          <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
            <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Current Links</h4>
            <div className="space-y-1 text-sm text-surface-600 dark:text-surface-400">
              {formData.linkedTaskId && (
                <div className="flex items-center gap-2">
                  <ApperIcon name="CheckSquare" size={14} />
                  <span>Task: {getLinkedTaskTitle(formData.linkedTaskId)}</span>
                </div>
              )}
              {formData.linkedGoalId && (
                <div className="flex items-center gap-2">
                  <ApperIcon name="Target" size={14} />
                  <span>Goal: {getLinkedGoalTitle(formData.linkedGoalId)}</span>
                </div>
              )}
              {linkedNotes.map(noteId => (
                <div key={noteId} className="flex items-center gap-2">
                  <ApperIcon name="FileText" size={14} />
                  <span>Note: {getLinkedNoteTitle(noteId)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end space-x-3 p-6 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 flex-shrink-0">
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