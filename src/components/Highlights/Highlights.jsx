import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from '../ApperIcon'
import HighlightEditor from './HighlightEditor'

export default function Highlights() {
  const dispatch = useDispatch()
  const { highlights = [], notes } = useSelector(state => state)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingHighlight, setEditingHighlight] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedHighlights, setSelectedHighlights] = useState([])

  const filteredHighlights = highlights.filter(highlight => {
    const matchesSearch = highlight.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         highlight.annotation?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = selectedPriority === '' || highlight.priority === selectedPriority
    const matchesColor = selectedColor === '' || highlight.color === selectedColor
    
    return matchesSearch && matchesPriority && matchesColor
  })

  const allColors = [...new Set(highlights.map(h => h.color))]

  const handleCreateHighlight = () => {
    setEditingHighlight(null)
    setIsEditorOpen(true)
  }

  const handleEditHighlight = (highlight) => {
    setEditingHighlight(highlight)
    setIsEditorOpen(true)
  }

  const handleDeleteHighlight = (highlightId) => {
    if (window.confirm('Are you sure you want to delete this highlight?')) {
      dispatch({ type: 'DELETE_HIGHLIGHT', payload: highlightId })
      
      // Remove highlight link from any notes
      const linkedNotes = notes.filter(note => note.linkedHighlightId === highlightId)
      linkedNotes.forEach(note => {
        dispatch({ 
          type: 'UPDATE_NOTE', 
          payload: { 
            ...note, 
            linkedHighlightId: '',
            updatedAt: new Date().toISOString()
          }
        })
      })
      
      toast.success('Highlight deleted successfully')
    }
  }

  const handleBulkDelete = () => {
    if (selectedHighlights.length === 0) {
      toast.warning('Please select highlights to delete')
      return
    }

    if (window.confirm(`Are you sure you want to delete ${selectedHighlights.length} highlight(s)?`)) {
      selectedHighlights.forEach(highlightId => {
        dispatch({ type: 'DELETE_HIGHLIGHT', payload: highlightId })
        
        // Remove highlight links from notes
        const linkedNotes = notes.filter(note => note.linkedHighlightId === highlightId)
        linkedNotes.forEach(note => {
          dispatch({ 
            type: 'UPDATE_NOTE', 
            payload: { 
              ...note, 
              linkedHighlightId: '',
              updatedAt: new Date().toISOString()
            }
          })
        })
      })
      
      setSelectedHighlights([])
      toast.success(`${selectedHighlights.length} highlight(s) deleted successfully`)
    }
  }

  const handleSelectHighlight = (highlightId) => {
    setSelectedHighlights(prev => 
      prev.includes(highlightId) 
        ? prev.filter(id => id !== highlightId)
        : [...prev, highlightId]
    )
  }

  const handleSelectAll = () => {
    if (selectedHighlights.length === filteredHighlights.length) {
      setSelectedHighlights([])
    } else {
      setSelectedHighlights(filteredHighlights.map(h => h.id))
    }
  }

  const getLinkedNote = (highlightId) => {
    return notes.find(note => note.linkedHighlightId === highlightId)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      case 'medium': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  return (
    <div className="module-content">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search highlights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Color Filter */}
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          >
            <option value="">All Colors</option>
            {allColors.map(color => (
              <option key={color} value={color} style={{ backgroundColor: color }}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          {/* Bulk Actions */}
          {selectedHighlights.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                <ApperIcon name="Trash2" size={16} className="mr-2" />
                Delete ({selectedHighlights.length})
              </button>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-surface-600 shadow-sm' : ''}`}
            >
              <ApperIcon name="Grid3X3" size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-surface-600 shadow-sm' : ''}`}
            >
              <ApperIcon name="List" size={16} />
            </button>
          </div>

          {/* Create Highlight Button */}
          <motion.button
            onClick={handleCreateHighlight}
            className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="Highlighter" size={16} className="mr-2" />
            New Highlight
          </motion.button>
        </div>
      </div>

      {/* Bulk Select */}
      {filteredHighlights.length > 0 && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedHighlights.length === filteredHighlights.length}
            onChange={handleSelectAll}
            className="w-4 h-4 text-yellow-500 focus:ring-yellow-400 border-surface-300 rounded"
          />
          <span className="text-sm text-surface-600 dark:text-surface-400">
            Select all ({filteredHighlights.length})
          </span>
        </div>
      )}

      {/* Highlights Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        <AnimatePresence>
          {filteredHighlights.map((highlight) => {
            const linkedNote = getLinkedNote(highlight.id)
            
            return (
              <motion.div
                key={highlight.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl p-4 border border-surface-200 dark:border-surface-700 hover:border-yellow-400/50 transition-all duration-200 cursor-pointer group ${viewMode === 'list' ? 'flex gap-4' : ''}`}
                onClick={() => handleEditHighlight(highlight)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedHighlights.includes(highlight.id)}
                        onChange={() => handleSelectHighlight(highlight.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-yellow-500 focus:ring-yellow-400 border-surface-300 rounded"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-surface-300"
                        style={{ backgroundColor: highlight.color }}
                      />
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(highlight.priority)}`}>
                        {highlight.priority}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteHighlight(highlight.id)
                      }}
                      className="p-1 text-surface-400 hover:text-red-500 transition-colors"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </button>
                  </div>
                  
                  <div 
                    className="p-3 rounded-lg mb-3 border-l-4"
                    style={{ 
                      backgroundColor: `${highlight.color}20`,
                      borderLeftColor: highlight.color
                    }}
                  >
                    <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                      "{highlight.text}"
                    </p>
                  </div>
                  
                  {highlight.annotation && (
                    <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
                      {highlight.annotation}
                    </p>
                  )}
                  
                  {linkedNote && (
                    <div className="flex items-center gap-2 mb-3 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                      <ApperIcon name="FileText" size={12} />
                      <span>Linked to: {linkedNote.title}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs text-surface-500">
                    <span>{format(new Date(highlight.createdAt), 'MMM d, yyyy')}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ApperIcon name="Edit" size={12} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredHighlights.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Highlighter" size={48} className="mx-auto text-surface-400 mb-4" />
          <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-2">
            {highlights.length === 0 ? 'No highlights yet' : 'No highlights match your filters'}
          </h3>
          <p className="text-surface-600 dark:text-surface-400">
            {highlights.length === 0 ? 'Create your first highlight to get started!' : 'Try adjusting your search or filters.'}
          </p>
        </div>
      )}

      {/* Highlight Editor Modal */}
      {isEditorOpen && (
        <HighlightEditor
          onClose={() => setIsEditorOpen(false)}
          highlight={editingHighlight}
        />
      )}
    </div>
  )
}