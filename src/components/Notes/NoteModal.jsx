import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import NoteEditor from './NoteEditor'

export default function NoteModal({ isOpen, onClose, note }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="FileText" size={16} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-200">
                {note ? 'Edit Note' : 'Create New Note'}
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
          <div className="flex-1 overflow-hidden">
            <NoteEditor
              note={note}
              onClose={onClose}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}