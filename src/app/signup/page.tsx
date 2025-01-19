'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { ArrowRightIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { createUserProfile } from '@/lib/services/userService'

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.uid)
      if (user) {
        setUser(user)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      console.log('User detected in state, current path:', window.location.pathname)
      if (window.location.pathname !== '/dashboard') {
        console.log('Not on dashboard, redirecting...')
        window.location.href = '/dashboard'
      }
    }
  }, [user])

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Starting email sign up process...')
    
    if (formData.password !== formData.confirmPassword) {
      console.log('Password mismatch detected')
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      setError('')
      console.log('Attempting to create account with:', formData.email)
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      console.log('Account creation successful:', userCredential)
      
      if (userCredential.user) {
        console.log('User created and authenticated:', userCredential.user.uid)
        await createUserProfile(userCredential.user.uid, userCredential.user.email || '')
        setUser(userCredential.user)
      } else {
        console.log('No user data in credentials')
      }
    } catch (error: any) {
      console.error('Detailed sign-up error:', {
        code: error.code,
        message: error.message,
        fullError: error
      })
      setError(
        error.code === 'auth/email-already-in-use' ? 'An account with this email already exists' :
        error.code === 'auth/invalid-email' ? 'Invalid email address' :
        error.code === 'auth/weak-password' ? 'Password should be at least 6 characters' :
        'An error occurred during sign up'
      )
    } finally {
      console.log('Sign up process completed')
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    console.log('Starting Google sign up process...')
    try {
      setLoading(true)
      setError('')
      const provider = new GoogleAuthProvider()
      console.log('Attempting Google sign up...')
      const userCredential = await signInWithPopup(auth, provider)
      console.log('Google sign up successful:', userCredential)
      
      if (userCredential.user) {
        console.log('Google user authenticated:', userCredential.user.uid)
        await createUserProfile(userCredential.user.uid, userCredential.user.email || '')
        setUser(userCredential.user)
      } else {
        console.log('No user data in Google credentials')
      }
    } catch (error: any) {
      console.error('Detailed Google sign-up error:', {
        code: error.code,
        message: error.message,
        fullError: error
      })
      setError('An error occurred during Google sign up')
    } finally {
      console.log('Google sign up process completed')
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <SparklesIcon className="h-5 w-5" />,
      text: 'AI-powered financial insights'
    },
    {
      icon: <ShieldCheckIcon className="h-5 w-5" />,
      text: 'Bank-level security'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-2xl blur-3xl" />
        
        {/* Content */}
        <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <Link href="/" className="inline-block">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                  FinanceAI
                </h1>
              </Link>
              <h2 className="mt-6 text-2xl font-bold">Create your account</h2>
              <p className="mt-2 text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Features */}
            <div className="mt-8 flex justify-center space-x-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-300">
                  <div className="text-primary-400 mr-2">{feature.icon}</div>
                  {feature.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleEmailSignUp} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Create a password"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-800"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary-400 hover:text-primary-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary-400 hover:text-primary-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-gray-800 transition-colors"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <>
                      Create account
                      <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800/50 text-gray-400">Or continue with</span>
                </div>
              </div>

              <motion.div
                className="mt-6"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <button
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-gray-800 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Sign up with Google
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 