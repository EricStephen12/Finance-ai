'use client'

import { useState } from 'react'
import { UserProfile } from '@/hooks/useUserProfile'
import { 
  COUNTRIES, 
  CURRENCIES,
  formatPhoneNumber,
  validatePhoneNumber,
  getPhoneExample,
  getPhoneFormat
} from '@/lib/constants/countries'
import {
  UserCircleIcon,
  BanknotesIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  HomeIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface ProfileUpdateProps {
  currentProfile: UserProfile | null
  onUpdate: (updatedProfile: Partial<UserProfile>) => Promise<void>
  onCancel: () => void
}

const ProfileUpdate = ({ currentProfile, onUpdate, onCancel }: ProfileUpdateProps) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>(currentProfile || {})
  const [currentStep, setCurrentStep] = useState(1)
  const [countrySearch, setCountrySearch] = useState('')
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const totalSteps = 6

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(country => 
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.phoneCode.includes(countrySearch)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all required fields before submission
    if (!validateCurrentStep()) {
      return
    }

    try {
      // Show loading state if needed
      // You can add a loading state here if you want to show a spinner

      // Clean up the form data before submission
      const cleanedFormData = {
        ...formData,
        // Ensure numbers are properly typed
        monthlyIncome: Number(formData.monthlyIncome),
        monthlyExpenses: Number(formData.monthlyExpenses),
        savingsGoal: Number(formData.savingsGoal),
        preferences: {
          ...formData.preferences,
          investmentHorizon: Number(formData.preferences?.investmentHorizon)
        }
      }

      // Call the update function
      await onUpdate(cleanedFormData)
      
      // You might want to show a success message or redirect here
      // For now, we'll just call onCancel to close the form
      onCancel()
    } catch (error) {
      // Handle any errors that occur during submission
      console.error('Error updating profile:', error)
      // You might want to show an error message to the user here
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof UserProfile],
        [field]: value
      }
    }))
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Personal Information
        if (!formData.name?.trim()) {
          alert('Please enter your name')
          return false
        }
        if (!formData.email?.trim()) {
          alert('Please enter your email')
          return false
        }
        if (formData.phone && !validatePhoneNumber(formData.phone, formData.location?.country || 'US')) {
          alert('Please enter a valid phone number')
          return false
        }
        return true
      case 2: // Location
        if (!formData.location?.city?.trim()) {
          alert('Please enter your city')
          return false
        }
        if (!formData.location?.country?.trim()) {
          alert('Please select your country')
          return false
        }
        return true
      case 3: // Employment & Income
        if (!formData.employment?.status) {
          alert('Please select your employment status')
          return false
        }
        if (!formData.monthlyIncome || formData.monthlyIncome <= 0) {
          alert('Please enter a valid monthly income')
          return false
        }
        return true
      case 4: // Financial Profile
        if (!formData.preferences?.currency) {
          alert('Please select your preferred currency')
          return false
        }
        if (!formData.monthlyExpenses || formData.monthlyExpenses < 0) {
          alert('Please enter your monthly expenses')
          return false
        }
        if (!formData.savingsGoal || formData.savingsGoal < 0) {
          alert('Please enter your savings goal')
          return false
        }
        return true
      case 5: // Investment Preferences
        if (!formData.preferences?.riskTolerance) {
          alert('Please select your risk tolerance')
          return false
        }
        if (!formData.preferences?.investmentHorizon || formData.preferences.investmentHorizon <= 0) {
          alert('Please enter a valid investment horizon')
          return false
        }
        return true
      case 6: // Data Preferences
        if (formData.dataPreferences?.allowDocumentAnalysis === undefined) {
          alert('Please indicate if you allow document analysis')
          return false
        }
        if (formData.dataPreferences?.allowTransactionAnalysis === undefined) {
          alert('Please indicate if you allow transaction analysis')
          return false
        }
        if (!formData.dataPreferences?.dataRetentionPeriod) {
          alert('Please select a data retention period')
          return false
        }
        return true
      default:
        return true
    }
  }

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i + 1} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${i + 1 === currentStep ? 'bg-primary-600 text-white' :
                i + 1 < currentStep ? 'bg-green-500 text-white' :
                'bg-gray-200 text-gray-600'}
            `}>
              {i + 1 < currentStep ? (
                <CheckCircleIcon className="w-5 h-5" />
              ) : (
                i + 1
              )}
            </div>
            {i < totalSteps - 1 && (
              <div className={`
                w-full h-1 mx-2
                ${i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'}
              `} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>Personal Info</span>
        <span>Location</span>
        <span>Employment</span>
        <span>Financial</span>
        <span>Investment</span>
        <span>Data</span>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1 flex gap-4">
                  <div className="relative w-[280px]">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="w-full flex items-center justify-between rounded-md border border-gray-300 px-4 py-2.5 text-left shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-gray-900">+{COUNTRIES.find(c => c.code === (formData.location?.country || 'US'))?.phoneCode}</span>
                        <span className="text-gray-500">({COUNTRIES.find(c => c.code === (formData.location?.country || 'US'))?.name})</span>
                      </span>
                      <span className="text-gray-400">{isCountryDropdownOpen ? '▲' : '▼'}</span>
                    </button>
                    
                    {isCountryDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-300">
                        <div className="p-3 border-b">
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full rounded-md border-gray-300 pl-9 pr-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="Search country..."
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            {countrySearch && (
                              <button
                                type="button"
                                onClick={() => setCountrySearch('')}
                                className="absolute right-3 top-2.5"
                              >
                                <XMarkIcon className="h-4 w-4 text-gray-400" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-60 overflow-auto">
                          {filteredCountries.map(country => (
                            <button
                              key={country.code}
                              type="button"
                              className="w-full px-4 py-2.5 text-left hover:bg-gray-100 flex items-center justify-between"
                              onClick={() => {
                                const newCountry = country.code;
                                handleNestedChange('location', 'country', newCountry);
                                if (formData.phone) {
                                  const digits = formData.phone.replace(/\D/g, '');
                                  const oldCountry = COUNTRIES.find(c => c.code === formData.location?.country);
                                  const numberWithoutCountryCode = oldCountry && digits.startsWith(oldCountry.phoneCode) 
                                    ? digits.slice(oldCountry.phoneCode.length)
                                    : digits;
                                  const newNumber = `+${country.phoneCode}${numberWithoutCountryCode}`;
                                  handleChange('phone', newNumber);
                                }
                                setIsCountryDropdownOpen(false);
                                setCountrySearch('');
                              }}
                            >
                              <span className="text-gray-900">{country.name}</span>
                              <span className="text-gray-500">+{country.phoneCode}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <span className="text-gray-500 font-medium">+{COUNTRIES.find(c => c.code === (formData.location?.country || 'US'))?.phoneCode}</span>
                    </div>
                    <input
                      type="text"
                      value={(formData.phone || '').replace(/^\+\d+/, '').trim()}
                      onChange={(e) => {
                        const input = e.target.value;
                        const countryCode = formData.location?.country || 'US';
                        const country = COUNTRIES.find(c => c.code === countryCode);
                        
                        // Only allow numbers
                        const cleanInput = input.replace(/[^\d]/g, '');
                        
                        // Don't add country code if input is empty
                        if (!cleanInput) {
                          handleChange('phone', '');
                          return;
                        }

                        // Format the number as the user types
                        let formattedNumber = '';
                        let digitIndex = 0;
                        const phoneFormat = getPhoneFormat(countryCode);
                        
                        for (let i = 0; i < phoneFormat.length && digitIndex < cleanInput.length; i++) {
                          if (phoneFormat[i] === 'X') {
                            formattedNumber += cleanInput[digitIndex++] || '';
                          } else if (phoneFormat[i] === ' ' && digitIndex < cleanInput.length) {
                            formattedNumber += ' ';
                          }
                        }

                        // Set the full number with country code
                        const fullNumber = country ? `+${country.phoneCode}${formattedNumber}` : formattedNumber;
                        handleChange('phone', fullNumber);
                      }}
                      placeholder={getPhoneExample(formData.location?.country || 'US').replace(/^\+\d+/, '').trim()}
                      className="pl-16 block w-full rounded-md border-gray-300 py-2.5 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-gray-900"
                    />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Enter only your local number - country code will be added automatically
                </p>
                {formData.phone && !validatePhoneNumber(formData.phone, formData.location?.country || 'US') && (
                  <p className="mt-2 text-sm text-red-500">
                    Please enter a valid phone number matching the format: {getPhoneFormat(formData.location?.country || 'US')}
                  </p>
                )}
              </div>
            </div>
          </section>
        )

      case 2:
        return (
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City *</label>
                <input
                  type="text"
                  required
                  value={formData.location?.city || ''}
                  onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country *</label>
                <select
                  required
                  value={formData.location?.country || ''}
                  onChange={(e) => handleNestedChange('location', 'country', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select a country...</option>
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        )

      case 3:
        return (
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Employment & Income</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Employment Status *</label>
                <select
                  required
                  value={formData.employment?.status || ''}
                  onChange={(e) => handleNestedChange('employment', 'status', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select...</option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="retired">Retired</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Income *</label>
                <input
                  type="number"
                  required
                  value={formData.monthlyIncome || ''}
                  onChange={(e) => handleChange('monthlyIncome', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </section>
        )

      case 4:
        return (
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Currency *</label>
                <select
                  required
                  value={formData.preferences?.currency || ''}
                  onChange={(e) => handleNestedChange('preferences', 'currency', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select a currency...</option>
                  {CURRENCIES.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Expenses *</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">
                      {CURRENCIES.find(c => c.code === formData.preferences?.currency)?.symbol || '$'}
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    value={formData.monthlyExpenses || ''}
                    onChange={(e) => handleChange('monthlyExpenses', Number(e.target.value))}
                    className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Savings Goal *</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">
                      {CURRENCIES.find(c => c.code === formData.preferences?.currency)?.symbol || '$'}
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    value={formData.savingsGoal || ''}
                    onChange={(e) => handleChange('savingsGoal', Number(e.target.value))}
                    className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </section>
        )

      case 5:
        return (
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Risk Tolerance *</label>
                <select
                  required
                  value={formData.preferences?.riskTolerance || ''}
                  onChange={(e) => handleNestedChange('preferences', 'riskTolerance', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select...</option>
                  <option value="low">Conservative (Low Risk)</option>
                  <option value="moderate">Moderate Risk</option>
                  <option value="high">Aggressive (High Risk)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Investment Horizon (years) *</label>
                <input
                  type="number"
                  required
                  value={formData.preferences?.investmentHorizon || ''}
                  onChange={(e) => handleNestedChange('preferences', 'investmentHorizon', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </section>
        )

      case 6:
        return (
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Data Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowDocumentAnalysis"
                  required
                  checked={formData.dataPreferences?.allowDocumentAnalysis || false}
                  onChange={(e) => handleNestedChange('dataPreferences', 'allowDocumentAnalysis', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="allowDocumentAnalysis" className="text-sm text-gray-700">
                  Allow Document Analysis *
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowTransactionAnalysis"
                  required
                  checked={formData.dataPreferences?.allowTransactionAnalysis || false}
                  onChange={(e) => handleNestedChange('dataPreferences', 'allowTransactionAnalysis', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="allowTransactionAnalysis" className="text-sm text-gray-700">
                  Allow Transaction Analysis *
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data Retention Period *</label>
                <select
                  required
                  value={formData.dataPreferences?.dataRetentionPeriod || ''}
                  onChange={(e) => handleNestedChange('dataPreferences', 'dataRetentionPeriod', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select...</option>
                  <option value="6months">6 Months</option>
                  <option value="1year">1 Year</option>
                  <option value="2years">2 Years</option>
                  <option value="indefinite">Indefinite</option>
                </select>
              </div>
            </div>
          </section>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
      {renderStepIndicator()}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
        <p className="mt-1 text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {renderCurrentStep()}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className={`px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors ${
            currentStep === 1 ? 'invisible' : ''
          }`}
        >
          <ArrowLeftIcon className="w-5 h-5 inline-block mr-1" />
          Back
        </button>
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
          >
            {currentStep === totalSteps ? (
              'Complete Profile'
            ) : (
              <>
                Next
                <ArrowRightIcon className="w-5 h-5 inline-block ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

export default ProfileUpdate 