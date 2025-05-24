import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, startOfWeek, addDays, isToday } from 'date-fns'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import Calendar from '../components/Calendar/Calendar'
import Notes from '../components/Notes/Notes'
import Analytics from '../components/Analytics/Analytics'
import Finance from '../components/Finance/Finance'

export default function Home() {
  const dispatch = useDispatch()
  const { tasks, habits, goals, darkMode } = useSelector(state => state)
  const [activeModule, setActiveModule] = useState('overview')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' })
    toast.success(`Switched to ${darkMode ? 'light' : 'dark'} mode`)
  }

  const modules = [
    { id: 'overview', label: 'Overview', icon: 'Grid3X3' },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
    { id: 'habits', label: 'Habits', icon: 'Target' },
    { id: 'goals', label: 'Goals', icon: 'Trophy' },
    { id: 'calendar', label: 'Calendar', icon: 'Calendar' },
    { id: 'notes', label: 'Notes', icon: 'FileText' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'finance', label: 'Finance', icon: 'DollarSign' }
  ]

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const activeHabits = habits.filter(habit => 
    habit.lastCompleted && isToday(new Date(habit.lastCompleted))
  ).length

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(new Date()), i)
    return {
      date,
      day: format(date, 'EEE'),
      dayNum: format(date, 'd'),
      isToday: isToday(date)
    }
  })

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Navigation */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed lg:relative lg:flex w-64 h-screen bg-white/90 dark:bg-surface-800/90 backdrop-blur-xl border-r border-surface-200 dark:border-surface-700 z-40 lg:z-auto transform -translate-x-full lg:translate-x-0 transition-transform duration-300"
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Brain" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">MindGrid</h1>
                <p className="text-xs text-surface-600 dark:text-surface-400">Your Second Brain</p>
              </div>
            </motion.div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-all duration-200"
            >
              <ApperIcon name={darkMode ? 'Sun' : 'Moon'} size={16} />
            </button>
          </div>

          {/* Time Display */}
          <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
            <div className="text-2xl font-bold text-surface-800 dark:text-surface-200">
              {format(currentTime, 'HH:mm')}
            </div>
            <div className="text-sm text-surface-600 dark:text-surface-400">
              {format(currentTime, 'EEEE, MMMM d')}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            <motion.div 
              className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {completedTasks}/{totalTasks}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-500">Tasks Done</div>
                </div>
                <ApperIcon name="CheckCircle" className="text-green-500" size={20} />
              </div>
            </motion.div>

            <motion.div 
              className="p-4 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {activeHabits}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-500">Habits Today</div>
                </div>
                <ApperIcon name="Zap" className="text-blue-500" size={20} />
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {modules.map((module) => (
              <motion.button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  activeModule === module.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                }`}
                whileHover={{ x: activeModule === module.id ? 0 : 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <ApperIcon name={module.icon} size={18} />
                <span className="font-medium">{module.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 min-h-screen bg-grid-pattern bg-[size:20px_20px]">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <h2 className="text-3xl xl:text-4xl font-bold text-surface-800 dark:text-surface-200 mb-2">
              {modules.find(m => m.id === activeModule)?.label}
            </h2>
            <p className="text-surface-600 dark:text-surface-400">
              {activeModule === 'overview' && "Get a bird's eye view of your productivity"}
              {activeModule === 'tasks' && "Manage your daily tasks and priorities"}
              {activeModule === 'habits' && "Track your habits and build streaks"}
              {activeModule === 'goals' && "Set and achieve your long-term goals"}
              {activeModule === 'calendar' && "Plan your schedule and appointments"}
              {activeModule === 'notes' && "Capture ideas and organize your thoughts"}
              {activeModule === 'analytics' && "Track your productivity and insights"}
              {activeModule === 'finance' && "Manage your finances and track spending"}
            </p>
          </motion.div>

          {/* Module Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="content-container"
            >
              {activeModule === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Weekly Calendar */}
                  <div className="lg:col-span-2 xl:col-span-3 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <ApperIcon name="Calendar" className="mr-3 text-primary" size={20} />
                      This Week
                    </h3>
                    <div className="grid grid-cols-7 gap-4">
                      {weekDays.map((day, index) => (
                        <motion.div
                          key={index}
                          className={`text-center p-4 rounded-xl border transition-all duration-200 ${
                            day.isToday
                              ? 'bg-gradient-to-br from-primary to-secondary text-white border-primary shadow-lg'
                              : 'bg-surface-50 dark:bg-surface-700 border-surface-200 dark:border-surface-600 hover:border-primary/50'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="text-sm font-medium">{day.day}</div>
                          <div className="text-xl font-bold mt-1">{day.dayNum}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(activeModule === 'tasks' || activeModule === 'habits' || activeModule === 'goals') && (
                <MainFeature activeModule={activeModule} />
              )}

              {activeModule === 'calendar' && (
                <Calendar />
              )}

              {activeModule === 'notes' && (
                <Notes />
              )}
              
              {activeModule === 'analytics' && (
                <Analytics />
              )}
              
              {activeModule === 'finance' && (
                <Finance />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}