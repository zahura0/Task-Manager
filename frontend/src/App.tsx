import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Footer from './components/Footer'

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup'>('login')

  return (
    <>
      {currentPage === 'login' ? (
        <Login setCurrentPage={setCurrentPage} />
      ) : (
        <SignUp setCurrentPage={setCurrentPage} />
      )}
      <Footer />
    </>
  )
}

export default App
