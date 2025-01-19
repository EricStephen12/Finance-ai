'use client'

import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/firebase/config'
import { doc, getDoc, setDoc, collection } from 'firebase/firestore'
import { useAuth } from '@/contexts/AuthContext'
import { BellIcon, KeyIcon, UserIcon, CurrencyDollarIcon, CloudArrowDownIcon } from '@heroicons/react/24/outline'

interface Settings {
  notifications: {
    email: boolean
    push: boolean
    monthlyReport: boolean
    budgetAlerts: boolean
    unusualActivity: boolean
  }
  preferences: {
    currency: string
    theme: 'light' | 'dark' | 'system'
    language: string
  }
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
  }
}

const defaultSettings: Settings = {
  notifications: {
    email: true,
    push: true,
    monthlyReport: true,
    budgetAlerts: true,
    unusualActivity: true
  },
  preferences: {
    currency: 'USD',
    theme: 'system',
    language: 'en'
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: new Date().toISOString()
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    try {
      if (!user) return
      setLoading(true)

      const settingsRef = doc(db, 'user_settings', user.uid)
      const settingsSnap = await getDoc(settingsRef)

      if (settingsSnap.exists()) {
        setSettings(settingsSnap.data() as Settings)
      } else {
        // Initialize with default settings if none exist
        await setDoc(settingsRef, defaultSettings)
        setSettings(defaultSettings)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if (!user) throw new Error('No user found')

      const settingsRef = doc(db, 'user_settings', user.uid)
      await setDoc(settingsRef, {
        ...settings,
        updatedAt: new Date().toISOString()
      })
      setSuccess('Settings saved successfully')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const exportData = async () => {
    try {
      if (!user) return

      // Get user settings
      const settingsRef = doc(db, 'user_settings', user.uid)
      const settingsSnap = await getDoc(settingsRef)

      // Get user transactions
      const transactionsRef = collection(db, 'transactions')
      const transactionsSnap = await getDoc(doc(transactionsRef, user.uid))

      // Get user profile
      const profileRef = doc(db, 'profiles', user.uid)
      const profileSnap = await getDoc(profileRef)

      const exportData = {
        profile: profileSnap.exists() ? profileSnap.data() : null,
        settings: settingsSnap.exists() ? settingsSnap.data() : null,
        transactions: transactionsSnap.exists() ? transactionsSnap.data() : null,
        exportDate: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `financeai-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
      setError('Failed to export data')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="flex items-center gap-4">
          {saving && (
            <span className="text-sm text-gray-500">
              Saving changes...
            </span>
          )}
          <button
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded animate-fade-in">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded animate-fade-in">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* Notifications */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition duration-150 ease-in-out hover:shadow-md">
          <h2 className="text-lg font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <BellIcon className="h-5 w-5 text-blue-500" />
            Notifications
          </h2>
          <div className="mt-4 space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getNotificationDescription(key)}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        [key]: !value
                      }
                    })
                  }
                  className={`${
                    value ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      value ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition duration-150 ease-in-out hover:shadow-md">
          <h2 className="text-lg font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <CurrencyDollarIcon className="h-5 w-5 text-blue-500" />
            Preferences
          </h2>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Currency
                </label>
                <select
                  value={settings.preferences.currency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        currency: e.target.value
                      }
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Theme
                </label>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        theme: e.target.value as 'light' | 'dark' | 'system'
                      }
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition duration-150 ease-in-out hover:shadow-md">
          <h2 className="text-lg font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <KeyIcon className="h-5 w-5 text-blue-500" />
            Security
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      twoFactorEnabled: !settings.security.twoFactorEnabled
                    }
                  })
                }
                className={`${
                  settings.security.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.security.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-500">
                Last password change: {new Date(settings.security.lastPasswordChange).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition duration-150 ease-in-out hover:shadow-md">
          <h2 className="text-lg font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <CloudArrowDownIcon className="h-5 w-5 text-blue-500" />
            Data Management
          </h2>
          <div className="mt-4">
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Export All Data
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Download a copy of all your data including transactions, settings, and profile information
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    email: 'Receive important updates and notifications via email',
    push: 'Get instant notifications in your browser',
    monthlyReport: 'Receive a monthly summary of your spending and savings',
    budgetAlerts: 'Get notified when you approach your budget limits',
    unusualActivity: 'Be alerted of any suspicious account activity'
  }
  return descriptions[key] || ''
} 