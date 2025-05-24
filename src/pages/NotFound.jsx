import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
        >
          <ApperIcon name="Search" size={40} className="text-white" />
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-bold text-gradient mb-4">404</h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-surface-800 dark:text-surface-200 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist. Let's get you back to your productivity dashboard.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ApperIcon name="Home" size={20} />
            <span>Back to Dashboard</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-sm text-surface-500 dark:text-surface-400"
        >
          Lost? Try navigating through the sidebar menu.
        </motion.div>
      </motion.div>
    </div>
  )
}