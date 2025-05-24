import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addMonths, subMonths, startOfMonth, addWeeks, subWeeks, addDays, subDays } from 'date-fns'
import ApperIcon from '../ApperIcon'
import MonthView from './MonthView'
import WeekView from './WeekView'
import DayView from './DayView'
import EventModal from './EventModal'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month') // month, week, day
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const views = [
    { id: 'month', label: 'Month', icon: 'Grid3X3' },
    { id: 'week', label: 'Week', icon: 'Calendar' },
    { id: 'day', label: 'Day', icon: 'Clock' }
  ]

  const navigateDate = (direction) => {
    if (view === 'month') {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
    } else if (view === 'week') {
      setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1))
    } else {
      setCurrentDate(direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleCreateEvent = (date = null, time = null) => {
    setSelectedEvent(null)
    setSelectedDate(date)
    setSelectedTime(time)
    setShowEventModal(true)
  }

  const handleEditEvent = (event) => {
    setSelectedEvent(event)
    setSelectedDate(null)
    setSelectedTime(null)
    setShowEventModal(true)
  }

  const handleCloseModal = () => {
    setShowEventModal(false)
    setSelectedEvent(null)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const getDateRangeText = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy')
    } else if (view === 'week') {
      const weekStart = startOfMonth(currentDate)
      return format(weekStart, 'MMM d') + ' - ' + format(addDays(weekStart, 6), 'MMM d, yyyy')
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy')
    }
  }

  return (
    <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 lg:p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => navigateDate('prev')}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="ChevronLeft" size={20} />
              </motion.button>
              
              <h2 className="text-xl lg:text-2xl font-bold text-surface-800 dark:text-surface-200 min-w-0">
                {getDateRangeText()}
              </h2>
              
              <motion.button
                onClick={() => navigateDate('next')}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="ChevronRight" size={20} />
              </motion.button>
            </div>
            
            <motion.button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Today
            </motion.button>
          </div>

          {/* View Controls and Actions */}
          <div className="flex items-center space-x-3">
            {/* View Selector */}
            <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
              {views.map((viewOption) => (
                <motion.button
                  key={viewOption.id}
                  onClick={() => setView(viewOption.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    view === viewOption.id
                      ? 'bg-white dark:bg-surface-600 text-primary shadow-sm'
                      : 'text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name={viewOption.icon} size={16} />
                  <span className="hidden sm:inline">{viewOption.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Add Event Button */}
            <motion.button
              onClick={() => handleCreateEvent()}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Plus" size={16} />
              <span className="hidden sm:inline">New Event</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-4 lg:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {view === 'month' && (
              <MonthView 
                currentDate={currentDate}
                onCreateEvent={handleCreateEvent}
                onEditEvent={handleEditEvent}
              />
            )}
            {view === 'week' && (
              <WeekView 
                currentDate={currentDate}
                onCreateEvent={handleCreateEvent}
                onEditEvent={handleEditEvent}
              />
            )}
            {view === 'day' && (
              <DayView 
                currentDate={currentDate}
                onCreateEvent={handleCreateEvent}
                onEditEvent={handleEditEvent}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={showEventModal}
        onClose={handleCloseModal}
        event={selectedEvent}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </div>
  )
}