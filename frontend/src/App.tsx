import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'dashboard'>('login')
  const [userName, setUserName] = useState<string>('')

  const handleLoginSuccess = (name: string) => {
    setUserName(name)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    // Clear stored token and reset to login
    localStorage.removeItem('tm_token')
    setUserName('')
    setCurrentPage('login')
  }

  return (
    <>
      {currentPage === 'login' ? (
        <Login setCurrentPage={setCurrentPage} onLoginSuccess={handleLoginSuccess} />
      ) : currentPage === 'signup' ? (
        <SignUp setCurrentPage={setCurrentPage} />
      ) : (
        <Dashboard userName={userName} onLogout={handleLogout} />
      )}
    </>
  )
}

export default App
