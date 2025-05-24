import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
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

export default function WeekView({ currentDate, onCreateEvent, onEditEvent }) {
  const { events } = useSelector(state => state)

  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(currentDate)
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
  
  const hours = Array.from({ length: 17 }, (_, i) => i + 6) // 6 AM to 10 PM

  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = parseISO(event.startTime)
      return isSameDay(eventDate, day) && !event.isAllDay
    })
  }

  const getAllDayEvents = (day) => {
    return events.filter(event => {
      const eventDate = parseISO(event.startTime)
      return isSameDay(eventDate, day) && event.isAllDay
    })
  }

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

  const handleTimeSlotClick = (day, hour) => {
    const selectedDateTime = setMinutes(setHours(day, hour), 0)
    onCreateEvent(day, selectedDateTime)
  }

  return (
    <div className="space-y-4">
      {/* All-day events section */}
      <div className="border-b border-surface-200 dark:border-surface-700 pb-4">
        <div className="grid grid-cols-8 gap-1">
          <div className="text-sm font-medium text-surface-600 dark:text-surface-400 p-2">
            All Day
          </div>
          {weekDays.map((day) => {
            const allDayEvents = getAllDayEvents(day)
            return (
              <div key={day.toISOString()} className="min-h-[60px] p-1">
                {allDayEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className={`text-xs p-2 rounded text-white mb-1 cursor-pointer ${getEventTypeColor(event.type)}`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onEditEvent(event)}
                  >
                    {event.title}
                  </motion.div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Week header */}
      <div className="grid grid-cols-8 gap-1">
        <div className="p-2"></div>
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={`text-center p-2 rounded-lg ${
              isToday(day)
                ? 'bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold'
                : 'text-surface-700 dark:text-surface-300'
            }`}
          >
            <div className="text-sm font-medium">{format(day, 'EEE')}</div>
            <div className="text-lg font-bold">{format(day, 'd')}</div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="relative">
        <div className="grid grid-cols-8 gap-1">
          {/* Time labels */}
          <div className="space-y-0">
            {hours.map((hour) => (
              <div key={hour} className="h-16 flex items-start justify-end pr-2 text-sm text-surface-500 dark:text-surface-400">
                {format(setHours(new Date(), hour), 'h a')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(day)
            
            return (
              <div key={day.toISOString()} className="relative">
                {/* Time slots */}
                {hours.map((hour) => (
                  <motion.div
                    key={hour}
                    className="h-16 border-t border-surface-200 dark:border-surface-700 cursor-pointer hover:bg-primary/5 transition-colors"
                    whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                    onClick={() => handleTimeSlotClick(day, hour)}
                  />
                ))}

                {/* Events */}
                {dayEvents.map((event) => {
                  const style = getEventStyle(event)
                  return (
                    <motion.div
                      key={event.id}
                      className={`absolute left-1 right-1 p-1 rounded text-white text-xs cursor-pointer border-l-4 ${getEventTypeColor(event.type)}`}
                      style={style}
                      whileHover={{ scale: 1.02, zIndex: 10 }}
                      onClick={() => onEditEvent(event)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-xs opacity-90 truncate">
                        {format(parseISO(event.startTime), 'h:mm a')} - {format(parseISO(event.endTime), 'h:mm a')}
                      </div>
                      {event.location && (
                        <div className="text-xs opacity-75 truncate">{event.location}</div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-surface-500 dark:text-surface-400 text-center py-2 border-t border-surface-200 dark:border-surface-700">
        Click on any time slot to create a new event
      </div>
    </div>
  )
}