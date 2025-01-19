'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import UserFinancialInput from '@/components/dashboard/user-financial-input'
import { FinancialInfo } from '@/types/financial'

interface ProfileData {
  email: string
  fullName: string
  preferredCurrency: string
  monthlyBudget: number
  monthlySavingsGoal: number
  riskTolerance: number
  financialInfo?: Partial<FinancialInfo>
  hasCompletedOnboarding: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [profileData, setProfileData] = useState<ProfileData>({
    email: '',
    fullName: '',
    preferredCurrency: 'USD - US Dollar',
    monthlyBudget: 0,
    monthlySavingsGoal: 0,
    riskTolerance: 3,
    hasCompletedOnboarding: false
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          console.log('No user found, redirecting to login...')
          router.replace('/login')
          return
        }

        console.log('User authenticated:', user.uid)
        setUserData(user)
        
        // Load profile data from your database here
        // This is where you would fetch the user's profile including any partial financial info
        const userProfile = await fetchUserProfile(user.uid)
        setProfileData(prev => ({
          ...prev,
          ...userProfile,
          email: user.email || ''
        }))
        setLoading(false)
      } catch (error) {
        console.error('Error in auth state change:', error)
        setError('Failed to authenticate. Please try again.')
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSaveChanges = async () => {
    try {
      // Save profile data to your database here
      console.log('Saving profile data:', profileData)
      await saveUserProfile(userData.uid, profileData)
      alert('Changes saved successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save changes. Please try again.')
    }
  }

  const handleFinancialInfoSkip = async (partialData: Partial<FinancialInfo>) => {
    try {
      // Save the partial data to the database
      const updatedProfile = {
        ...profileData,
        financialInfo: partialData,
        hasCompletedOnboarding: false
      }
      await saveUserProfile(userData.uid, updatedProfile)
      setProfileData(updatedProfile)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving partial financial info:', error)
      alert('Failed to save your progress. Please try again.')
    }
  }

  const handleFinancialInfoComplete = async () => {
    try {
      const updatedProfile = {
        ...profileData,
        hasCompletedOnboarding: true
      }
      await saveUserProfile(userData.uid, updatedProfile)
      setProfileData(updatedProfile)
    } catch (error) {
      console.error('Error completing financial info:', error)
      alert('Failed to save your information. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h1>

      {/* Basic Profile Settings */}
      <div className="max-w-2xl bg-white rounded-xl shadow-sm p-6 space-y-6 mb-8">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={profileData.email}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <p className="mt-1 text-xs text-gray-500">Your email cannot be changed</p>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        {/* Preferred Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Currency</label>
          <select
            value={profileData.preferredCurrency}
            onChange={(e) => setProfileData(prev => ({ ...prev, preferredCurrency: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option>USD - US Dollar</option>
            <option>EUR - Euro</option>
            <option>GBP - British Pound</option>
            <option>JPY - Japanese Yen</option>
            <option>CAD - Canadian Dollar</option>
          </select>
        </div>

        {/* Monthly Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Budget</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={profileData.monthlyBudget}
              onChange={(e) => setProfileData(prev => ({ ...prev, monthlyBudget: Number(e.target.value) }))}
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Monthly Savings Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Savings Goal</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={profileData.monthlySavingsGoal}
              onChange={(e) => setProfileData(prev => ({ ...prev, monthlySavingsGoal: Number(e.target.value) }))}
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Risk Tolerance */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Risk Tolerance (1-5)</label>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={profileData.riskTolerance}
            onChange={(e) => setProfileData(prev => ({ ...prev, riskTolerance: Number(e.target.value) }))}
            className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-600">
            <span>Conservative</span>
            <span>Moderate</span>
            <span>Aggressive</span>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={handleSaveChanges}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Detailed Financial Information */}
      <div className="max-w-4xl bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {!profileData.hasCompletedOnboarding 
              ? "Complete Your Financial Profile" 
              : "Update Your Financial Information"
            }
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {!profileData.hasCompletedOnboarding
              ? "Pick up where you left off - I've saved your previous progress!"
              : "Update your detailed financial information to get better insights and recommendations"
            }
          </p>
        </div>
        <UserFinancialInput 
          isOnboarding={!profileData.hasCompletedOnboarding}
          initialData={profileData.financialInfo}
          onComplete={handleFinancialInfoComplete}
          onSkip={handleFinancialInfoSkip}
        />
      </div>
    </div>
  )
} 