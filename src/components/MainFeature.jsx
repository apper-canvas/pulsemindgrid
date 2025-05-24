import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Home, 
  FileText, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Clock,
  Heart,
  Archive,
  CalendarDays,
  CalendarCheck,
  List,
  Receipt,
  PiggyBank,
  FileBarChart,
  Bell,
  Shield,
  Plug,
  User,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { toast } from 'react-toastify'
import { format, isToday, differenceInDays } from 'date-fns'
import ApperIcon from './ApperIcon'

export default function MainFeature({ activeComponent, setActiveComponent }) {
  const dispatch = useDispatch()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [activeSubMenu, setActiveSubMenu] = useState(null)

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      component: 'dashboard',
      gradient: 'from-blue-500 to-purple-600',
      description: 'Overview and insights',
      stats: {
        count: '4',
        label: 'Active'
      }
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: FileText,
      component: 'notes',
      gradient: 'from-green-500 to-teal-600',
      description: 'Capture your thoughts',
      stats: {
        count: '12',
        label: 'Notes'
      },
      hasSubmenu: true,
      submenu: [
        { id: 'all-notes', label: 'All Notes', icon: FileText },
        { id: 'recent', label: 'Recent', icon: Clock },
        { id: 'favorites', label: 'Favorites', icon: Heart },
        { id: 'archive', label: 'Archive', icon: Archive }
      ]
    },
    {
      id: 'divider-1',
      type: 'divider'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      component: 'calendar',
      gradient: 'from-orange-500 to-red-600',
      description: 'Manage your schedule',
      stats: {
        count: '3',
        label: 'Today'
      },
      hasSubmenu: true,
      submenu: [
        { id: 'month-view', label: 'Month View', icon: Calendar },
        { id: 'week-view', label: 'Week View', icon: CalendarDays },
        { id: 'day-view', label: 'Day View', icon: CalendarCheck },
        { id: 'agenda', label: 'Agenda', icon: List }
      ]
    },
    {
      id: 'divider-2',
      type: 'divider'
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: TrendingUp,
      component: 'finance',
      gradient: 'from-emerald-500 to-cyan-600',
      description: 'Track your finances',
      stats: {
        count: '$2.4k',
        label: 'Balance'
      },
      hasSubmenu: true,
      submenu: [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'transactions', label: 'Transactions', icon: Receipt },
        { id: 'budgets', label: 'Budgets', icon: PiggyBank },
        { id: 'reports', label: 'Reports', icon: FileBarChart }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: 'analytics',
      gradient: 'from-violet-500 to-purple-600',
      description: 'Data insights',
      stats: {
        count: '89%',
        label: 'Growth'
      }
    },
    {
      id: 'divider-3',
      type: 'divider'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      component: 'settings',
      gradient: 'from-gray-500 to-slate-600',
      description: 'App preferences',
      stats: {
        count: '6',
        label: 'Items'
      },
      hasSubmenu: true,
      submenu: [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'integrations', label: 'Integrations', icon: Plug }
      ]
    },
    {
      id: 'divider-4',
      type: 'divider'
    }
  ]

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    if (isCollapsed) {
      setActiveSubMenu(null)
    }
  }

  const handleMenuClick = (item) => {
    if (item.hasSubmenu) {
      setActiveSubMenu(activeSubMenu === item.id ? null : item.id)
    } else if (item.component) {
      setActiveComponent(item.component)
      setActiveSubMenu(null)
    }
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
                  MindGrid
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  Your Digital Workspace
                </p>
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
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id} className="relative">
              {item.type === 'divider' ? (
                !isCollapsed && (
                  <div className="my-4 border-t border-slate-200/60 dark:border-slate-700/60" />
                )
              ) : (
                <motion.button
                  onClick={() => handleMenuClick(item)}
                  className={`group w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'justify-between px-4'} py-4 rounded-2xl text-left transition-all duration-300 relative overflow-hidden ${
                    activeComponent === item.component
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-indigo-500/25 transform scale-[1.02]`
                      : 'text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 dark:hover:from-slate-800/50 dark:hover:to-slate-700/30'
                  }`}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
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
                  </div>
                  
                  {!isCollapsed && item.hasSubmenu && (
                    <motion.div
                      className="relative z-10"
                      animate={{ rotate: activeSubMenu === item.id ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={16} className={activeComponent === item.component ? 'text-white/80' : 'text-slate-400'} />
                    </motion.div>
                  )}
                </motion.button>
              )}
              
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
            </div>
          ))}
        </nav>
        
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
      </div>
    </motion.div>
  )
}