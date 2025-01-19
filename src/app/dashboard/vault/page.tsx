'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  LockClosedIcon,
  ArrowUpTrayIcon,
  DocumentChartBarIcon,
  InformationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import Tippy from '@/components/Tippy'

export default function DataVaultPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const vaultFeatures = [
    {
      icon: ShieldCheckIcon,
      title: 'Bank-Level Security',
      description: 'Your financial documents are encrypted and stored with the highest security standards.'
    },
    {
      icon: DocumentChartBarIcon,
      title: 'Smart Analysis',
      description: 'AI analyzes your documents to provide personalized insights and recommendations.'
    },
    {
      icon: ArrowPathIcon,
      title: 'Auto-Sync',
      description: 'Automatically sync and update your financial data across all platform features.'
    },
    {
      icon: LockClosedIcon,
      title: 'Privacy Control',
      description: 'You control exactly what data is shared with each feature of the platform.'
    }
  ]

  const documentCategories = [
    {
      title: 'Financial Statements',
      description: 'Bank statements, investment reports, and transaction histories',
      usedFor: ['Smart Budgeting', 'Investment Advisor', 'AI Insights']
    },
    {
      title: 'Tax Documents',
      description: 'Tax returns, W-2s, and other tax-related documents',
      usedFor: ['Tax Planning', 'Wealth Overview']
    },
    {
      title: 'Investment Documents',
      description: 'Portfolio statements, trade confirmations, and investment research',
      usedFor: ['Investment Advisor', 'Wealth Overview']
    },
    {
      title: 'Insurance & Legal',
      description: 'Insurance policies, legal documents, and contracts',
      usedFor: ['Wealth Overview', 'Risk Assessment']
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Secure Data Vault</h1>
        <p className="mt-2 text-gray-600">
          Your personal financial command center for secure document storage and management
        </p>
      </div>

      {/* Features Grid */}
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Vault Features</h2>
          <Tippy content="Learn how the Data Vault protects and utilizes your information">
            <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-help" />
          </Tippy>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vaultFeatures.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Categories */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Document Categories</h2>
              <Tippy content="See how different types of documents help power platform features">
                <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-help" />
              </Tippy>
            </div>
            <button
              onClick={() => setIsUploading(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <ArrowUpTrayIcon className="h-5 w-5" />
              Upload Documents
            </button>
          </div>

          <div className="grid gap-6">
            {documentCategories.map((category) => (
              <div
                key={category.title}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{category.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{category.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {category.usedFor.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center px-2 py-1 rounded-full bg-primary-50 text-primary-700 text-xs"
                        >
                          Used by: {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 