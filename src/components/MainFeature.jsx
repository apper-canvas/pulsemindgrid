import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { 
  Home, 
  FileText, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  ChevronDown,
  ChevronRight
} from 'lucide-react'
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
      color: 'text-blue-600'
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: FileText,
      component: 'notes',
      color: 'text-green-600'
    },
    {
      id: 'highlights',
      label: 'Highlights',
      icon: FileText,
      component: 'highlights',
      color: 'text-yellow-600'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      component: 'calendar',
      color: 'text-orange-600'
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: TrendingUp,
      component: 'finance',
      color: 'text-emerald-600'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: 'analytics',
      color: 'text-violet-600'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      component: 'settings',
      color: 'text-gray-600'
    }
  ]

  const handleMenuClick = (item) => {
    if (item.component) {
      setActiveComponent(item.component)
    }
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <ApperIcon className="w-8 h-8 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">MindGrid</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Digital Workspace</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                activeComponent === item.component
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon size={20} className={activeComponent === item.component ? item.color : 'text-gray-500'} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}