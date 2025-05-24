import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from '../ApperIcon'
import NoteModal from './NoteModal'

export default function Notes() {
  const dispatch = useDispatch()
  const { notes, tasks, goals } = useSelector(state => state)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [linkFilter, setLinkFilter] = useState('all') // all, tasks, goals, notes

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === '' || note.tags?.includes(selectedTag)
    
    const matchesLinkFilter = linkFilter === 'all' || 
      (linkFilter === 'tasks' && note.linkedTasks?.length > 0) ||
      (linkFilter === 'goals' && note.linkedGoals?.length > 0) ||
      (linkFilter === 'notes' && note.linkedNoteIds?.length > 0) ||
      (linkFilter === 'unlinked' && (!note.linkedTasks?.length && !note.linkedGoals?.length && !note.linkedNoteIds?.length))
    
    return matchesSearch && matchesTag && matchesLinkFilter
  })

  const allTags = [...new Set(notes.flatMap(note => note.tags || []))]

  const handleCreateNote = () => {
    setEditingNote(null)
    setIsModalOpen(true)
  }

  const handleEditNote = (note) => {
    setEditingNote(note)
    setIsModalOpen(true)
  }

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch({ type: 'DELETE_NOTE', payload: noteId })
      toast.success('Note deleted successfully')
    }
  }

  const getLinkedItems = (note) => {
    const linkedTasks = tasks.filter(task => note.linkedTasks?.includes(task.id))
    const linkedGoals = goals.filter(goal => note.linkedGoals?.includes(goal.id))
    const linkedNotes = notes.filter(n => note.linkedNoteIds?.includes(n.id))
    return { linkedTasks, linkedGoals, linkedNotes }
  }

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ""
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>

          {/* Link Filter */}
          <select
            value={linkFilter}
            onChange={(e) => setLinkFilter(e.target.value)}
            className="px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Notes</option>
            <option value="tasks">Linked to Tasks</option>
            <option value="goals">Linked to Goals</option>
            <option value="notes">Linked to Notes</option>
            <option value="unlinked">Unlinked</option>
          </select>
        </div>

        <div className="flex gap-2">
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

          {/* Create Note Button */}
          <motion.button
            onClick={handleCreateNote}
            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            New Note
          </motion.button>
        </div>
      </div>

      {/* Notes Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        <AnimatePresence>
          {filteredNotes.map((note) => {
            const { linkedTasks, linkedGoals, linkedNotes: noteLinks } = getLinkedItems(note)
            
            return (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl p-4 border border-surface-200 dark:border-surface-700 hover:border-primary/50 transition-all duration-200 cursor-pointer group ${viewMode === 'list' ? 'flex gap-4' : ''}`}
                onClick={() => handleEditNote(note)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-surface-800 dark:text-surface-200 line-clamp-2">{note.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteNote(note.id)
                      }}
                      className="p-1 text-surface-400 hover:text-red-500 transition-colors"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </button>
                  </div>
                  
                  <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-3 mb-3">
                    {stripHtmlTags(note.content)}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Linked Items Indicators */}
                  {(linkedTasks.length > 0 || linkedGoals.length > 0 || noteLinks.length > 0) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {linkedTasks.length > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          <ApperIcon name="CheckSquare" size={12} />
                          <span>{linkedTasks.length} task{linkedTasks.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {linkedGoals.length > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                          <ApperIcon name="Target" size={12} />
                          <span>{linkedGoals.length} goal{linkedGoals.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {noteLinks.length > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                          <ApperIcon name="FileText" size={12} />
                          <span>{noteLinks.length} note{noteLinks.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  
                  <div className="flex justify-between items-center text-xs text-surface-500">
                    <div className="flex items-center gap-2">
                      <span>{linkedTasks.length + linkedGoals.length + noteLinks.length} links</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ApperIcon name="ExternalLink" size={12} />
                      </div>
                    </div>
                    <span>{linkedTasks.length + linkedGoals.length} links</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="FileText" size={48} className="mx-auto text-surface-400 mb-4" />
          <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-2">
            {notes.length === 0 ? 'No notes yet' : 'No notes match your filters'}
          </h3>
          <p className="text-surface-600 dark:text-surface-400">
            {notes.length === 0 ? 'Create your first note to get started!' : 'Try adjusting your search or filters.'}
          </p>
        </div>
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        note={editingNote}
      />
    </div>
  )
}