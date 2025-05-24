import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import ApperIcon from '../ApperIcon'
import EventForm from './EventForm'

export default function EventModal({ isOpen, onClose, event, selectedDate, selectedTime }) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSave = (eventData) => {
    if (event) {
      // Update existing event
      dispatch({
        type: 'UPDATE_EVENT',
        payload: { ...eventData, id: event.id }
      })
      toast.success('Event updated successfully!')
    } else {
      // Create new event
      dispatch({
        type: 'ADD_EVENT',
        payload: eventData
      })
      toast.success('Event created successfully!')
    }
    onClose()
  }

  const handleDelete = () => {
    if (event) {
      dispatch({
        type: 'DELETE_EVENT',
        payload: event.id
      })
      toast.success('Event deleted successfully!')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-modal flex items-center justify-center p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl h-[90vh] max-h-[90vh] bg-white dark:bg-surface-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden modal-container"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700 flex-shrink-0">
              <h3 className="text-xl font-bold text-surface-800 dark:text-surface-200">
                {event ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <EventForm
                event={event}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSave={handleSave}
                onDelete={handleDelete}
                onCancel={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}