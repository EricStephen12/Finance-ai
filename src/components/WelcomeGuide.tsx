'use client'

import { useState } from 'react'
import { 
  UserCircleIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

interface WelcomeGuideProps {
  isNewUser: boolean
  onComplete: (profileData: any) => Promise<void>
  userEmail: string
}

export default function WelcomeGuide({ isNewUser, onComplete, userEmail }: WelcomeGuideProps) {
  const [step, setStep] = useState(1)
  const [profileData, setProfileData] = useState({
    name: '',
    financialGoals: [],
    riskTolerance: 'moderate',
    monthlyIncome: '',
    monthlyExpenses: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onComplete(profileData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Financial Journey</h1>
          <p className="mt-2 text-lg text-gray-600">Let's set up your profile to get personalized guidance</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${step === stepNumber ? 'text-primary-600' : 'text-gray-400'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === stepNumber ? 'bg-primary-100 text-primary-600' : 'bg-gray-100'
                  }`}
                >
                  {stepNumber}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">
                  {stepNumber === 1 ? 'Basic Info' : stepNumber === 2 ? 'Financial Goals' : 'Preferences'}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userEmail}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Next Step
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Financial Goals
                  </label>
                  {['Save for retirement', 'Build emergency fund', 'Invest in stocks', 'Pay off debt'].map((goal) => (
                    <label key={goal} className="flex items-center space-x-3 mb-3">
                      <input
                        type="checkbox"
                        checked={profileData.financialGoals.includes(goal)}
                        onChange={(e) => {
                          const goals = e.target.checked
                            ? [...profileData.financialGoals, goal]
                            : profileData.financialGoals.filter(g => g !== goal)
                          setProfileData({ ...profileData, financialGoals: goals })
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">{goal}</span>
                    </label>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Tolerance
                  </label>
                  <select
                    value={profileData.riskTolerance}
                    onChange={(e) => setProfileData({ ...profileData, riskTolerance: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700">
                    Monthly Income
                  </label>
                  <input
                    type="number"
                    id="monthlyIncome"
                    value={profileData.monthlyIncome}
                    onChange={(e) => setProfileData({ ...profileData, monthlyIncome: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="monthlyExpenses" className="block text-sm font-medium text-gray-700">
                    Monthly Expenses
                  </label>
                  <input
                    type="number"
                    id="monthlyExpenses"
                    value={profileData.monthlyExpenses}
                    onChange={(e) => setProfileData({ ...profileData, monthlyExpenses: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Complete Setup
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
} 