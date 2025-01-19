'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import {
  BanknotesIcon,
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  StarIcon,
  SparklesIcon,
  LightBulbIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  TagIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { BudgetOptimizer } from '@/lib/services/budgetOptimizer'
import { useTransactions } from '@/hooks/useTransactions'
import { BudgetAnalysis } from '@/types/analytics'
import { LocationService } from '@/lib/services/locationService'
import useUserProfile from '@/hooks/useUserProfile'

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

interface BudgetCategory {
  id: string
  name: string
  limit: number
  spent: number
  color: string
}

interface ScheduledPayment {
  id: string
  description: string
  amount: number
  dueDate: string
  category: string
  isRecurring: boolean
  frequency?: 'daily' | 'weekly' | 'monthly'
  reminderTime?: string
}

interface DailyBudgetPlan {
  date: string
  budget: number
  spent: number
  remainingBudget: number
  plannedExpenses: {
    description: string
    amount: number
    time: string
  }[]
}

interface FinancialGoal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  priority: 'high' | 'medium' | 'low'
}

interface ActionItem {
  id: string
  title: string
  description: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  type: 'task' | 'reminder' | 'suggestion'
  impactedFeatures?: string[]
}

interface LocalOffer {
  id: string
  title: string
  description: string
  location: string
  distance: string
  savings: number
  category: string
  expiryDate: string
}

interface LocalFinancialEvent {
  id: string
  title: string
  description: string
  date: string
  location: string
  type: 'workshop' | 'seminar' | 'fair' | 'consultation'
  cost: number | 'free'
}

interface DailyRoutine {
  id: string
  time: string
  activity: string
  budgetLimit: number
  category: string
  tips: string[]
  notification: boolean
}

interface GoalVisualization {
  id: string
  goalId: string
  currentAmount: number
  projections: {
    conservative: ProjectionPoint[]
    expected: ProjectionPoint[]
    optimistic: ProjectionPoint[]
  }
  dailyActions: DailyAction[]
  milestones: Milestone[]
}

interface ProjectionPoint {
  date: string
  amount: number
}

interface DailyAction {
  id: string
  description: string
  amount: number
  frequency: 'daily' | 'weekly' | 'monthly'
  impact: {
    monthly: number
    yearly: number
    fiveYear: number
  }
  compoundingEffect: number
}

interface Milestone {
  id: string
  amount: number
  date: string
  description: string
  achieved: boolean
  tips: string[]
}

interface SmartSuggestion {
  id: string
  type: 'saving' | 'budget_adjustment' | 'habit' | 'goal' | 'alert' | 'support' | 'nudge'
  title: string
  description: string
  impact: {
    monthly: number
    yearly: number
  }
  difficulty: 'easy' | 'medium' | 'hard'
  timeframe: 'immediate' | 'short_term' | 'long_term'
  steps: string[]
  category?: string
  relatedRoutine?: DailyRoutine
  notification?: boolean
  emotionalContext?: {
    tone: 'encouraging' | 'reassuring' | 'celebratory' | 'motivating' | 'understanding'
    message: string
    followUp?: string
  }
  behaviorInsight?: {
    pattern: string
    suggestion: string
    positiveReinforcement: string
  }
}

export default function SmartBudgeting() {
  const { transactions } = useTransactions()
  const { profile } = useUserProfile()
  const [budgetAnalysis, setBudgetAnalysis] = useState<BudgetAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function analyzeBudget() {
      if (!transactions.length || !profile?.monthlyIncome) return

      setIsLoading(true)
      try {
        const budgetOptimizer = new BudgetOptimizer()
        const locationService = new LocationService()

        // Get budget analysis
        const analysis = await budgetOptimizer.optimizeBudget(
          transactions,
          profile.monthlyIncome
        )

        // Enhance with location-based savings if available
        if (profile.location) {
          const savingsOpportunities = await locationService.findNearbyAlternatives(
            'groceries',
            profile.location,
            5000 // 5km radius
          )

          // Add location-based recommendations
          if (savingsOpportunities.length > 0) {
            analysis.recommendations.push(
              ...savingsOpportunities
                .slice(0, 3)
                .map(opp => 
                  `Consider ${opp.name} for groceries (${opp.distance.toFixed(1)}km away) - potential savings based on price level`
                )
            )
          }
        }

        setBudgetAnalysis(analysis)
      } catch (error) {
        console.error('Error analyzing budget:', error)
      } finally {
        setIsLoading(false)
      }
    }

    analyzeBudget()
  }, [transactions, profile])

  if (isLoading) {
    return <div>Analyzing your budget...</div>
  }

  if (!budgetAnalysis) {
    return <div>No budget data available</div>
  }

  return (
    <div className="space-y-6">
      {/* Budget Allocations */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Budget Allocations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgetAnalysis.allocations.map((allocation, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{allocation.category}</span>
                <span className="text-sm text-gray-600">
                  {allocation.percentage.toFixed(1)}%
                      </span>
                    </div>
              <div className="text-lg font-semibold">
                ${allocation.amount.toFixed(2)}
                  </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${allocation.percentage}%` }}
                />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Required Adjustments */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Suggested Adjustments</h2>
        <div className="space-y-4">
          {budgetAnalysis.adjustments.map((adjustment, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{adjustment.category}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  adjustment.suggestedAmount > adjustment.currentAmount
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {adjustment.suggestedAmount > adjustment.currentAmount ? 'Reduce' : 'Good'}
                      </span>
                    </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Current: ${adjustment.currentAmount.toFixed(2)}</span>
                <span>Suggested: ${adjustment.suggestedAmount.toFixed(2)}</span>
                  </div>
              <p className="text-sm text-gray-600 mt-2">{adjustment.reason}</p>
              </div>
            ))}
                  </div>
                </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Smart Recommendations</h2>
                  <div className="space-y-3">
          {budgetAnalysis.recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg text-gray-800"
            >
              {recommendation}
                    </div>
          ))}
        </div>
      </div>
    </div>
  )
} 