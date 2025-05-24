import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import App from './App.jsx'
import './index.css'

// Simple Redux store for state management
const initialState = {
  tasks: [],
  habits: [],
  goals: [],
  notes: [],
  darkMode: false
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