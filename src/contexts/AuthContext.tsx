'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth, db, googleProvider } from '@/lib/firebase/config'
import { doc, getDoc, setDoc } from 'firebase/firestore'

interface AuthContextType {
  user: User | null
  loading: boolean
  hasCompletedOnboarding: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  handleRedirectResult: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        // Check if user has completed onboarding
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        setHasCompletedOnboarding(userDoc.exists() && userDoc.data()?.hasCompletedOnboarding)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName: name })
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
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
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
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

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      hasCompletedOnboarding,
      signIn,
      signUp,
      signInWithGoogle,
      handleRedirectResult,
      signOut,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 