'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  sendPasswordResetEmail,
  getAuth
} from 'firebase/auth'
import { auth, db, googleProvider } from '@/lib/firebase/config'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { app } from '@/lib/firebase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  handleRedirectResult: () => Promise<void>
  getIdToken: () => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const auth = getAuth(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        // Check if user has completed onboarding
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          if (data?.hasCompletedOnboarding) {
            setUser(user)
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [auth])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign in'))
      throw err
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setError(null)
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign up'))
      throw err
    }
  }

  const signInWithGoogle = async () => {
    try {
      // Try popup sign-in first
      try {
        const result = await signInWithPopup(auth, googleProvider)
        if (result?.user) {
          // Create/update user profile
          await setDoc(doc(db, 'users', result.user.uid), {
            email: result.user.email,
            lastLogin: new Date().toISOString(),
            displayName: result.user.displayName || '',
            photoURL: result.user.photoURL || '',
          }, { merge: true })
          return result
        }
      } catch (popupError: any) {
        console.log('Popup sign-in failed:', popupError.code)
        
        // If popup fails, try redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          console.log('Attempting redirect sign-in...')
          await signInWithRedirect(auth, googleProvider)
          return null
        }
        
        throw popupError
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error)
      let errorMessage = 'Failed to sign in with Google'
      
      switch (error.code) {
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.'
          break
        case 'auth/internal-error':
          errorMessage = 'An error occurred. Please try again.'
          break
        case 'auth/unauthorized-domain':
          errorMessage = 'This domain is not authorized for sign-in.'
          break
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.'
          break
        default:
          errorMessage = error.message || 'Failed to sign in with Google'
      }
      
      throw new Error(errorMessage)
    }
  }

  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth)
      if (result?.user) {
        const userRef = doc(db, 'users', result.user.uid)
        await setDoc(userRef, {
          email: result.user.email,
          lastLogin: new Date().toISOString(),
          displayName: result.user.displayName || '',
          photoURL: result.user.photoURL || '',
        }, { merge: true })
      }
      return result
    } catch (error) {
      console.error('Error handling redirect result:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      await firebaseSignOut(auth)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign out'))
      throw err
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  }

  const getIdToken = async () => {
    if (!user) {
      throw new Error('No user logged in')
    }
    return user.getIdToken()
  }

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    handleRedirectResult,
    signOut,
    resetPassword,
    getIdToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 