'use client'

import { useState } from 'react'
import { 
  UserCircleIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface WelcomeGuideProps {
  isNewUser: boolean
  onComplete: (profileData: any) => Promise<void>
  userEmail: string
}

export default function WelcomeGuide({ isNewUser, onComplete, userEmail }: WelcomeGuideProps) {
  const [step, setStep] = useState(1)
  const [isProcessingDocs, setIsProcessingDocs] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])
  const [profileData, setProfileData] = useState({
    name: '',
    email: userEmail,
    monthlyIncome: '',
    monthlyExpenses: '',
    savingsGoal: '',
    location: {
      city: '',
      country: ''
    },
    preferences: {
      currency: 'USD',
      riskTolerance: 'moderate',
      investmentHorizon: '5',
      budgetingStyle: 'moderate',
      notifications: true
    },
    financialGoals: [] as string[],
    experience: {
      investing: 'beginner',
      trading: 'beginner',
      budgeting: 'beginner'
    },
    documents: {
      bankStatements: [] as string[],
      taxReturns: [] as string[],
      investmentStatements: [] as string[],
      otherDocuments: [] as string[]
    },
    transactionHistory: {
      hasImported: false,
      lastImported: null,
      sources: [] as string[]
    },
    dataPreferences: {
      allowDocumentAnalysis: true,
      allowTransactionAnalysis: true,
      dataRetentionPeriod: '1year'
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onComplete(profileData)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files
    if (!files) return

    setIsProcessingDocs(true)
    try {
      // TODO: Implement actual file upload and processing
      const fileNames = Array.from(files).map(file => file.name)
      setUploadedDocs(prev => [...prev, ...fileNames])
      
      setProfileData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [type]: [...prev.documents[type as keyof typeof prev.documents], ...fileNames]
        }
      }))
    } catch (error) {
      console.error('Error processing documents:', error)
    } finally {
      setIsProcessingDocs(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
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
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                value={profileData.location.city}
                onChange={(e) => setProfileData({
                  ...profileData,
                  location: { ...profileData.location, city: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="country"
                value={profileData.location.country}
                onChange={(e) => setProfileData({
                  ...profileData,
                  location: { ...profileData.location, country: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700">
                Monthly Income
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="monthlyIncome"
                  value={profileData.monthlyIncome}
                  onChange={(e) => setProfileData({ ...profileData, monthlyIncome: e.target.value })}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="monthlyExpenses" className="block text-sm font-medium text-gray-700">
                Monthly Expenses
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="monthlyExpenses"
                  value={profileData.monthlyExpenses}
                  onChange={(e) => setProfileData({ ...profileData, monthlyExpenses: e.target.value })}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="savingsGoal" className="block text-sm font-medium text-gray-700">
                Monthly Savings Goal
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="savingsGoal"
                  value={profileData.savingsGoal}
                  onChange={(e) => setProfileData({ ...profileData, savingsGoal: e.target.value })}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Risk Tolerance
              </label>
              <select
                value={profileData.preferences.riskTolerance}
                onChange={(e) => setProfileData({
                  ...profileData,
                  preferences: { ...profileData.preferences, riskTolerance: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Investment Horizon (years)
              </label>
              <select
                value={profileData.preferences.investmentHorizon}
                onChange={(e) => setProfileData({
                  ...profileData,
                  preferences: { ...profileData.preferences, investmentHorizon: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="1">1 year</option>
                <option value="3">3 years</option>
                <option value="5">5 years</option>
                <option value="10">10+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Experience Level
              </label>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm text-gray-600">Investing</label>
                  <select
                    value={profileData.experience.investing}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      experience: { ...profileData.experience, investing: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Budgeting</label>
                  <select
                    value={profileData.experience.budgeting}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      experience: { ...profileData.experience, budgeting: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Document Upload</h3>
            <p className="text-sm text-gray-600">
              Upload financial documents to get more accurate insights and recommendations.
              We'll analyze these documents to provide better financial guidance.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Statements</label>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.csv,.xlsx"
                    onChange={(e) => handleFileUpload(e, 'bankStatements')}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Investment Statements</label>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.csv,.xlsx"
                    onChange={(e) => handleFileUpload(e, 'investmentStatements')}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tax Returns</label>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.csv,.xlsx"
                    onChange={(e) => handleFileUpload(e, 'taxReturns')}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
              </div>
            </div>

            {isProcessingDocs && (
              <div className="flex items-center justify-center space-x-2 text-primary-600">
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                <span>Processing documents...</span>
              </div>
            )}

            {uploadedDocs.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Uploaded Documents</h4>
                <div className="mt-2 space-y-2">
                  {uploadedDocs.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <DocumentTextIcon className="h-4 w-4" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Data Preferences</label>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="allowDocumentAnalysis"
                    checked={profileData.dataPreferences.allowDocumentAnalysis}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      dataPreferences: {
                        ...prev.dataPreferences,
                        allowDocumentAnalysis: e.target.checked
                      }
                    }))}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowDocumentAnalysis" className="ml-3 text-sm text-gray-600">
                    Allow document analysis for personalized insights
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="allowTransactionAnalysis"
                    checked={profileData.dataPreferences.allowTransactionAnalysis}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      dataPreferences: {
                        ...prev.dataPreferences,
                        allowTransactionAnalysis: e.target.checked
                      }
                    }))}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowTransactionAnalysis" className="ml-3 text-sm text-gray-600">
                    Allow transaction analysis for better recommendations
                  </label>
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Data Retention Period</label>
                  <select
                    value={profileData.dataPreferences.dataRetentionPeriod}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      dataPreferences: {
                        ...prev.dataPreferences,
                        dataRetentionPeriod: e.target.value
                      }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                    <option value="2years">2 Years</option>
                    <option value="indefinite">Indefinite</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
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
            {[1, 2, 3, 4].map((stepNumber) => (
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
                  {stepNumber === 1 ? 'Basic Info' : 
                   stepNumber === 2 ? 'Financial Info' : 
                   stepNumber === 3 ? 'Preferences' :
                   'Documents'}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {renderStep()}

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                disabled={step === 1}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  step === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Back
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev + 1)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Complete Setup
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 