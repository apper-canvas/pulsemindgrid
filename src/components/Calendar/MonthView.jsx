import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  isToday,
  parseISO
} from 'date-fns'

export default function MonthView({ currentDate, onCreateEvent, onEditEvent }) {
  const { events } = useSelector(state => state)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = parseISO(event.startTime)
      return isSameDay(eventDate, day)
    }).slice(0, 3) // Show max 3 events per day
  }

  const getEventTypeColor = (type) => {
    const colors = {
      meeting: 'bg-blue-500',
      work: 'bg-green-500',
      personal: 'bg-purple-500',
      appointment: 'bg-orange-500',
      reminder: 'bg-red-500',
      other: 'bg-gray-500'
    }
    return colors[type] || colors.other
  }

  return (
    <div className="space-y-4">
      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 lg:gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-semibold text-surface-600 dark:text-surface-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 lg:gap-2">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isDayToday = isToday(day)
          const hasMoreEvents = events.filter(event => {
            const eventDate = parseISO(event.startTime)
            return isSameDay(eventDate, day)
          }).length > 3

          return (
            <motion.div
              key={day.toISOString()}
              className={`min-h-[100px] lg:min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                isDayToday
                  ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary shadow-md'
                  : isCurrentMonth
                  ? 'bg-white dark:bg-surface-700 border-surface-200 dark:border-surface-600 hover:border-primary/50 hover:shadow-md'
                  : 'bg-surface-50 dark:bg-surface-800 border-surface-100 dark:border-surface-700 opacity-60'
              }`}
              whileHover={isCurrentMonth ? { scale: 1.02 } : {}}
              onClick={() => isCurrentMonth && onCreateEvent(day)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
            >
              {/* Day Number */}
              <div className={`text-sm lg:text-base font-semibold mb-1 ${
                isDayToday
                  ? 'text-primary'
                  : isCurrentMonth
                  ? 'text-surface-800 dark:text-surface-200'
                  : 'text-surface-400 dark:text-surface-600'
              }`}>
                {format(day, 'd')}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.map((event, eventIndex) => (
                  <motion.div
                    key={event.id}
                    className={`text-xs p-1 rounded text-white truncate cursor-pointer ${getEventTypeColor(event.type)}`}
                    whileHover={{ scale: 1.05 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditEvent(event)
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.01) + (eventIndex * 0.05) }}
                  >
                    {event.isAllDay ? event.title : `${format(parseISO(event.startTime), 'HH:mm')} ${event.title}`}
                  </motion.div>
                ))}
                
                {hasMoreEvents && (
                  <div className="text-xs text-surface-500 dark:text-surface-400 font-medium">
                    +{events.filter(event => {
                      const eventDate = parseISO(event.startTime)
                      return isSameDay(eventDate, day)
                    }).length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-surface-600 dark:text-surface-400">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Meetings</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Work</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span>Personal</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span>Appointments</span>
        </div>
      </div>
    </div>
  )
}