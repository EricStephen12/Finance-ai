import { db } from '@/lib/firebase/config'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

interface UserProfile {
  uid: string
  email: string
  displayName?: string
  createdAt: Date
  lastLoginAt: Date
  preferences?: {
    theme?: 'light' | 'dark'
    notifications?: boolean
  }
  subscription?: {
    plan: 'free' | 'pro' | 'business'
    status: 'active' | 'inactive'
    validUntil?: Date
  }
}

export async function createUserProfile(uid: string, email: string, displayName?: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const newUser: UserProfile = {
        uid,
        email,
        displayName,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: 'light',
          notifications: true
        },
        subscription: {
          plan: 'free',
          status: 'active'
        }
      }

      await setDoc(userRef, newUser)
    } else {
      // Update last login time if user already exists
      await updateDoc(userRef, {
        lastLoginAt: new Date()
      })
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error)
    throw error
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, { ...data, lastLoginAt: new Date() })
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

export async function updateUserPreferences(
  uid: string,
  preferences: UserProfile['preferences']
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, { preferences })
  } catch (error) {
    console.error('Error updating user preferences:', error)
    throw error
  }
}

export async function updateUserSubscription(
  uid: string,
  subscription: UserProfile['subscription']
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, { subscription })
  } catch (error) {
    console.error('Error updating user subscription:', error)
    throw error
  }
} 