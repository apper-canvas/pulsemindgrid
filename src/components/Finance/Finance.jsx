import { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'
import ApperIcon from '../ApperIcon'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement)

export default function Finance() {
  const dispatch = useDispatch()
  const { budgets, expenses, income, financialGoals, expenseCategories } = useSelector(state => state.finance)
  const [activeView, setActiveView] = useState('dashboard')
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [budgetData, setBudgetData] = useState({
    category: '',
    amount: '',
    month: format(new Date(), 'yyyy-MM')
  })
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '',
    category: '',
    date: format(new Date(), 'yyyy-MM-dd')
  })
  const [incomeData, setIncomeData] = useState({
    description: '',
    amount: '',
    source: '',
    date: format(new Date(), 'yyyy-MM-dd')
  })
  const [goalData, setGoalData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'savings'
  })

  // Calculate financial metrics
  const currentMonthStart = startOfMonth(selectedMonth)
  const currentMonthEnd = endOfMonth(selectedMonth)
  
  const currentMonthExpenses = expenses.filter(expense => 
    isWithinInterval(new Date(expense.date), { start: currentMonthStart, end: currentMonthEnd })
  )
  
  const currentMonthIncome = income.filter(inc => 
    isWithinInterval(new Date(inc.date), { start: currentMonthStart, end: currentMonthEnd })
  )

  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalIncome = currentMonthIncome.reduce((sum, inc) => sum + inc.amount, 0)
  const netBalance = totalIncome - totalExpenses

  const budgetsByCategory = useMemo(() => {
    const monthKey = format(selectedMonth, 'yyyy-MM')
    return budgets.filter(budget => budget.month === monthKey)
  }, [budgets, selectedMonth])

  const expensesByCategory = useMemo(() => {
    return currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})
  }, [currentMonthExpenses])

  // Form handlers
  const handleBudgetSubmit = (e) => {
    e.preventDefault()
    if (!budgetData.category || !budgetData.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    const budget = {
      id: editingItem?.id || Date.now().toString(),
      category: budgetData.category,
      amount: parseFloat(budgetData.amount),
      month: budgetData.month,
      createdAt: editingItem?.createdAt || new Date().toISOString()
    }

    if (editingItem) {
      dispatch({ type: 'UPDATE_BUDGET', payload: budget })
      toast.success('Budget updated successfully!')
    } else {
      dispatch({ type: 'ADD_BUDGET', payload: budget })
      toast.success('Budget created successfully!')
    }

    setBudgetData({ category: '', amount: '', month: format(new Date(), 'yyyy-MM') })
    setShowBudgetForm(false)
    setEditingItem(null)
  }

  const handleExpenseSubmit = (e) => {
    e.preventDefault()
    if (!expenseData.description || !expenseData.amount || !expenseData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    const expense = {
      id: editingItem?.id || Date.now().toString(),
      description: expenseData.description,
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      date: expenseData.date,
      createdAt: editingItem?.createdAt || new Date().toISOString()
    }

    if (editingItem) {
      dispatch({ type: 'UPDATE_EXPENSE', payload: expense })
      toast.success('Expense updated successfully!')
    } else {
      dispatch({ type: 'ADD_EXPENSE', payload: expense })
      toast.success('Expense added successfully!')
    }

    setExpenseData({ description: '', amount: '', category: '', date: format(new Date(), 'yyyy-MM-dd') })
    setShowExpenseForm(false)
    setEditingItem(null)
  }

  const handleIncomeSubmit = (e) => {
    e.preventDefault()
    if (!incomeData.description || !incomeData.amount || !incomeData.source) {
      toast.error('Please fill in all required fields')
      return
    }

    const incomeRecord = {
      id: editingItem?.id || Date.now().toString(),
      description: incomeData.description,
      amount: parseFloat(incomeData.amount),
      source: incomeData.source,
      date: incomeData.date,
      createdAt: editingItem?.createdAt || new Date().toISOString()
    }

    if (editingItem) {
      dispatch({ type: 'UPDATE_INCOME', payload: incomeRecord })
      toast.success('Income updated successfully!')
    } else {
      dispatch({ type: 'ADD_INCOME', payload: incomeRecord })
      toast.success('Income added successfully!')
    }

    setIncomeData({ description: '', amount: '', source: '', date: format(new Date(), 'yyyy-MM-dd') })
    setShowIncomeForm(false)
    setEditingItem(null)
  }

  const handleGoalSubmit = (e) => {
    e.preventDefault()
    if (!goalData.title || !goalData.targetAmount) {
      toast.error('Please fill in all required fields')
      return
    }

    const goal = {
      id: editingItem?.id || Date.now().toString(),
      title: goalData.title,
      targetAmount: parseFloat(goalData.targetAmount),
      currentAmount: parseFloat(goalData.currentAmount) || 0,
      targetDate: goalData.targetDate,
      category: goalData.category,
      createdAt: editingItem?.createdAt || new Date().toISOString()
    }

    if (editingItem) {
      dispatch({ type: 'UPDATE_FINANCIAL_GOAL', payload: goal })
      toast.success('Goal updated successfully!')
    } else {
      dispatch({ type: 'ADD_FINANCIAL_GOAL', payload: goal })
      toast.success('Goal created successfully!')
    }

    setGoalData({ title: '', targetAmount: '', currentAmount: '', targetDate: '', category: 'savings' })
    setShowGoalForm(false)
    setEditingItem(null)
  }

  const handleEdit = (item, type) => {
    setEditingItem(item)
    if (type === 'budget') {
      setBudgetData({
        category: item.category,
        amount: item.amount.toString(),
        month: item.month
      })
      setShowBudgetForm(true)
    } else if (type === 'expense') {
      setExpenseData({
        description: item.description,
        amount: item.amount.toString(),
        category: item.category,
        date: item.date
      })
      setShowExpenseForm(true)
    } else if (type === 'income') {
      setIncomeData({
        description: item.description,
        amount: item.amount.toString(),
        source: item.source,
        date: item.date
      })
      setShowIncomeForm(true)
    } else if (type === 'goal') {
      setGoalData({
        title: item.title,
        targetAmount: item.targetAmount.toString(),
        currentAmount: item.currentAmount.toString(),
        targetDate: item.targetDate,
        category: item.category
      })
      setShowGoalForm(true)
    }
  }

  const handleDelete = (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'budget') {
        dispatch({ type: 'DELETE_BUDGET', payload: id })
      } else if (type === 'expense') {
        dispatch({ type: 'DELETE_EXPENSE', payload: id })
      } else if (type === 'income') {
        dispatch({ type: 'DELETE_INCOME', payload: id })
      } else if (type === 'goal') {
        dispatch({ type: 'DELETE_FINANCIAL_GOAL', payload: id })
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`)
    }
  }

  // Chart configurations
  const budgetVsExpensesData = {
    labels: expenseCategories,
    datasets: [
      {
        label: 'Budget',
        data: expenseCategories.map(category => {
          const budget = budgetsByCategory.find(b => b.category === category)
          return budget ? budget.amount : 0
        }),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
      },
      {
        label: 'Actual Spending',
        data: expenseCategories.map(category => expensesByCategory[category] || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      }
    ]
  }

  const expensePieData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
          '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#64748b'
        ]
      }
    ]
  }

  const views = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { id: 'budgets', label: 'Budgets', icon: 'Target' },
    { id: 'expenses', label: 'Expenses', icon: 'CreditCard' },
    { id: 'income', label: 'Income', icon: 'TrendingUp' },
    { id: 'goals', label: 'Goals', icon: 'Trophy' },
    { id: 'analytics', label: 'Analytics', icon: 'PieChart' }
  ]

  return (
    <div className="space-y-6">
      {/* View Navigation */}
      <div className="flex flex-wrap gap-2">
        {views.map(view => (
          <motion.button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeView === view.id
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name={view.icon} size={16} />
            <span className="text-sm font-medium">{view.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
          className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          <ApperIcon name="ChevronLeft" size={20} />
        </button>
        <h3 className="text-lg font-semibold">
          {format(selectedMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setSelectedMonth(new Date())}
          className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm"
        >
          Current Month
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* Financial Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                        ${totalIncome.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-500">Total Income</div>
                    </div>
                    <ApperIcon name="TrendingUp" className="text-green-500" size={24} />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                        ${totalExpenses.toLocaleString()}
                      </div>
                      <div className="text-sm text-red-600 dark:text-red-500">Total Expenses</div>
                    </div>
                    <ApperIcon name="TrendingDown" className="text-red-500" size={24} />
                  </div>
                </motion.div>

                <motion.div 
                  className={`bg-gradient-to-br rounded-xl p-6 border ${
                    netBalance >= 0 
                      ? 'from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800'
                      : 'from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-2xl font-bold ${
                        netBalance >= 0 
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-orange-700 dark:text-orange-400'
                      }`}>
                        ${Math.abs(netBalance).toLocaleString()}
                      </div>
                      <div className={`text-sm ${
                        netBalance >= 0 
                          ? 'text-blue-600 dark:text-blue-500'
                          : 'text-orange-600 dark:text-orange-500'
                      }`}>
                        {netBalance >= 0 ? 'Net Surplus' : 'Net Deficit'}
                      </div>
                    </div>
                    <ApperIcon 
                      name={netBalance >= 0 ? 'DollarSign' : 'AlertTriangle'} 
                      className={netBalance >= 0 ? 'text-blue-500' : 'text-orange-500'} 
                      size={24} 
                    />
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <motion.button
                  onClick={() => setShowExpenseForm(true)}
                  className="flex items-center gap-2 p-4 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl border border-surface-200 dark:border-surface-700 hover:border-primary/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name="Plus" size={16} />
                  <span className="text-sm font-medium">Add Expense</span>
                </motion.button>

                <motion.button
                  onClick={() => setShowIncomeForm(true)}
                  className="flex items-center gap-2 p-4 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl border border-surface-200 dark:border-surface-700 hover:border-primary/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name="Plus" size={16} />
                  <span className="text-sm font-medium">Add Income</span>
                </motion.button>

                <motion.button
                  onClick={() => setShowBudgetForm(true)}
                  className="flex items-center gap-2 p-4 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl border border-surface-200 dark:border-surface-700 hover:border-primary/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name="Plus" size={16} />
                  <span className="text-sm font-medium">Set Budget</span>
                </motion.button>

                <motion.button
                  onClick={() => setShowGoalForm(true)}
                  className="flex items-center gap-2 p-4 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl border border-surface-200 dark:border-surface-700 hover:border-primary/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name="Plus" size={16} />
                  <span className="text-sm font-medium">Add Goal</span>
                </motion.button>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl p-6 border border-surface-200 dark:border-surface-700">
                  <h3 className="text-lg font-semibold mb-4">Budget vs Actual Spending</h3>
                  <Bar data={budgetVsExpensesData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
                </div>

                <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl p-6 border border-surface-200 dark:border-surface-700">
                  <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
                  {Object.keys(expensesByCategory).length > 0 ? (
                    <Pie data={expensePieData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
                  ) : (
                    <div className="flex items-center justify-center h-64 text-surface-500">
                      No expenses recorded this month
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Budgets View */}
          {activeView === 'budgets' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <motion.button
                  onClick={() => setShowBudgetForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name="Plus" size={16} />
                  New Budget
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgetsByCategory.map(budget => {
                  const spent = expensesByCategory[budget.category] || 0
                  const percentage = (spent / budget.amount) * 100
                  
                  return (
                    <motion.div
                      key={budget.id}
                      className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl p-6 border border-surface-200 dark:border-surface-700"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-surface-800 dark:text-surface-200">
                          {budget.category}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(budget, 'budget')}
                            className="p-1 text-surface-400 hover:text-primary transition-colors"
                          >
                            <ApperIcon name="Edit2" size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(budget.id, 'budget')}
                            className="p-1 text-surface-400 hover:text-red-500 transition-colors"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>${spent.toLocaleString()} spent</span>
                          <span>${budget.amount.toLocaleString()} budget</span>
                        </div>
                        <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <div className="text-right text-xs text-surface-500">
                          {percentage.toFixed(1)}% used
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {budgetsByCategory.length === 0 && (
                <div className="text-center py-12 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl border border-surface-200 dark:border-surface-700">
                  <ApperIcon name="Target" size={48} className="mx-auto text-surface-400 mb-4" />
                  <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-2">
                    No budgets set for this month
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400">
                    Create your first budget to start tracking your spending.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Expenses View */}
          {activeView === 'expenses' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <motion.button
                  onClick={() => setShowExpenseForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name="Plus" size={16} />
                  New Expense
                </motion.button>
              </div>

              <div className="space-y-4">
                {currentMonthExpenses.map(expense => (
                  <motion.div
                    key={expense.id}
                    className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl p-4 border border-surface-200 dark:border-surface-700"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-surface-800 dark:text-surface-200">
                          {expense.description}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-surface-600 dark:text-surface-400">
                          <span className="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded-full">
                            {expense.category}
                          </span>
                          <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                          -${expense.amount.toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(expense, 'expense')}
                            className="p-1 text-surface-400 hover:text-primary transition-colors"
                          >
                            <ApperIcon name="Edit2" size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id, 'expense')}
                            className="p-1 text-surface-400 hover:text-red-500 transition-colors"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {currentMonthExpenses.length === 0 && (
                <div className="text-center py-12 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl border border-surface-200 dark:border-surface-700">
                  <ApperIcon name="CreditCard" size={48} className="mx-auto text-surface-400 mb-4" />
                  <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-2">
                    No expenses recorded
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400">
                    Start tracking your expenses to better manage your finances.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Income View */}
          {activeView === 'income' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <motion.button
                  onClick={() => setShowIncomeForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name="Plus" size={16} />
                  New Income
                </motion.button>
              </div>

              <div className="space-y-4">
                {currentMonthIncome.map(inc => (
                  <motion.div
                    key={inc.id}
                    className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl p-4 border border-surface-200 dark:border-surface-700"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-surface-800 dark:text-surface-200">
                          {inc.description}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-surface-600 dark:text-surface-400">
                          <span className="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded-full">
                            {inc.source}
                          </span>
                          <span>{format(new Date(inc.date), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                          +${inc.amount.toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(inc, 'income')}
                            className="p-1 text-surface-400 hover:text-primary transition-colors"
                          >
                            <ApperIcon name="Edit2" size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(inc.id, 'income')}
                            className="p-1 text-surface-400 hover:text-red-500 transition-colors"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {currentMonthIncome.length === 0 && (
                <div className="text-center py-12 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl border border-surface-200 dark:border-surface-700">
                  <ApperIcon name="TrendingUp" size={48} className="mx-auto text-surface-400 mb-4" />
                  <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-2">
                    No income recorded
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400">
                    Record your income sources to track your financial progress.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Goals View */}
          {activeView === 'goals' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <motion.button
                  onClick={() => setShowGoalForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name="Plus" size={16} />
                  New Goal
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {financialGoals.map(goal => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100
                  
                  return (
                    <motion.div
                      key={goal.id}
                      className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl p-6 border border-surface-200 dark:border-surface-700"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-surface-800 dark:text-surface-200">
                            {goal.title}
                          </h3>
                          <span className="text-sm text-surface-500 px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded-full">
                            {goal.category}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(goal, 'goal')}
                            className="p-1 text-surface-400 hover:text-primary transition-colors"
                          >
                            <ApperIcon name="Edit2" size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(goal.id, 'goal')}
                            className="p-1 text-surface-400 hover:text-red-500 transition-colors"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>${goal.currentAmount.toLocaleString()}</span>
                          <span>${goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-surface-500">
                          <span>{progress.toFixed(1)}% complete</span>
                          {goal.targetDate && (
                            <span>Due: {format(new Date(goal.targetDate), 'MMM d, yyyy')}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {financialGoals.length === 0 && (
                <div className="text-center py-12 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl border border-surface-200 dark:border-surface-700">
                  <ApperIcon name="Trophy" size={48} className="mx-auto text-surface-400 mb-4" />
                  <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-2">
                    No financial goals set
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400">
                    Set financial goals to track your progress and stay motivated.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Budget Form Modal */}
      <AnimatePresence>
        {showBudgetForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal-backdrop flex items-center justify-center p-4"
            onClick={() => {
              setShowBudgetForm(false)
              setEditingItem(null)
              setBudgetData({ category: '', amount: '', month: format(new Date(), 'yyyy-MM') })
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md border border-surface-200 dark:border-surface-700 z-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                {editingItem ? 'Edit Budget' : 'Create Budget'}
              </h3>
              <form onSubmit={handleBudgetSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={budgetData.category}
                    onChange={(e) => setBudgetData({ ...budgetData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  >
                    <option value="">Select Category</option>
                    {expenseCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={budgetData.amount}
                    onChange={(e) => setBudgetData({ ...budgetData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Month</label>
                  <input
                    type="month"
                    value={budgetData.month}
                    onChange={(e) => setBudgetData({ ...budgetData, month: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-xl hover:shadow-lg transition-all"
                  >
                    {editingItem ? 'Update' : 'Create'} Budget
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBudgetForm(false)
                      setEditingItem(null)
                      setBudgetData({ category: '', amount: '', month: format(new Date(), 'yyyy-MM') })
                    }}
                    className="px-6 py-2 bg-surface-100 dark:bg-surface-700 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expense Form Modal */}
      <AnimatePresence>
        {showExpenseForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal-backdrop flex items-center justify-center p-4"
            onClick={() => {
              setShowExpenseForm(false)
              setEditingItem(null)
              setExpenseData({ description: '', amount: '', category: '', date: format(new Date(), 'yyyy-MM-dd') })
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md border border-surface-200 dark:border-surface-700 z-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                {editingItem ? 'Edit Expense' : 'Add Expense'}
              </h3>
              <form onSubmit={handleExpenseSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={expenseData.description}
                    onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="What did you spend on?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={expenseData.amount}
                    onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={expenseData.category}
                    onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  >
                    <option value="">Select Category</option>
                    {expenseCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={expenseData.date}
                    onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-xl hover:shadow-lg transition-all"
                  >
                    {editingItem ? 'Update' : 'Add'} Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowExpenseForm(false)
                      setEditingItem(null)
                      setExpenseData({ description: '', amount: '', category: '', date: format(new Date(), 'yyyy-MM-dd') })
                    }}
                    className="px-6 py-2 bg-surface-100 dark:bg-surface-700 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Income Form Modal */}
      <AnimatePresence>
        {showIncomeForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal-backdrop flex items-center justify-center p-4"
            onClick={() => {
              setShowIncomeForm(false)
              setEditingItem(null)
              setIncomeData({ description: '', amount: '', source: '', date: format(new Date(), 'yyyy-MM-dd') })
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md border border-surface-200 dark:border-surface-700 z-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                {editingItem ? 'Edit Income' : 'Add Income'}
              </h3>
              <form onSubmit={handleIncomeSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={incomeData.description}
                    onChange={(e) => setIncomeData({ ...incomeData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Income description"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={incomeData.amount}
                    onChange={(e) => setIncomeData({ ...incomeData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Source</label>
                  <input
                    type="text"
                    value={incomeData.source}
                    onChange={(e) => setIncomeData({ ...incomeData, source: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., Salary, Freelance, Investment"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={incomeData.date}
                    onChange={(e) => setIncomeData({ ...incomeData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-xl hover:shadow-lg transition-all"
                  >
                    {editingItem ? 'Update' : 'Add'} Income
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowIncomeForm(false)
                      setEditingItem(null)
                      setIncomeData({ description: '', amount: '', source: '', date: format(new Date(), 'yyyy-MM-dd') })
                    }}
                    className="px-6 py-2 bg-surface-100 dark:bg-surface-700 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Form Modal */}
      <AnimatePresence>
        {showGoalForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal-backdrop flex items-center justify-center p-4"
            onClick={() => {
              setShowGoalForm(false)
              setEditingItem(null)
              setGoalData({ title: '', targetAmount: '', currentAmount: '', targetDate: '', category: 'savings' })
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md border border-surface-200 dark:border-surface-700 z-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                {editingItem ? 'Edit Goal' : 'Create Financial Goal'}
              </h3>
              <form onSubmit={handleGoalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={goalData.title}
                    onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., Emergency Fund, Vacation, Car"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={goalData.targetAmount}
                    onChange={(e) => setGoalData({ ...goalData, targetAmount: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Current Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={goalData.currentAmount}
                    onChange={(e) => setGoalData({ ...goalData, currentAmount: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={goalData.category}
                    onChange={(e) => setGoalData({ ...goalData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="savings">Savings</option>
                    <option value="investment">Investment</option>
                    <option value="debt">Debt Payoff</option>
                    <option value="purchase">Major Purchase</option>
                    <option value="emergency">Emergency Fund</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Date (Optional)</label>
                  <input
                    type="date"
                    value={goalData.targetDate}
                    onChange={(e) => setGoalData({ ...goalData, targetDate: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-xl hover:shadow-lg transition-all"
                  >
                    {editingItem ? 'Update' : 'Create'} Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoalForm(false)
                      setEditingItem(null)
                      setGoalData({ title: '', targetAmount: '', currentAmount: '', targetDate: '', category: 'savings' })
                    }}
                    className="px-6 py-2 bg-surface-100 dark:bg-surface-700 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}