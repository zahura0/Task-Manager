import { useState, useEffect } from 'react'
import logoImg from '../assets/logo.png'
import LoadingOverlay from './LoadingOverlay'
import { getApiEndpoint } from '../utils/api'

interface LoginProps {
  setCurrentPage: (page: 'login' | 'signup' | 'dashboard') => void
  onLoginSuccess: (name: string) => void
}

export default function Login({ setCurrentPage, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Load saved email and password if "Remember Me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('tm_remember_email')
    const savedPassword = localStorage.getItem('tm_remember_password')
    const wasRemembered = localStorage.getItem('tm_remember_me') === 'true'

    if (wasRemembered && savedEmail && savedPassword) {
      setEmail(savedEmail)
      setPassword(savedPassword)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Call backend login
    const url = getApiEndpoint('/api/auth/login')
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Login failed')
        // Save token and notify parent
        if (data.token) localStorage.setItem('tm_token', data.token)
        const name = data.user?.fullName || email.split('@')[0]
        
        // Handle "Remember Me" checkbox
        if (rememberMe) {
          localStorage.setItem('tm_remember_email', email)
          localStorage.setItem('tm_remember_password', password)
          localStorage.setItem('tm_remember_me', 'true')
        } else {
          // Clear saved credentials if "Remember Me" is unchecked
          localStorage.removeItem('tm_remember_email')
          localStorage.removeItem('tm_remember_password')
          localStorage.removeItem('tm_remember_me')
        }
        
        onLoginSuccess(name)
      })
      .catch((err) => {
        setError(err.message || 'Login failed')
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <>
      <LoadingOverlay isVisible={isLoading} message="Signing you in..." />
      <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <img src={logoImg} alt="Task Manager Logo" className="h-16 w-auto mx-auto mb-4" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Task Manager</h1>
            <p className="text-gray-600 text-sm mt-2">Organize your work, achieve more</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition text-gray-900 placeholder-gray-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition text-gray-900 placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded" 
                />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                Forgot password?
              </a>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            >
              Sign In
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-gray-700 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-purple-600 hover:text-purple-700 font-semibold bg-none border-none cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600 text-xs mt-8">
            By signing in, you agree to our{' '}
            <a href="#" className="text-purple-600 hover:text-purple-700 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-purple-600 hover:text-purple-700 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
