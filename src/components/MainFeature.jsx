import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, differenceInDays } from 'date-fns'
import ApperIcon from './ApperIcon'

export default function MainFeature({ activeModule }) {
  const dispatch = useDispatch()
  const { tasks, habits, goals, notes } = useSelector(state => state)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const id = Date.now().toString()

    if (activeModule === 'tasks') {
      if (!formData.title?.trim()) {
        toast.error("Task title is required")
        return
      }
      
      const newTask = {
        id,
        title: formData.title,
        description: formData.description || "",
        completed: false,
        priority: formData.priority || 'medium',
        dueDate: formData.dueDate || null,
        createdAt: new Date()
      }
      
      dispatch({ type: 'ADD_TASK', payload: newTask })
      toast.success("Task created successfully!")
    } 
    else if (activeModule === 'habits') {
      if (!formData.name?.trim()) {
        toast.error("Habit name is required")
        return
      }
      
      const newHabit = {
        id,
        name: formData.name,
        frequency: formData.frequency || 'daily',
        targetCount: parseInt(formData.targetCount) || 1,
        currentStreak: 0,
        longestStreak: 0,
        completions: [],
        createdAt: new Date()
      }
      
      dispatch({ type: 'ADD_HABIT', payload: newHabit })
      toast.success("Habit created successfully!")
    }
    else if (activeModule === 'goals') {
      if (!formData.title?.trim()) {
        toast.error("Goal title is required")
        return
      }
      
      const newGoal = {
        id,
        title: formData.title,
        description: formData.description || "",
        targetDate: formData.targetDate || null,
        progress: 0,
        category: formData.category || 'personal',
        status: 'active',
        createdAt: new Date()
      }
      
      dispatch({ type: 'ADD_GOAL', payload: newGoal })
      toast.success("Goal created successfully!")
    }

    setFormData({})
    setShowForm(false)
  }

  const toggleTask = (taskId) => {
    dispatch({ type: 'TOGGLE_TASK', payload: taskId })
    toast.success("Task updated!")
  }

  const markHabitComplete = (habitId) => {
    dispatch({ type: 'MARK_HABIT_COMPLETE', payload: { id: habitId } })
    toast.success("Habit marked complete! 🎉")
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'low': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      default: return 'text-surface-600 bg-surface-50 border-surface-200 dark:bg-surface-700 dark:border-surface-600'
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

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Add Button */}
      <motion.button
        onClick={() => setShowForm(!showForm)}
        className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 lg:px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ApperIcon name={showForm ? 'X' : 'Plus'} size={20} />
        <span>
          {showForm ? 'Cancel' : `Add ${activeModule.slice(0, -1).charAt(0).toUpperCase() + activeModule.slice(1, -1)}`}
        </span>
      </motion.button>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-surface-200 dark:border-surface-700"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={activeModule === 'tasks' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    {activeModule === 'habits' ? 'Habit Name' : 'Title'}
                  </label>
                  <input
                    type="text"
                    value={formData.title || formData.name || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      [activeModule === 'habits' ? 'name' : 'title']: e.target.value
                    })}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder={`Enter ${activeModule === 'habits' ? 'habit name' : 'title'}...`}
                  />
                </div>

                {activeModule !== 'habits' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                      rows="3"
                      placeholder="Enter description..."
                    />
                  </div>
                )}

                {activeModule === 'tasks' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
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
      <div className="space-y-3 lg:space-y-4">
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