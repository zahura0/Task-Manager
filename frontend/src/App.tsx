import { useState, useEffect } from 'react'
import type { ToastMessage } from './components/Toast'
import './App.css'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import Toast from './components/Toast'

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'dashboard'>('login')
  const [userName, setUserName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Check if user is already logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('tm_token')
    const storedUserName = localStorage.getItem('tm_userName')
    
    if (token) {
      // User was previously logged in, restore session
      setUserName(storedUserName || 'User')
      setCurrentPage('dashboard')
    }
    
    setIsLoading(false)
  }, [])

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
    const id = Date.now().toString()
    const newToast: ToastMessage = { id, message, type, duration }
    setToasts(prev => [...prev, newToast])

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const handleLoginSuccess = (name: string) => {
    setUserName(name)
    localStorage.setItem('tm_userName', name)
    setCurrentPage('dashboard')
    // Show welcome message
    addToast(`Welcome to Fuchsius Task Manager, ${name}! 👋`, 'success', 4000)
  }

  const handleLogout = () => {
    // Clear stored token and user data, reset to login
    localStorage.removeItem('tm_token')
    localStorage.removeItem('tm_userName')
    setUserName('')
    setCurrentPage('login')
    addToast('You have been logged out', 'info', 2000)
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Loading...</h2>
          <p>Checking your session...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      {currentPage === 'login' ? (
        <Login setCurrentPage={setCurrentPage} onLoginSuccess={handleLoginSuccess} />
      ) : currentPage === 'signup' ? (
        <SignUp setCurrentPage={setCurrentPage} />
      ) : (
        <Dashboard userName={userName} onLogout={handleLogout} onAddToast={addToast} />
      )}
    </>
  )
}

export default App
