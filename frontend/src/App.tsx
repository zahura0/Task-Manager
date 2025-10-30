import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'dashboard'>('login')
  const [userName, setUserName] = useState<string>('')

  const handleLoginSuccess = (name: string) => {
    setUserName(name)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setUserName('')
    setCurrentPage('login')
  }

  return (
    <>
      {currentPage === 'login' ? (
        <>
          <Login setCurrentPage={setCurrentPage} onLoginSuccess={handleLoginSuccess} />
          <Footer />
        </>
      ) : currentPage === 'signup' ? (
        <>
          <SignUp setCurrentPage={setCurrentPage} />
          <Footer />
        </>
      ) : (
        <Dashboard userName={userName} onLogout={handleLogout} />
      )}
    </>
  )
}

export default App
