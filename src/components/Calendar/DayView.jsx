import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { 
  format, 
  isSameDay, 
  isToday,
  parseISO,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
  differenceInMinutes
} from 'date-fns'

export default function DayView({ currentDate, onCreateEvent, onEditEvent }) {
  const { events } = useSelector(state => state)

  const hours = Array.from({ length: 17 }, (_, i) => i + 6) // 6 AM to 10 PM

  const dayEvents = events.filter(event => {
    const eventDate = parseISO(event.startTime)
    return isSameDay(eventDate, currentDate) && !event.isAllDay
  })

  const allDayEvents = events.filter(event => {
    const eventDate = parseISO(event.startTime)
    return isSameDay(eventDate, currentDate) && event.isAllDay
  })

  const getEventStyle = (event) => {
    const startTime = parseISO(event.startTime)
    const endTime = parseISO(event.endTime)
    
    const startHour = getHours(startTime)
    const startMinute = getMinutes(startTime)
    const duration = differenceInMinutes(endTime, startTime)
    
    const top = ((startHour - 6) * 60 + startMinute) / 60 * 4 // 4rem per hour
    const height = (duration / 60) * 4 // 4rem per hour
    
    return {
      top: `${top}rem`,
      height: `${Math.max(height, 1)}rem`
    }
  }

  const getEventTypeColor = (type) => {
    const colors = {
      meeting: 'bg-blue-500 border-blue-600',
      work: 'bg-green-500 border-green-600',
      personal: 'bg-purple-500 border-purple-600',
      appointment: 'bg-orange-500 border-orange-600',
      reminder: 'bg-red-500 border-red-600',
      other: 'bg-gray-500 border-gray-600'
    }
    return colors[type] || colors.other
  }

  const handleTimeSlotClick = (hour, minute = 0) => {
    const selectedDateTime = setMinutes(setHours(currentDate, hour), minute)
    onCreateEvent(currentDate, selectedDateTime)
  }

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <div className={`text-center p-6 rounded-xl ${
        isToday(currentDate)
          ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary'
          : 'bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600'
      }`}>
        <h3 className="text-2xl font-bold text-surface-800 dark:text-surface-200">
          {format(currentDate, 'EEEE')}
        </h3>
        <p className="text-lg text-surface-600 dark:text-surface-400">
          {format(currentDate, 'MMMM d, yyyy')}
        </p>
        {isToday(currentDate) && (
          <p className="text-sm text-primary font-medium mt-2">Today</p>
        )}
      </div>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-surface-600 dark:text-surface-400">All Day</h4>
          <div className="space-y-2">
            {allDayEvents.map((event) => (
              <motion.div
                key={event.id}
                className={`p-3 rounded-lg text-white cursor-pointer ${getEventTypeColor(event.type)}`}
                whileHover={{ scale: 1.02 }}
                onClick={() => onEditEvent(event)}
              >
                <div className="font-medium">{event.title}</div>
                {event.description && (
                  <div className="text-sm opacity-90 mt-1">{event.description}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Time slots */}
      <div className="relative">
        <div className="space-y-0">
          {hours.map((hour) => (
            <div key={hour} className="flex">
              {/* Hour label */}
              <div className="w-20 flex-shrink-0 text-right pr-4 text-sm text-surface-500 dark:text-surface-400 h-16 flex items-start pt-2">
                {format(setHours(new Date(), hour), 'h a')}
              </div>
              
              {/* Time blocks */}
              <div className="flex-1 relative">
                {/* 30-minute slots */}
                {[0, 30].map((minute) => (
                  <motion.div
                    key={`${hour}-${minute}`}
                    className="h-8 border-t border-surface-200 dark:border-surface-700 cursor-pointer hover:bg-primary/5 transition-colors"
                    whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                    onClick={() => handleTimeSlotClick(hour, minute)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Events overlay */}
        <div className="absolute top-0 left-20 right-0">
          {dayEvents.map((event) => {
            const style = getEventStyle(event)
            return (
              <motion.div
                key={event.id}
                className={`absolute left-2 right-2 p-3 rounded-lg text-white cursor-pointer border-l-4 shadow-lg ${getEventTypeColor(event.type)}`}
                style={style}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                onClick={() => onEditEvent(event)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm opacity-90">
                  {format(parseISO(event.startTime), 'h:mm a')} - {format(parseISO(event.endTime), 'h:mm a')}
                </div>
                {event.location && (
                  <div className="text-sm opacity-75 mt-1">{event.location}</div>
                )}
                {event.description && (
                  <div className="text-sm opacity-75 mt-1 line-clamp-2">{event.description}</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-surface-500 dark:text-surface-400 text-center py-4 border-t border-surface-200 dark:border-surface-700">
        Click on any time slot to create a new event
      </div>
    </div>
  )
}