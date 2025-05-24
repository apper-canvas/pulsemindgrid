import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import MainFeature from '../components/MainFeature'
import Calendar from '../components/Calendar/Calendar'
import Notes from '../components/Notes/Notes'
import Analytics from '../components/Analytics/Analytics'
import Finance from '../components/Finance/Finance'
import Highlights from '../components/Highlights/Highlights'

export default function Home() {
  const dispatch = useDispatch()
  const [activeComponent, setActiveComponent] = useState('dashboard')
  const darkMode = useSelector(state => state.darkMode)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <MainFeature 
        activeComponent={activeComponent} 
        setActiveComponent={setActiveComponent} 
      />
      
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activeComponent === 'dashboard' && (
              <div className="p-8 h-full overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                      Welcome to MindGrid
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                      Your intelligent workspace for productivity and organization
                    </p>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
                    >
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Quick Start
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Navigate through different modules using the sidebar to manage your digital workspace.
                      </p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
                    >
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Current Time
                      </h3>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {format(new Date(), 'HH:mm')}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {format(new Date(), 'EEEE, MMMM d, yyyy')}
                      </p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
                    >
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Features
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Notes, Calendar, Finance tracking, Analytics, and Highlights - all in one place.
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
            
            {activeComponent === 'notes' && <Notes />}
            {activeComponent === 'calendar' && <Calendar />}
            {activeComponent === 'finance' && <Finance />}
            {activeComponent === 'analytics' && <Analytics />}
            {activeComponent === 'highlights' && <Highlights />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}