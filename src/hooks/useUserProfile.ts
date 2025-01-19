import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { CountryCode, CurrencyCode } from '@/lib/constants/countries'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase' // Make sure this import points to your Firebase config

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  dateOfBirth?: string
  monthlyIncome: number
  additionalIncome?: number
  currentSavings?: number
  currentInvestments?: number
  monthlyExpenses?: number
  savingsGoal?: number
  location?: {
    address?: string
    city: string
    country: CountryCode
    postalCode?: string
  }
  employment?: {
    status: 'employed' | 'self-employed' | 'unemployed' | 'retired' | 'student'
    occupation?: string
    employer?: string
  }
  preferences: {
    currency: string
    riskTolerance: 'low' | 'moderate' | 'high'
    investmentHorizon: number // in years
    budgetingStyle: 'conservative' | 'moderate' | 'aggressive'
    notifications: boolean
    investmentTypes?: string[]
    monthlyInvestmentTarget?: number
  }
  goals: {
    id: string
    title: string
    targetAmount: number
    deadline: Date
    progress: number
  }[]
  experience: {
    investing: 'beginner' | 'intermediate' | 'advanced'
    budgeting: 'beginner' | 'intermediate' | 'advanced'
  }
  documents: {
    bankStatements: string[]
    investmentStatements: string[]
    taxReturns: string[]
    receipts?: string[]
    contracts?: string[]
    insurance?: string[]
  }
  dataPreferences: {
    allowDocumentAnalysis: boolean
    allowTransactionAnalysis: boolean
    dataRetentionPeriod: '6months' | '1year' | '2years' | 'indefinite'
  }
}

const useUserProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (user) {
      loadProfile()
    } else {
      setProfile(null)
      setIsLoading(false)
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) {
      setProfile(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const profileRef = doc(db, 'profiles', user.uid)
      const profileSnap = await getDoc(profileRef)

      if (profileSnap.exists()) {
        setProfile(profileSnap.data() as UserProfile)
      } else {
        // Initialize empty profile if it doesn't exist
        const initialProfile: UserProfile = {
          id: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          monthlyIncome: 0,
          preferences: {
            currency: 'USD',
            riskTolerance: 'moderate',
            investmentHorizon: 5,
            budgetingStyle: 'moderate',
            notifications: true
          },
          goals: [],
          experience: {
            investing: 'beginner',
            budgeting: 'beginner'
          },
          documents: {
            bankStatements: [],
            investmentStatements: [],
            taxReturns: []
          },
          dataPreferences: {
            allowDocumentAnalysis: false,
            allowTransactionAnalysis: false,
            dataRetentionPeriod: '1year'
          }
        }
        await setDoc(profileRef, initialProfile)
        setProfile(initialProfile)
      }
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load profile'))
      console.error('Error loading profile:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('No user logged in')
    }

    try {
      const profileRef = doc(db, 'profiles', user.uid)
      await updateDoc(profileRef, updates)
      await loadProfile() // Reload the profile to get the latest data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update profile'))
      throw err
    }
  }

  const updateGoal = async (goalId: string, updates: Partial<UserProfile['goals'][0]>) => {
    if (!profile || !user) return

    try {
      const updatedGoals = profile.goals.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      )

      const profileRef = doc(db, 'profiles', user.uid)
      await updateDoc(profileRef, { goals: updatedGoals })
      await loadProfile()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update goal'))
      throw err
    }
  }

  const addGoal = async (goal: Omit<UserProfile['goals'][0], 'id'>) => {
    if (!profile || !user) return

    try {
      const newGoal = {
        ...goal,
        id: Math.random().toString(36).substr(2, 9)
      }

      const profileRef = doc(db, 'profiles', user.uid)
      await updateDoc(profileRef, {
        goals: [...profile.goals, newGoal]
      })
      await loadProfile()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add goal'))
      throw err
    }
  }

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    updateGoal,
    addGoal,
    refreshProfile: loadProfile
  }
}

export default useUserProfile 