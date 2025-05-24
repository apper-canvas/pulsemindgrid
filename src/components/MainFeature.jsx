import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, differenceInDays } from 'date-fns'
import ApperIcon from './ApperIcon'

export default function MainFeature({ activeModule }) {
  const dispatch = useDispatch()
  ChevronRight,
  Menu,
  X
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const id = Date.now().toString()

    if (activeModule === 'tasks') {
      if (!formData.title?.trim()) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
        toast.error("Task title is required")
        return
      }
      
      const newTask = {
        id,
      component: 'dashboard',
      gradient: 'from-blue-500 to-purple-600',
      description: 'Overview and insights',
      stats: {
        count: '4',
        label: 'Active'
      }
        description: formData.description || "",
        completed: false,
        priority: formData.priority || 'medium',
        dueDate: formData.dueDate || null,
        createdAt: new Date()
      }
      
      dispatch({ type: 'ADD_TASK', payload: newTask })
      gradient: 'from-green-500 to-teal-600',
      description: 'Capture your thoughts',
      stats: {
        count: '12',
        label: 'Notes'
      },
      toast.success("Task created successfully!")
        { id: 'all-notes', label: 'All Notes', icon: FileText },
        { id: 'recent', label: 'Recent', icon: Clock },
        { id: 'favorites', label: 'Favorites', icon: Heart },
        { id: 'archive', label: 'Archive', icon: Archive }
        return
      }
    {
      id: 'divider-1',
      type: 'divider'
    },
      
      const newHabit = {
        id,
        name: formData.name,
        frequency: formData.frequency || 'daily',
        targetCount: parseInt(formData.targetCount) || 1,
      gradient: 'from-orange-500 to-red-600',
      description: 'Manage your schedule',
      stats: {
        count: '3',
        label: 'Today'
      },
        currentStreak: 0,
        { id: 'month-view', label: 'Month View', icon: Calendar },
        { id: 'week-view', label: 'Week View', icon: CalendarDays },
        { id: 'day-view', label: 'Day View', icon: CalendarCheck },
        { id: 'agenda', label: 'Agenda', icon: List }
      
      dispatch({ type: 'ADD_HABIT', payload: newHabit })
    {
      id: 'divider-2',
      type: 'divider'
    },
      toast.success("Habit created successfully!")
    }
    else if (activeModule === 'goals') {
      if (!formData.title?.trim()) {
        toast.error("Goal title is required")
        return
      }
      gradient: 'from-emerald-500 to-cyan-600',
      description: 'Track your finances',
      stats: {
        count: '$2.4k',
        label: 'Balance'
      },
      
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'transactions', label: 'Transactions', icon: Receipt },
        { id: 'budgets', label: 'Budgets', icon: PiggyBank },
        { id: 'reports', label: 'Reports', icon: FileBarChart }
        targetDate: formData.targetDate || null,
        progress: 0,
        category: formData.category || 'personal',
        status: 'active',
        createdAt: new Date()
      }
      component: 'analytics',
      gradient: 'from-violet-500 to-purple-600',
      description: 'Data insights',
      stats: {
        count: '89%',
        label: 'Growth'
      }
      dispatch({ type: 'ADD_GOAL', payload: newGoal })
    {
      id: 'divider-3',
      type: 'divider'
    },
      toast.success("Goal created successfully!")
    }

    setFormData({})
    setShowForm(false)
  }

  const toggleTask = (taskId) => {
      gradient: 'from-gray-500 to-slate-600',
      description: 'App preferences',
      stats: {
        count: '6',
        label: 'Items'
      },
    dispatch({ type: 'TOGGLE_TASK', payload: taskId })
        { id: 'general', label: 'General', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'integrations', label: 'Integrations', icon: Plug }
    dispatch({ type: 'MARK_HABIT_COMPLETE', payload: { id: habitId } })
    toast.success("Habit marked complete! 🎉")
    {
      id: 'divider-4',
      type: 'divider'
    },
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'low': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      default: return 'text-surface-600 bg-surface-50 border-surface-200 dark:bg-surface-700 dark:border-surface-600'
    }
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    if (isCollapsed) {
      setActiveSubMenu(null)
    }
  }

  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      case 'active': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      case 'paused': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
      default: return 'text-surface-600 bg-surface-50 border-surface-200 dark:bg-surface-700 dark:border-surface-600'
    }
  }

  const getLinkedNotes = (itemId, itemType) => {
    return notes.filter(note => 
      (itemType === 'task' && note.linkedTasks?.includes(itemId)) ||
      (itemType === 'goal' && note.linkedGoals?.includes(itemId))
    )
  }

  const sidebarVariants = {
    expanded: { width: '320px' },
    collapsed: { width: '80px' }
  }

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex">
        {/* Enhanced Sidebar */}
        <motion.div 
          className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 min-h-screen overflow-hidden"
          variants={sidebarVariants}
          animate={isCollapsed ? 'collapsed' : 'expanded'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          
          <div className="relative z-10 p-6">
            {/* Header with Toggle */}
            <div className="flex items-center justify-between mb-8">
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    variants={contentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        >
          <ApperIcon name={showForm ? 'X' : 'Plus'} size={20} />
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
            {showForm ? 'Cancel' : `Add ${activeModule.slice(0, -1).charAt(0).toUpperCase() + activeModule.slice(1, -1)}`}
          </span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.button
                onClick={toggleCollapse}
                className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCollapsed ? <Menu size={18} /> : <X size={18} />}
              </motion.button>
        </motion.button>
      </div>

            <nav className="space-y-1">
      <AnimatePresence>
                <div key={item.id} className="relative">
                  {item.type === 'divider' ? (
                    !isCollapsed && (
                      <div className="my-4 border-t border-slate-200/60 dark:border-slate-700/60" />
                    )
                  ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
                    className={`group w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'justify-between px-4'} py-4 rounded-2xl text-left transition-all duration-300 relative overflow-hidden ${
                      activeComponent === item.component
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-indigo-500/25 transform scale-[1.02]`
                        : 'text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 dark:hover:from-slate-800/50 dark:hover:to-slate-700/30'
                    }`}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hover Effect Overlay */}
                    {hoveredItem === item.id && activeComponent !== item.component && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 rounded-2xl`}
                        layoutId="hoverOverlay"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} relative z-10`}>
                      <div className={`p-2 rounded-xl ${activeComponent === item.component ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'} transition-all duration-200`}>
                        <item.icon size={isCollapsed ? 24 : 20} className={activeComponent === item.component ? 'text-white' : 'text-slate-600 dark:text-slate-400'} />
                      </div>
                      
                      <AnimatePresence mode="wait">
                        {!isCollapsed && (
                          <motion.div
                            className="flex-1 min-w-0"
                            variants={contentVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-sm">{item.label}</span>
                                <p className={`text-xs mt-0.5 ${activeComponent === item.component ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                                  {item.description}
                                </p>
                              </div>
                              
                              {item.stats && (
                                <div className="text-right">
                                  <div className={`text-xs font-bold ${activeComponent === item.component ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                                    {item.stats.count}
                                  </div>
                                  <div className={`text-xs ${activeComponent === item.component ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {item.stats.label}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                  </label>
                    
                    {!isCollapsed && item.hasSubmenu && (
                      <motion.div
                        className="relative z-10"
                        animate={{ rotate: activeSubMenu === item.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={16} className={activeComponent === item.component ? 'text-white/80' : 'text-slate-400'} />
                      </motion.div>
                    )}
                    placeholder={`Enter ${activeModule === 'habits' ? 'habit name' : 'title'}...`}
                  )}
                  
                </div>
                  <AnimatePresence>
                    {!isCollapsed && item.hasSubmenu && activeSubMenu === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 ml-6 space-y-1 overflow-hidden"
                      >
                        {item.submenu.map((subItem) => (
                          <motion.button
                            key={subItem.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2, delay: 0.05 }}
                            className="w-full flex items-center space-x-3 text-left px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 rounded-xl transition-all duration-200"
                          >
                            <subItem.icon size={16} />
                            <span>{subItem.label}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                    />
                  </div>
                )}
            
            {/* User Profile Section */}
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  transition={{ duration: 0.2 }}
                  className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-700/60"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">John Doe</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">john@mindgrid.app</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

        </motion.div>
                  <>
                    <div>
        <div className="flex-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm relative">
          {/* Content Background Pattern */}
          <div className="absolute inset-0 bg-grid-dots opacity-30 pointer-events-none" />
          
                        Priority
                      </label>
                      <select
                        value={formData.priority || 'medium'}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate || ''}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </>
                )}

                {activeModule === 'habits' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Frequency
                      </label>
                      <select
                        value={formData.frequency || 'daily'}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Target Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.targetCount || 1}
                        onChange={(e) => setFormData({ ...formData, targetCount: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </>
                )}

                {activeModule === 'goals' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category || 'personal'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      >
                        <option value="personal">Personal</option>
                        <option value="career">Career</option>
                        <option value="health">Health</option>
                        <option value="finance">Finance</option>
                        <option value="learning">Learning</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Target Date
                      </label>
                      <input
                        type="date"
                        value={formData.targetDate || ''}
                        onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <motion.button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create {activeModule.slice(0, -1).charAt(0).toUpperCase() + activeModule.slice(1, -1)}
                </motion.button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl font-medium hover:bg-surface-200 dark:hover:bg-surface-600 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items List */}
      <div className="space-y-4">
        {activeModule === 'tasks' && (
          <AnimatePresence>
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 lg:py-12 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl border border-surface-200 dark:border-surface-700"
              >
                <ApperIcon name="CheckSquare" size={48} className="mx-auto text-surface-400 mb-4" />
                <p className="text-surface-600 dark:text-surface-400">No tasks yet. Create your first task to get started!</p>
              </motion.div>
            ) : (
              tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl p-4 lg:p-6 border border-surface-200 dark:border-surface-700 transition-all duration-200 ${
                    task.completed ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                        }`}
                      >
                        {task.completed && <ApperIcon name="Check" size={12} className="text-white" />}
                      </button>
                      <div className="flex-1">
                        <h3 className={`font-medium text-surface-800 dark:text-surface-200 ${
                          task.completed ? 'line-through' : ''
                        }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-surface-600 dark:text-surface-400">
                              Due: {format(new Date(task.dueDate), 'MMM d')}
                            </span>
                          )}
                          {getLinkedNotes(task.id, 'task').length > 0 && (
                            <span className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                              <ApperIcon name="FileText" size={12} />
                              {getLinkedNotes(task.id, 'task').length} note{getLinkedNotes(task.id, 'task').length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}

        {activeModule === 'habits' && (
          <AnimatePresence>
            {habits.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 lg:py-12 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl border border-surface-200 dark:border-surface-700"
              >
                <ApperIcon name="Target" size={48} className="mx-auto text-surface-400 mb-4" />
                <p className="text-surface-600 dark:text-surface-400">No habits yet. Create your first habit to start building streaks!</p>
              </motion.div>
            ) : (
              habits.map((habit) => (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl p-4 lg:p-6 border border-surface-200 dark:border-surface-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-surface-800 dark:text-surface-200 mb-2">
                        {habit.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-surface-600 dark:text-surface-400">
                        <span className="flex items-center">
                          <ApperIcon name="Target" size={14} className="mr-1" />
                          {habit.frequency}
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="Flame" size={14} className="mr-1 text-orange-500" />
                          {habit.currentStreak} day streak
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="Award" size={14} className="mr-1 text-yellow-500" />
                          Best: {habit.longestStreak}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {habit.lastCompleted && isToday(new Date(habit.lastCompleted)) ? (
                        <span className="text-green-600 dark:text-green-400 font-medium text-sm">
                          ✓ Completed today
                        </span>
                      ) : (
                        <motion.button
                          onClick={() => markHabitComplete(habit.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Mark Complete
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}

        {activeModule === 'goals' && (
          <AnimatePresence>
            {goals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 lg:py-12 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl border border-surface-200 dark:border-surface-700"
              >
                <ApperIcon name="Trophy" size={48} className="mx-auto text-surface-400 mb-4" />
                <p className="text-surface-600 dark:text-surface-400">No goals yet. Set your first goal to start achieving greatness!</p>
              </motion.div>
            ) : (
              goals.map((goal) => (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl p-4 lg:p-6 border border-surface-200 dark:border-surface-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-surface-800 dark:text-surface-200 mb-2">
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
                          {goal.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-surface-600 dark:text-surface-400">
                        <span className={`px-2 py-1 rounded-full border text-xs ${getStatusColor(goal.status)}`}>
                          {goal.category}
                        </span>
                        {goal.targetDate && (
                          <span className="flex items-center">
                            <ApperIcon name="Calendar" size={14} className="mr-1" />
                            Due: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                          </span>
                        )}
                        {goal.targetDate && (
                          <span className="text-xs">
                            {differenceInDays(new Date(goal.targetDate), new Date())} days left
                          </span>
                        )}
                        {getLinkedNotes(goal.id, 'goal').length > 0 && (
                          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                            <ApperIcon name="FileText" size={12} />
                            {getLinkedNotes(goal.id, 'goal').length} note{getLinkedNotes(goal.id, 'goal').length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {goal.progress}%
                        </div>
                        <div className="w-20 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}