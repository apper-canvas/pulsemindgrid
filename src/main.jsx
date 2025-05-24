import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { addDays, startOfWeek, addHours } from 'date-fns'
import App from './App.jsx'
import './index.css'

// Simple Redux store for state management
const initialState = {
  tasks: [],
  habits: [],
  goals: [],
  notes: [],
  analytics: {
    moduleTime: {
      tasks: 0,
      habits: 0,
      goals: 0,
      calendar: 0,
      notes: 0,
      overview: 0
    },
    dailyActivity: []
  },
  finance: {
    budgets: [],
    expenses: [],
    income: [],
    financialGoals: [],
    expenseCategories: [
      'Housing', 'Transportation', 'Food', 'Entertainment', 
      'Healthcare', 'Shopping', 'Bills', 'Education', 
      'Travel', 'Other'
    ]
  },
  darkMode: false,
  events: [
    {
      id: '1',
      title: 'Team Standup',
      description: 'Daily team sync meeting',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      type: 'meeting',
      linkedTaskId: '1',
      linkedProjectId: null,
      reminder: 15,
      color: '#6366f1',
      isAllDay: false,
      location: 'Conference Room A',
      attendees: ['john@example.com', 'jane@example.com']
    },
    {
      id: '2',
      title: 'Project Planning',
      description: 'Plan next sprint features',
      startTime: addHours(addDays(new Date(), 2), 14).toISOString(),
      endTime: addHours(addDays(new Date(), 2), 16).toISOString(),
      type: 'work',
      linkedTaskId: null,
      linkedProjectId: '1',
      reminder: 30,
      color: '#10b981',
      isAllDay: false,
      location: 'Office',
      attendees: []
    },
    {
      id: '3',
      title: 'Workout Session',
      description: 'Morning gym session',
      startTime: addHours(addDays(new Date(), 1), 7).toISOString(),
      endTime: addHours(addDays(new Date(), 1), 8).toISOString(),
      type: 'personal',
      linkedTaskId: '3',
      linkedProjectId: null,
      reminder: 10,
      color: '#f59e0b',
      isAllDay: false,
      location: 'Local Gym',
      attendees: []
    }
  ]
}

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        )
      }
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] }
    case 'MARK_HABIT_COMPLETE':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id
            ? { ...habit, currentStreak: habit.currentStreak + 1, lastCompleted: new Date() }
            : habit
        )
      }
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] }
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode }
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, { ...action.payload, id: Date.now().toString() }]
      }
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? { ...event, ...action.payload } : event
        )
      }
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      }
    case 'TOGGLE_EVENT_REMINDER':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload
            ? { ...event, reminder: event.reminder ? null : 15 }
            : event
        )
      }
    case 'LINK_EVENT_TO_TASK':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.eventId
            ? { ...event, linkedTaskId: action.payload.taskId, linkedProjectId: null }
            : event
        )
      }
    case 'LINK_EVENT_TO_PROJECT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.eventId
            ? { ...event, linkedProjectId: action.payload.projectId, linkedTaskId: null }
            : event
        )
      }
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [...state.notes, {
          ...action.payload,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      }
    
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id
            ? { ...note, ...action.payload, updatedAt: new Date().toISOString() }
            : note
        )
      }
    
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      }
    
    case 'LINK_NOTE_TO_TASK':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.noteId
            ? {
                ...note,
                linkedTasks: [...(note.linkedTasks || []), action.payload.taskId],
                updatedAt: new Date().toISOString()
              }
            : note
        )
      }
    
    case 'LINK_NOTE_TO_GOAL':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.noteId
            ? {
                ...note,
                linkedGoals: [...(note.linkedGoals || []), action.payload.goalId],
                updatedAt: new Date().toISOString()
              }
            : note
        )
      }
    
    case 'LINK_NOTE_TO_NOTE':
      return {
        ...state,
        notes: state.notes.map(note => {
          if (note.id === action.payload.noteId) {
            return {
              ...note,
              linkedNoteIds: [...new Set([...(note.linkedNoteIds || []), action.payload.targetNoteId])],
              updatedAt: new Date().toISOString()
            }
          }
          if (note.id === action.payload.targetNoteId) {
            return {
              ...note,
              linkedNoteIds: [...new Set([...(note.linkedNoteIds || []), action.payload.noteId])],
              updatedAt: new Date().toISOString()
            }
          }
          return note
        })
      }
    
    case 'UNLINK_NOTE_FROM_TASK':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.noteId
            ? {
                ...note,
                linkedTasks: (note.linkedTasks || []).filter(taskId => taskId !== action.payload.taskId),
                updatedAt: new Date().toISOString()
              }
            : note
        )
      }
    
    case 'UNLINK_NOTE_FROM_GOAL':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.noteId
            ? {
                ...note,
                linkedGoals: (note.linkedGoals || []).filter(goalId => goalId !== action.payload.goalId),
                updatedAt: new Date().toISOString()
              }
            : note
        )
      }
    
    case 'UNLINK_NOTE_FROM_NOTE':
      return {
        ...state,
        notes: state.notes.map(note => {
          if (note.id === action.payload.noteId || note.id === action.payload.targetNoteId) {
            return {
              ...note,
              linkedNoteIds: (note.linkedNoteIds || []).filter(id => 
                id !== action.payload.noteId && id !== action.payload.targetNoteId
              ),
              updatedAt: new Date().toISOString()
            }
          }
          return note
        })
      }
    
    
    case 'UPDATE_MODULE_TIME':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          moduleTime: {
            ...state.analytics.moduleTime,
            [action.payload.module]: (state.analytics.moduleTime[action.payload.module] || 0) + action.payload.time
          }
        }
      }
    
    case 'LOG_DAILY_ACTIVITY':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          dailyActivity: [
            ...state.analytics.dailyActivity.slice(-29), // Keep last 30 days
            {
              date: new Date().toISOString().split('T')[0],
              ...action.payload
            }
          ]
        }
      }
    
    // Financial Actions
    case 'ADD_BUDGET':
      return {
        ...state,
        finance: {
          ...state.finance,
          budgets: [...state.finance.budgets, {
            ...action.payload,
            id: action.payload.id || Date.now().toString(),
            createdAt: new Date().toISOString()
          }]
        }
      }
    
    case 'UPDATE_BUDGET':
      return {
        ...state,
        finance: {
          ...state.finance,
          budgets: state.finance.budgets.map(budget =>
            budget.id === action.payload.id ? { ...budget, ...action.payload } : budget
          )
        }
      }
    
    case 'DELETE_BUDGET':
      return {
        ...state,
        finance: {
          ...state.finance,
          budgets: state.finance.budgets.filter(budget => budget.id !== action.payload)
        }
      }
    
    case 'ADD_EXPENSE':
      return {
        ...state,
        finance: {
          ...state.finance,
          expenses: [...state.finance.expenses, {
            ...action.payload,
            id: action.payload.id || Date.now().toString(),
            createdAt: new Date().toISOString()
          }]
        }
      }
    
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        finance: {
          ...state.finance,
          expenses: state.finance.expenses.map(expense =>
            expense.id === action.payload.id ? { ...expense, ...action.payload } : expense
          )
        }
      }
    
    case 'DELETE_EXPENSE':
      return {
        ...state,
        finance: {
          ...state.finance,
          expenses: state.finance.expenses.filter(expense => expense.id !== action.payload)
        }
      }
    
    case 'ADD_INCOME':
      return {
        ...state,
        finance: {
          ...state.finance,
          income: [...state.finance.income, {
            ...action.payload,
            id: action.payload.id || Date.now().toString(),
            createdAt: new Date().toISOString()
          }]
        }
      }
    
    case 'UPDATE_INCOME':
      return {
        ...state,
        finance: {
          ...state.finance,
          income: state.finance.income.map(inc =>
            inc.id === action.payload.id ? { ...inc, ...action.payload } : inc
          )
        }
      }
    
    case 'DELETE_INCOME':
      return {
        ...state,
        finance: {
          ...state.finance,
          income: state.finance.income.filter(inc => inc.id !== action.payload)
        }
      }
    
    case 'ADD_FINANCIAL_GOAL':
      return {
        ...state,
        finance: {
          ...state.finance,
          financialGoals: [...state.finance.financialGoals, {
            ...action.payload,
            id: action.payload.id || Date.now().toString(),
            createdAt: new Date().toISOString()
          }]
        }
      }
    
    case 'UPDATE_FINANCIAL_GOAL':
      return {
        ...state,
        finance: {
          ...state.finance,
          financialGoals: state.finance.financialGoals.map(goal =>
            goal.id === action.payload.id ? { ...goal, ...action.payload } : goal
          )
        }
      }
    
    case 'DELETE_FINANCIAL_GOAL':
      return {
        ...state,
        finance: {
          ...state.finance,
          financialGoals: state.finance.financialGoals.filter(goal => goal.id !== action.payload)
        }
      }
    
    default:
      return state
  }
}

const store = configureStore({
  reducer: rootReducer
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)