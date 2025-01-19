'use client'

import { useEffect, useState } from 'react'
import { InsightsEngine, FinancialInsight } from '@/lib/services/insightsEngine'
import { useTransactions } from '@/hooks/useTransactions'
import { useUserProfile } from '@/hooks/useUserProfile'
import {
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

export default function InsightsPage() {
  const { transactions } = useTransactions()
  const { profile } = useUserProfile()
  const [insights, setInsights] = useState<FinancialInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function generateInsights() {
      if (!transactions.length || !profile?.monthlyIncome) return

      setIsLoading(true)
      try {
        const insightsEngine = new InsightsEngine()
        const generatedInsights = await insightsEngine.generateInsights(
          transactions,
          profile.monthlyIncome
        )
        setInsights(generatedInsights)
      } catch (error) {
        console.error('Error generating insights:', error)
      } finally {
        setIsLoading(false)
      }
    }

    generateInsights()
  }, [transactions, profile])

  const getInsightIcon = (type: string, severity: string) => {
    switch (type) {
      case 'pattern':
        return <LightBulbIcon className="h-6 w-6 text-blue-500" />
      case 'anomaly':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
      case 'prediction':
        return <ArrowTrendingUpIcon className="h-6 w-6 text-green-500" />
      case 'budget':
        return <ArrowTrendingDownIcon className="h-6 w-6 text-yellow-500" />
      default:
        return <InformationCircleIcon className="h-6 w-6 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'alert':
        return 'bg-red-100 text-red-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  if (isLoading) {
    return <div>Generating insights...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Financial Insights
      </h1>

      <div className="space-y-6">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {getInsightIcon(insight.type, insight.severity)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {insight.title}
                  </h3>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    getSeverityColor(insight.severity)
                  }`}>
                    {insight.severity}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{insight.description}</p>
                
                {/* Additional Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {insight.category && (
                    <div className="text-sm text-gray-500">
                      Category: <span className="font-medium">{insight.category}</span>
                    </div>
                  )}
                  {insight.value && (
                    <div className="text-sm text-gray-500">
                      Value: <span className="font-medium">${insight.value.toFixed(2)}</span>
                    </div>
                  )}
                  {insight.trend && (
                    <div className="text-sm text-gray-500">
                      Trend: <span className="font-medium">{insight.trend}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    Confidence: <span className="font-medium">
                      {(insight.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Action Item */}
                {insight.action && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">
                      Recommended Action:
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{insight.action}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {insights.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No insights available. Add more transactions to get personalized insights.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 