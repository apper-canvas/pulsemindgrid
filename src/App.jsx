import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const darkMode = useSelector(state => state.darkMode)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-surface-900' : 'bg-gradient-to-br from-surface-50 via-primary/5 to-secondary/5'}`}>
      <div className="bg-grid-pattern bg-[size:20px_20px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
        className="mt-16"
        toastClassName="backdrop-blur-sm"
      />
    </div>
  )
}

export default App