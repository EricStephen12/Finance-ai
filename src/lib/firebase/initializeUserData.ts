import { db } from './config'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export async function initializeUserData(userId: string) {
  try {
    // Initialize user profile
    await setDoc(doc(db, 'users', userId), {
      userId,
      createdAt: serverTimestamp(),
      hasCompletedOnboarding: false
    }, { merge: true })

    // Initialize user settings
    await setDoc(doc(db, 'settings', userId), {
      userId,
      currency: 'USD',
      monthlyBudget: 0,
      theme: 'light',
      notifications: true,
      createdAt: serverTimestamp()
    }, { merge: true })

    // Initialize analytics
    await setDoc(doc(db, 'analytics', userId), {
      userId,
      transactions: [],
      monthlySpending: 0,
      monthlyIncome: 0,
      savingsGoal: 0,
      spendingByCategory: {},
      lastUpdated: serverTimestamp()
    }, { merge: true })

  } catch (error) {
    console.error('Error initializing user data:', error)
    throw error
  }
} 