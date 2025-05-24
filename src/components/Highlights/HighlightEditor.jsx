import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../ApperIcon'

export default function HighlightEditor({ onClose, onHighlightCreated, initialText = '' }) {
  const dispatch = useDispatch()
  const { notes } = useSelector(state => state)
  const [selectedText, setSelectedText] = useState(initialText)
  const [annotation, setAnnotation] = useState('')
  const [priority, setPriority] = useState('medium')
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [linkedNoteId, setLinkedNoteId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [highlightColor, setHighlightColor] = useState('#fbbf24')
  const textAreaRef = useRef(null)

  const colors = [
    { name: 'Yellow', value: '#fbbf24', class: 'bg-yellow-400' },
    { name: 'Green', value: '#22c55e', class: 'bg-green-500' },
    { name: 'Blue', value: '#3b82f6', class: 'bg-blue-500' },
    { name: 'Purple', value: '#8b5cf6', class: 'bg-purple-500' },
    { name: 'Pink', value: '#ec4899', class: 'bg-pink-500' },
    { name: 'Orange', value: '#f97316', class: 'bg-orange-500' },
    { name: 'Red', value: '#ef4444', class: 'bg-red-500' },
    { name: 'Gray', value: '#6b7280', class: 'bg-gray-500' }
  ]

  const popularTags = [
    'important', 'research', 'quote', 'idea', 'question', 'follow-up',
    'key-point', 'definition', 'example', 'reference', 'todo', 'review'
  ]

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }, [])

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim())
      toast.info('Text selected for highlighting')
    } else {
      toast.warning('Please select some text to highlight')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedText.trim()) {
      toast.error('Please select or enter text to highlight')
      return
    }

    setIsSubmitting(true)

    try {
      const highlight = {
        id: Date.now().toString(),
        text: selectedText,
        annotation,
        priority,
        color: highlightColor,
        tags,
        linkedNoteId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        position: null // Will be set when applied to content
      }

      dispatch({ type: 'ADD_HIGHLIGHT', payload: highlight })
      
      // If linked to a note, update the note
      if (linkedNoteId) {
        const note = notes.find(n => n.id === linkedNoteId)
        if (note) {
          dispatch({ 
            type: 'UPDATE_NOTE', 
            payload: { 
              ...note, 
              linkedHighlightId: highlight.id,
              updatedAt: new Date().toISOString()
            }
          })
        }
      }

      toast.success('Highlight created successfully!')
      onHighlightCreated && onHighlightCreated(highlight.id)
      onClose()
    } catch (error) {
      toast.error('Failed to create highlight. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags(prev => [...prev, trimmedTag])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleAddPopularTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags(prev => [...prev, tag])
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal-backdrop-system flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-2xl z-modal-system"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Highlighter" size={16} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-200">
                Create Highlight
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Text Selection */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Text to Highlight
              </label>
              <textarea
                ref={textAreaRef}
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 bg-white dark:bg-surface-700 transition-colors resize-none"
                rows={3}
                placeholder="Select text from the page or type here..."
              />
              <button
                type="button"
                onClick={handleTextSelection}
                className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-lg hover:bg-yellow-200 transition-colors"
              >
                Capture Selected Text
              </button>
            </div>

            {/* Annotation */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Annotation (Optional)
              </label>
              <textarea
                value={annotation}
                onChange={(e) => setAnnotation(e.target.value)}
                className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 bg-white dark:bg-surface-700 transition-colors resize-none"
                rows={2}
                placeholder="Add your thoughts or notes about this highlight..."
              />
            </div>

            {/* Priority and Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 bg-white dark:bg-surface-700 transition-colors"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Highlight Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setHighlightColor(color.value)}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        highlightColor === color.value ? 'ring-2 ring-surface-400 ring-offset-2' : ''
                      } hover:scale-110 transition-all`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Link to Note */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Link to Note (Optional)
              </label>
              <select
                value={linkedNoteId}
                onChange={(e) => setLinkedNoteId(e.target.value)}
                className="w-full px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 bg-white dark:bg-surface-700 transition-colors"
              >
                <option value="">Select a note...</option>
                {notes.map(note => (
                  <option key={note.id} value={note.id}>{note.title}</option>
                ))}
              </select>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 font-medium rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedText.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Highlighter" size={16} />
                    <span>Create Highlight</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}