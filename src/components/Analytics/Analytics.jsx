import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2'
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval, parseISO, differenceInDays, isToday, startOfMonth, endOfMonth } from 'date-fns'
import ApperIcon from '../ApperIcon'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Analytics() {
  const { tasks, habits, goals, analytics, darkMode } = useSelector(state => state)
  const [timeRange, setTimeRange] = useState('week') // week, month, quarter
  const [activeTab, setActiveTab] = useState('overview')

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const now = new Date()
    let startDate, endDate

    switch (timeRange) {
      case 'week':
        startDate = startOfWeek(now)
        endDate = endOfWeek(now)
        break
      case 'month':
        startDate = startOfMonth(now)
        endDate = endOfMonth(now)
        break
      case 'quarter':
        startDate = subDays(now, 90)
        endDate = now
        break
      default:
        startDate = startOfWeek(now)
        endDate = endOfWeek(now)
    }

    // Task Analytics
    const completedTasks = tasks.filter(task => task.completed).length
    const totalTasks = tasks.length
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    // Habit Analytics
    const activeHabits = habits.filter(habit => 
      habit.lastCompleted && isToday(new Date(habit.lastCompleted))
    ).length
    const totalHabits = habits.length
    const habitCompletionRate = totalHabits > 0 ? (activeHabits / totalHabits) * 100 : 0

    // Calculate average habit streak
    const avgHabitStreak = habits.length > 0 
      ? habits.reduce((sum, habit) => sum + (habit.currentStreak || 0), 0) / habits.length
      : 0

    // Goal Analytics
    const completedGoals = goals.filter(goal => goal.completed).length
    const totalGoals = goals.length
    const goalCompletionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0

    // Calculate goal progress average
    const avgGoalProgress = goals.length > 0
      ? goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / goals.length
      : 0

    // Module time tracking (simulated data based on analytics)
    const moduleTime = analytics?.moduleTime || {
      tasks: Math.floor(Math.random() * 120) + 60,
      habits: Math.floor(Math.random() * 60) + 30,
      goals: Math.floor(Math.random() * 90) + 45,
      calendar: Math.floor(Math.random() * 75) + 40,
      notes: Math.floor(Math.random() * 100) + 50,
      overview: Math.floor(Math.random() * 45) + 20
    }

    // Generate trend data for the selected time range
    const days = differenceInDays(endDate, startDate) + 1
    const trendData = Array.from({ length: days }, (_, i) => {
      const date = subDays(endDate, days - 1 - i)
      return {
        date: format(date, 'MMM dd'),
        tasks: Math.floor(Math.random() * 10) + 5,
        habits: Math.floor(Math.random() * 8) + 3,
        goals: Math.floor(Math.random() * 5) + 2
      }
    })

    // Productivity score calculation
    const productivityScore = Math.round(
      (taskCompletionRate * 0.4 + habitCompletionRate * 0.3 + goalCompletionRate * 0.3)
    )

    return {
      taskCompletionRate,
      habitCompletionRate,
      goalCompletionRate,
      avgHabitStreak,
      avgGoalProgress,
      moduleTime,
      trendData,
      productivityScore,
      totalTasks,
      totalHabits,
      totalGoals,
      completedTasks,
      activeHabits,
      completedGoals
    }
  }, [tasks, habits, goals, analytics, timeRange])

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#e2e8f0' : '#475569',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        titleColor: darkMode ? '#e2e8f0' : '#0f172a',
        bodyColor: darkMode ? '#cbd5e1' : '#475569',
        borderColor: darkMode ? '#475569' : '#e2e8f0',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b'
        },
        grid: {
          color: darkMode ? '#374151' : '#f1f5f9'
        }
      },
      y: {
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b'
        },
        grid: {
          color: darkMode ? '#374151' : '#f1f5f9'
        }
      }
    }
  }

  const trendChartData = {
    labels: analyticsData.trendData.map(d => d.date),
    datasets: [
      {
        label: 'Tasks Completed',
        data: analyticsData.trendData.map(d => d.tasks),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Habits Completed',
        data: analyticsData.trendData.map(d => d.habits),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Goals Progress',
        data: analyticsData.trendData.map(d => d.goals),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const moduleTimeData = {
    labels: ['Tasks', 'Habits', 'Goals', 'Calendar', 'Notes', 'Overview'],
    datasets: [
      {
        data: [
          analyticsData.moduleTime.tasks,
          analyticsData.moduleTime.habits,
          analyticsData.moduleTime.goals,
          analyticsData.moduleTime.calendar,
          analyticsData.moduleTime.notes,
          analyticsData.moduleTime.overview
        ],
        backgroundColor: [
          '#6366f1',
          '#10b981',
          '#f59e0b',
          '#06b6d4',
          '#8b5cf6',
          '#ef4444'
        ],
        borderWidth: 2,
        borderColor: darkMode ? '#1e293b' : '#ffffff'
      }
    ]
  }

  const completionRateData = {
    labels: ['Tasks', 'Habits', 'Goals'],
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: [
          analyticsData.taskCompletionRate,
          analyticsData.habitCompletionRate,
          analyticsData.goalCompletionRate
        ],
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'trends', label: 'Trends', icon: 'TrendingUp' },
    { id: 'modules', label: 'Module Usage', icon: 'PieChart' },
    { id: 'insights', label: 'Insights', icon: 'Brain' }
  ]

  const timeRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ]

  const ProgressRing = ({ percentage, size = 120, strokeWidth = 8, color = '#6366f1' }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = `${circumference} ${circumference}`
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={darkMode ? '#374151' : '#e5e7eb'}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-surface-800 dark:text-surface-200">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-surface-800 dark:text-surface-200">
            Analytics Dashboard
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Track your productivity and insights
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-surface-100 dark:bg-surface-800 rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                timeRange === range.value
                  ? 'bg-white dark:bg-surface-700 text-primary shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-surface-200 dark:border-surface-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Productivity Score */}
            <div className="xl:col-span-2 bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200">
                  Productivity Score
                </h3>
                <ApperIcon name="Target" className="text-primary" size={20} />
              </div>
              <div className="flex items-center justify-center">
                <ProgressRing 
                  percentage={analyticsData.productivityScore} 
                  size={140}
                  color="#6366f1"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  Based on task completion, habit consistency, and goal progress
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-surface-600 dark:text-surface-400">Tasks</h4>
                  <ApperIcon name="CheckSquare" className="text-blue-500" size={16} />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-surface-800 dark:text-surface-200">
                    {analyticsData.completedTasks}/{analyticsData.totalTasks}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${analyticsData.taskCompletionRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-surface-600 dark:text-surface-400">
                      {Math.round(analyticsData.taskCompletionRate)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-surface-600 dark:text-surface-400">Habits</h4>
                  <ApperIcon name="Target" className="text-green-500" size={16} />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-surface-800 dark:text-surface-200">
                    {analyticsData.activeHabits}/{analyticsData.totalHabits}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${analyticsData.habitCompletionRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-surface-600 dark:text-surface-400">
                      {Math.round(analyticsData.habitCompletionRate)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-surface-600 dark:text-surface-400">Goals</h4>
                  <ApperIcon name="Trophy" className="text-yellow-500" size={16} />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-surface-800 dark:text-surface-200">
                    {analyticsData.completedGoals}/{analyticsData.totalGoals}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${analyticsData.goalCompletionRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-surface-600 dark:text-surface-400">
                      {Math.round(analyticsData.goalCompletionRate)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-surface-600 dark:text-surface-400">Avg Streak</h4>
                  <ApperIcon name="Zap" className="text-orange-500" size={16} />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-surface-800 dark:text-surface-200">
                    {Math.round(analyticsData.avgHabitStreak)} days
                  </div>
                  <div className="text-sm text-surface-600 dark:text-surface-400">
                    Habit consistency
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Rates Chart */}
            <div className="xl:col-span-4 bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-4">
                Completion Rates
              </h3>
              <div className="h-64">
                <Bar data={completionRateData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-4">
                Productivity Trends
              </h3>
              <div className="h-96">
                <Line data={trendChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-4">
                Time Spent by Module
              </h3>
              <div className="h-64">
                <Doughnut data={moduleTimeData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-4">
                Module Usage Details
              </h3>
              <div className="space-y-4">
                {Object.entries(analyticsData.moduleTime).map(([module, time]) => (
                  <div key={module} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" 
                           style={{ backgroundColor: moduleTimeData.datasets[0].backgroundColor[Object.keys(analyticsData.moduleTime).indexOf(module)] }} />
                      <span className="capitalize text-surface-700 dark:text-surface-300">{module}</span>
                    </div>
                    <span className="text-surface-600 dark:text-surface-400">{time} min</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-4 flex items-center">
                <ApperIcon name="TrendingUp" className="mr-2 text-green-500" size={20} />
                Positive Insights
              </h3>
              <div className="space-y-4">
                {analyticsData.taskCompletionRate > 70 && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-800 dark:text-green-300">
                      Great job! You're completing {Math.round(analyticsData.taskCompletionRate)}% of your tasks.
                    </p>
                  </div>
                )}
                {analyticsData.avgHabitStreak > 5 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-blue-800 dark:text-blue-300">
                      Excellent habit consistency! Your average streak is {Math.round(analyticsData.avgHabitStreak)} days.
                    </p>
                  </div>
                )}
                {analyticsData.productivityScore > 80 && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-purple-800 dark:text-purple-300">
                      Outstanding productivity score of {analyticsData.productivityScore}%!
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-4 flex items-center">
                <ApperIcon name="Target" className="mr-2 text-orange-500" size={20} />
                Improvement Areas
              </h3>
              <div className="space-y-4">
                {analyticsData.taskCompletionRate < 50 && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-yellow-800 dark:text-yellow-300">
                      Consider breaking down tasks into smaller, manageable pieces to improve completion rate.
                    </p>
                  </div>
                )}
                {analyticsData.habitCompletionRate < 60 && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <p className="text-orange-800 dark:text-orange-300">
                      Try setting reminders or reducing the number of habits to focus on consistency.
                    </p>
                  </div>
                )}
                {analyticsData.goalCompletionRate < 40 && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-red-800 dark:text-red-300">
                      Review your goals and make sure they're specific, measurable, and achievable.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}