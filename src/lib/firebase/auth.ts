import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth'
import { auth, googleProvider } from './config'

export const signInWithGoogle = async () => {
  try {
    // Try popup first
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result
    } catch (popupError) {
      console.log('Popup blocked or closed, trying redirect...')
      // If popup fails (e.g., blocked), fall back to redirect
      await signInWithRedirect(auth, googleProvider)
    }
  } catch (error: any) {
    console.error('Error signing in with Google:', error)
    throw new Error(error.message || 'Failed to sign in with Google')
  }
}

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth)
    return result
  } catch (error: any) {
    console.error('Error handling redirect result:', error)
    throw new Error(error.message || 'Failed to complete sign in')
  }
}

export const signOut = () => auth.signOut() 