'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import {
  UserCircleIcon,
  BanknotesIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Tippy from '@/components/Tippy'
import Link from 'next/link'

export default function ProfilePage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    onboardingCompleted: false,
    lastUpdated: '',
    preferences: {
      riskTolerance: '',
      investmentStyle: '',
      financialGoals: [],
      monthlyBudget: 0,
      savingsTarget: 0
    },
    insights: {
      lastGenerated: '',
      count: 0
    }
  })

  useEffect(() => {
    loadProfileData()
  }, [user])

  const loadProfileData = async () => {
    if (!user) return
    
    try {
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        // Ensure all required fields exist with default values
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          onboardingCompleted: data.onboardingCompleted || false,
          lastUpdated: data.lastUpdated || new Date().toISOString(),
          preferences: {
            riskTolerance: data.preferences?.riskTolerance || '',
            investmentStyle: data.preferences?.investmentStyle || '',
            financialGoals: data.preferences?.financialGoals || [],
            monthlyBudget: data.preferences?.monthlyBudget || 0,
            savingsTarget: data.preferences?.savingsTarget || 0
          },
          insights: {
            lastGenerated: data.insights?.lastGenerated || '',
            count: data.insights?.count || 0
          }
        })
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading profile:', error)
      showToast({
        title: 'Error',
        message: 'Failed to load profile data',
        type: 'error'
      })
    }
  }

  const getProfileSectionStatus = (section: string) => {
    if (!profileData.preferences) return 'pending'
    
    switch (section) {
      case 'financialGoals':
        return (profileData.preferences.financialGoals || []).length > 0 ? 'complete' : 'pending'
      case 'riskTolerance':
        return profileData.preferences.riskTolerance ? 'complete' : 'pending'
      case 'budget':
        return profileData.preferences.monthlyBudget > 0 ? 'complete' : 'pending'
      default:
        return 'complete'
    }
  }

  const profileSections = [
    {
      title: 'Financial Goals & Preferences',
      description: 'Update your goals and preferences to get better recommendations',
      href: '/dashboard/wealth',
      icon: BanknotesIcon,
      status: getProfileSectionStatus('financialGoals')
    },
    {
      title: 'Risk Assessment',
      description: 'Review and update your investment risk tolerance',
      href: '/dashboard/investments',
      icon: ChartBarIcon,
      status: getProfileSectionStatus('riskTolerance')
    },
    {
      title: 'Budget Settings',
      description: 'Adjust your monthly budget and savings targets',
      href: '/dashboard/budgeting',
      icon: AcademicCapIcon,
      status: getProfileSectionStatus('budget')
    },
    {
      title: 'Data Preferences',
      description: 'Control how your data is used across features',
      href: '/dashboard/vault',
      icon: ShieldCheckIcon,
      status: 'complete'
    }
  ]

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile & Preferences</h1>
            <p className="mt-2 text-gray-600">
              Manage your profile settings to enhance your financial experience
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(profileData.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <UserCircleIcon className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{profileData.name || user?.email}</h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                profileData.onboardingCompleted 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profileData.onboardingCompleted ? 'Profile Complete' : 'Complete Your Profile'}
              </span>
              {profileData.insights.count > 0 && (
                <span className="text-gray-500">
                  {profileData.insights.count} AI Insights Generated
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileSections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                  <section.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    {section.title}
                  </h3>
                  {section.status === 'complete' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowPathIcon className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600">{section.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/insights"
            className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-gray-900">Get New Insights</h4>
            <p className="text-sm text-gray-600">Generate fresh AI recommendations</p>
          </Link>
          <Link
            href="/dashboard/wealth"
            className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-gray-900">Update Goals</h4>
            <p className="text-sm text-gray-600">Review and adjust your targets</p>
          </Link>
          <Link
            href="/dashboard/budgeting"
            className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-gray-900">Budget Review</h4>
            <p className="text-sm text-gray-600">Check your spending patterns</p>
          </Link>
          <Link
            href="/dashboard/vault"
            className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-gray-900">Data Management</h4>
            <p className="text-sm text-gray-600">Control your data settings</p>
          </Link>
        </div>
      </div>
    </div>
  )
} 