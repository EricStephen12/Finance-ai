'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  SparklesIcon, 
  ArrowTrendingUpIcon, 
  ShieldExclamationIcon, 
  BanknotesIcon, 
  ArrowRightIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { financeOptimizer } from '@/lib/services/financeOptimizer'
import { useAuth } from '@/contexts/AuthContext'
import { useSettings } from '@/contexts/SettingsContext'
import { Transaction } from '@/types/database'

interface AIInsight {
  type: 'success' | 'warning' | 'info' | 'prediction' | 'encouragement'
  icon: JSX.Element
  title: string
  description: string
  emotionalContext?: string
  personalizedAdvice?: string
  action?: {
    text: string
    onClick: () => void
  }
  priority?: 'high' | 'medium' | 'low'
  impact?: {
    monthly?: number
    yearly?: number
    description: string
  }
  timeframe?: string
  steps?: string[]
}

export default function AIInsights() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      generateInsights()
    }
  }, [user])

  const generateInsights = async () => {
    try {
      // Get transactions from your database
      const transactions: Transaction[] = [] // Replace with actual transaction fetching
      
      // Get spending analysis
      const spendingAnalysis = await financeOptimizer.analyzeSpending(transactions)
      
      // Get financial forecast
      const forecast = await financeOptimizer.forecastFinances({
        transactions,
        goals: [], // Add actual goals
        assumptions: {
          incomeGrowth: 0.03,
          inflationRate: 0.02,
          marketReturns: 0.07
        }
      })

      const newInsights: AIInsight[] = []

      // Add spending pattern insights
      spendingAnalysis.patterns.forEach(pattern => {
        if (pattern.trend === 'increasing') {
          newInsights.push({
            type: 'warning',
            icon: <ArrowTrendingUpIcon className="h-6 w-6 text-amber-500" />,
            title: `Increasing ${pattern.category} Expenses`,
            description: pattern.anomalies.join('. '),
            emotionalContext: "I noticed this trend and wanted to bring it to your attention. Let's work on this together.",
            personalizedAdvice: "Here are some specific ways we could optimize this category:",
            steps: spendingAnalysis.opportunities
              .find(o => o.category === pattern.category)?.suggestions || [],
            priority: 'high',
            impact: {
              monthly: pattern.amount / 12,
              yearly: pattern.amount,
              description: 'Potential impact if optimized'
            },
            action: {
              text: "Review Detailed Analysis",
              onClick: () => console.log('View category analysis', pattern.category)
            }
          })
        }
      })

      // Add savings opportunities
      spendingAnalysis.opportunities.forEach(opportunity => {
        if (opportunity.potentialSavings > 100) {
          newInsights.push({
            type: 'info',
            icon: <BanknotesIcon className="h-6 w-6 text-blue-500" />,
            title: `Savings Opportunity in ${opportunity.category}`,
            description: `I've identified potential monthly savings of ${opportunity.potentialSavings.toFixed(2)}`,
            emotionalContext: "This is an opportunity to boost your savings without major lifestyle changes.",
            personalizedAdvice: "Here's how we can achieve these savings:",
            steps: opportunity.suggestions,
            priority: opportunity.effort === 'low' ? 'high' : 'medium',
            impact: {
              monthly: opportunity.potentialSavings,
              yearly: opportunity.potentialSavings * 12,
              description: 'Estimated savings potential'
            },
            action: {
              text: "See How to Save",
              onClick: () => console.log('View savings opportunity', opportunity)
            }
          })
        }
      })

      // Add forecast insights
      forecast.scenarios.forEach(scenario => {
        if (scenario.type === 'expected') {
          const netWorthTrend = scenario.netWorth[scenario.netWorth.length - 1] - scenario.netWorth[0]
          if (netWorthTrend > 0) {
            newInsights.push({
              type: 'prediction',
              icon: <ChartBarIcon className="h-6 w-6 text-emerald-500" />,
              title: "Positive Financial Trajectory",
              description: `Based on your current habits, I project a ${(netWorthTrend * 100 / scenario.netWorth[0]).toFixed(1)}% increase in your net worth over the next year.`,
              emotionalContext: "You're making great progress toward your financial goals!",
              personalizedAdvice: "To maximize this trajectory, consider:",
              steps: forecast.recommendations.slice(0, 3),
              timeframe: "12 months",
              action: {
                text: "View Detailed Forecast",
                onClick: () => console.log('View forecast')
              }
            })
          }
        }
      })

      // Add risk insights
      forecast.risks.forEach(risk => {
        if (risk.probability > 0.5) {
          newInsights.push({
            type: 'warning',
            icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />,
            title: `${risk.type} Risk Alert`,
            description: risk.impact,
            emotionalContext: "I want to help you address this before it becomes a concern.",
            personalizedAdvice: "Here's what we can do to mitigate this risk:",
            steps: risk.mitigation,
            priority: 'high',
            action: {
              text: "View Risk Details",
              onClick: () => console.log('View risk details', risk)
            }
          })
        }
      })

      // Add achievement insights
      if (spendingAnalysis.insights.length > 0) {
        newInsights.push({
          type: 'success',
          icon: <CheckCircleIcon className="h-6 w-6 text-emerald-500" />,
          title: "Financial Achievements",
          description: spendingAnalysis.insights[0],
          emotionalContext: "You've made some great financial decisions!",
          personalizedAdvice: "Keep up the momentum with these next steps:",
          steps: spendingAnalysis.insights.slice(1, 4),
          action: {
            text: "View All Achievements",
            onClick: () => console.log('View achievements')
          }
        })
      }

      setInsights(newInsights.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return (priorityOrder[a.priority || 'low'] || 2) - (priorityOrder[b.priority || 'low'] || 2)
      }))
    } catch (error) {
      console.error('Error generating insights:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Your Personal Financial Insights</h2>
        <button 
          onClick={generateInsights}
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          <SparklesIcon className="h-4 w-4" />
          Refresh Insights
        </button>
      </div>

      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow
              ${insight.type === 'warning' ? 'border-amber-100' : ''}
              ${insight.type === 'success' ? 'border-emerald-100' : ''}
              ${insight.type === 'info' ? 'border-blue-100' : ''}
              ${insight.type === 'prediction' ? 'border-violet-100' : ''}
              ${insight.type === 'encouragement' ? 'border-primary-100' : ''}
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                p-2 rounded-lg
                ${insight.type === 'warning' ? 'bg-amber-50' : ''}
                ${insight.type === 'success' ? 'bg-emerald-50' : ''}
                ${insight.type === 'info' ? 'bg-blue-50' : ''}
                ${insight.type === 'prediction' ? 'bg-violet-50' : ''}
                ${insight.type === 'encouragement' ? 'bg-primary-50' : ''}
              `}>
                {insight.icon}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                  {insight.priority && (
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${insight.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
                      ${insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${insight.priority === 'low' ? 'bg-green-100 text-green-700' : ''}
                    `}>
                      {insight.priority} priority
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600">{insight.description}</p>
                
                {insight.emotionalContext && (
                  <p className="text-gray-500 text-sm italic">{insight.emotionalContext}</p>
                )}

                {insight.impact && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-gray-700">Potential Impact:</p>
                    {insight.impact.monthly && (
                      <p className="text-gray-600">Monthly: ${insight.impact.monthly.toFixed(2)}</p>
                    )}
                    {insight.impact.yearly && (
                      <p className="text-gray-600">Yearly: ${insight.impact.yearly.toFixed(2)}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">{insight.impact.description}</p>
                  </div>
                )}

                {insight.personalizedAdvice && insight.steps && insight.steps.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-gray-700 font-medium">{insight.personalizedAdvice}</p>
                    <ul className="space-y-1">
                      {insight.steps.map((step, idx) => (
                        <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                          <ArrowRightIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.action && (
                  <button
                    onClick={insight.action.onClick}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    {insight.action.text}
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 