'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from './AuthContext'
import { currencies } from '@/constants/currencies'

const defaultSettings = {
  currency: 'USD',
  language: 'en',
  theme: 'light',
  notifications: {
    email: true,
    push: true,
    monthlyReport: true,
    budgetAlerts: true
  },
  monthlyBudget: 3000,
  monthlySavingsGoal: 1000,
  riskTolerance: 'medium',
  investmentPreferences: [],
  taxBracket: '',
  financialGoals: []
}

const SettingsContext = createContext({
  settings: defaultSettings,
  updateSettings: async () => {},
  userProfile: null,
  updateProfile: async () => {},
  marketData: null,
  formatCurrency: () => '',
  loading: true
})

export function useSettings() {
  return useContext(SettingsContext)
}

export function SettingsProvider({ children }) {
  const { user } = useAuth()
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const [marketData, setMarketData] = useState(null)

  // Load user settings and profile
  useEffect(() => {
    async function loadUserData() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setSettings(userData.settings || defaultSettings)
          setUserProfile(userData)
          
          // Load market data based on user's country
          if (userData.country) {
            const marketDataDoc = await getDoc(doc(db, 'marketData', userData.country.toLowerCase()))
            if (marketDataDoc.exists()) {
              setMarketData(marketDataDoc.data())
            }
          }
        } else {
          setSettings(defaultSettings)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
      
      setLoading(false)
    }

    loadUserData()
  }, [user])

  const updateSettings = async (newSettings) => {
    if (!user) return

    try {
      const mergedSettings = { ...settings, ...newSettings }
      await setDoc(doc(db, 'users', user.uid), {
        settings: mergedSettings,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      setSettings(mergedSettings)
      return true
    } catch (error) {
      console.error('Error updating settings:', error)
      return false
    }
  }

  const updateProfile = async (newProfileData) => {
    if (!user) return

    try {
      const mergedProfile = { ...userProfile, ...newProfileData }
      await setDoc(doc(db, 'users', user.uid), {
        ...mergedProfile,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      setUserProfile(mergedProfile)
      
      // Update market data if country changed
      if (newProfileData.country && newProfileData.country !== userProfile?.country) {
        const marketDataDoc = await getDoc(doc(db, 'marketData', newProfileData.country.toLowerCase()))
        if (marketDataDoc.exists()) {
          setMarketData(marketDataDoc.data())
        }
      }
      
      return true
    } catch (error) {
      console.error('Error updating profile:', error)
      return false
    }
  }

  const formatCurrency = (amount) => {
    const currencySymbol = currencies[settings?.currency]?.symbol || '$'
    return `${currencySymbol}${amount.toLocaleString()}`
  }

  const value = {
    settings,
    updateSettings,
    userProfile,
    updateProfile,
    marketData,
    formatCurrency,
    loading
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
} 