'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { auth, db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore'
import { useAuth } from '@/contexts/AuthContext'
import { useSettings } from '@/contexts/SettingsContext'
import { currencies } from '@/constants/currencies'
import type { Transaction } from '@/types/database'
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BoltIcon,
  InformationCircleIcon,
  BanknotesIcon,
  RocketLaunchIcon,
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { financeOptimizer } from '@/lib/services/financeOptimizer'
import { generateFinancialInsights } from '@/lib/ai/insights'
import AIInsights from '@/components/dashboard/ai-insights'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

interface SpendingByCategory {
  category: string
  amount: number
}

interface MonthlySpending {
  month: string
  spending: number
  budget: number
}

interface Settings {
  monthlyBudget?: number
  currency?: string
}

interface Insights {
  spendingTrend: number
  largestCategory: SpendingByCategory
  budgetAdherence: number
  predictedSpending: number
}

interface AnalyticsData {
  monthlySpending: MonthlySpending[]
  spendingByCategory: SpendingByCategory[]
  insights: Insights
  aiRecommendations: {
    spendingOptimizations: Array<{
      category: string
      potentialSavings: number
      suggestions: string[]
    }>
    investmentOpportunities: Array<{
      type: string
      description: string
      expectedReturn: number
      riskLevel: string
    }>
    budgetAdjustments: Array<{
      category: string
      currentAmount: number
      suggestedAmount: number
      reason: string
    }>
  }
}

interface ProactiveSuggestion {
  id: string
  type: 'bill' | 'shortage' | 'saving' | 'investment' | 'goal'
  title: string
  description: string
  impact: number
  dueDate?: string
  priority: 'high' | 'medium' | 'low'
  action?: {
    text: string
    onClick: () => void
  }
}

const COLORS = [
  '#3B82F6', // Primary blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
]

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export default function Analytics() {
  const { user } = useAuth()
  const { settings, formatCurrency } = useSettings()
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('1M')
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending[]>([])
  const [spendingByCategory, setSpendingByCategory] = useState<SpendingByCategory[]>([])
  const [insights, setInsights] = useState<Insights>({
    spendingTrend: 0,
    largestCategory: { category: '', amount: 0 },
    budgetAdherence: 0,
    predictedSpending: 0
  })
  const [selectedChart, setSelectedChart] = useState<'area' | 'pie'>('area')
  const [focusArea, setFocusArea] = useState<'overview' | 'spending' | 'prediction'>('overview')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [proactiveSuggestions, setProactiveSuggestions] = useState<ProactiveSuggestion[]>([])
  const [scheduledPayments, setScheduledPayments] = useState<Array<{
    id: string;
    description: string;
    amount: number;
    dueDate: string;
  }>>([])

  useEffect(() => {
    if (user) {
      fetchAnalyticsData()
      fetchScheduledPayments()
    }
  }, [user])

  const fetchScheduledPayments = async () => {
    try {
      const paymentsRef = collection(db, 'scheduled_payments')
      const q = query(
        paymentsRef,
        where('userId', '==', user?.uid),
        where('status', '==', 'pending'),
        orderBy('dueDate', 'asc')
      )
      const querySnapshot = await getDocs(q)
      const payments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Array<{
        id: string;
        description: string;
        amount: number;
        dueDate: string;
      }>
      setScheduledPayments(payments)
    } catch (error) {
      console.error('Error fetching scheduled payments:', error)
    }
  }

  const fetchAnalyticsData = async () => {
    try {
      if (!user) {
        console.error('No user found')
        return
      }

      setLoading(true)

      // Fetch transactions
      const transactionsRef = collection(db, 'transactions')
      const q = query(
        transactionsRef,
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[]

      // Get AI-powered insights and recommendations
      const [spendingAnalysis, financialInsights] = await Promise.all([
        financeOptimizer.analyzeSpending(transactions),
        generateFinancialInsights(user.uid)
      ])

      // Process monthly spending data
      const monthlySpendingData = await processMonthlySpending(transactions)
      
      // Process spending by category
      const spendingByCategoryData = await processSpendingByCategory(transactions)
      
      // Calculate insights
      const insightsData = await calculateInsights(transactions, spendingByCategoryData)

      setAnalyticsData({
        monthlySpending: monthlySpendingData,
        spendingByCategory: spendingByCategoryData,
        insights: insightsData,
        aiRecommendations: {
          spendingOptimizations: spendingAnalysis.opportunities.map(opp => ({
            category: opp.category,
            potentialSavings: opp.potentialSavings,
            suggestions: opp.suggestions
          })),
          investmentOpportunities: [], // Add investment opportunities from AI
          budgetAdjustments: [] // Add budget adjustments from AI
        }
      })

      setMonthlySpending(monthlySpendingData)
      setSpendingByCategory(spendingByCategoryData)
      setInsights(insightsData)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const processMonthlySpending = async (transactions: Transaction[]) => {
    const monthlyData = new Map<string, { spending: number; budget: number }>()
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { 
          spending: 0, 
          budget: settings?.monthlyBudget || 0 
        })
      }
      
      const monthData = monthlyData.get(monthKey)!
      monthData.spending += Math.abs(transaction.amount)
    })

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        spending: data.spending,
        budget: data.budget
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }

  const processSpendingByCategory = async (transactions: Transaction[]) => {
    const categoryData: { [key: string]: number } = {}
    
    transactions.forEach(transaction => {
      if (!categoryData[transaction.category]) {
        categoryData[transaction.category] = 0
      }
      categoryData[transaction.category] += Math.abs(transaction.amount)
    })

    return Object.entries(categoryData)
      .map(([category, amount]) => ({
        category,
        amount
      }))
      .sort((a, b) => b.amount - a.amount)
  }

  const calculateInsights = async (
    transactions: Transaction[],
    categories: SpendingByCategory[]
  ): Promise<Insights> => {
    // Calculate spending trend
    const spendingTrend = calculateSpendingTrend(transactions)
    
    // Find largest category
    const largestCategory = categories[0] || { category: 'None', amount: 0 }
    
    // Calculate budget adherence
    const budgetAdherence = calculateBudgetAdherence(transactions)
    
    // Calculate predicted spending
    const predictedSpending = calculatePredictedSpending(transactions)

    return {
      spendingTrend,
      largestCategory,
      budgetAdherence,
      predictedSpending
    }
  }

  const calculateSpendingTrend = (transactions: Transaction[]): number => {
    const monthlyTotals = new Map<string, number>()
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyTotals.has(monthKey)) {
        monthlyTotals.set(monthKey, 0)
      }
      
      const currentTotal = monthlyTotals.get(monthKey) || 0
      monthlyTotals.set(monthKey, currentTotal + Math.abs(transaction.amount))
    })

    const sortedMonths = Array.from(monthlyTotals.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))

    if (sortedMonths.length >= 2) {
      const currentMonth = sortedMonths[sortedMonths.length - 1][1]
      const previousMonth = sortedMonths[sortedMonths.length - 2][1]
      return ((currentMonth - previousMonth) / previousMonth) * 100
    }

    return 0
  }

  const calculateBudgetAdherence = (transactions: Transaction[]): number => {
    if (!settings?.monthlyBudget) return 0
    
    // Calculate total spending for the current month
    const currentDate = new Date()
    const currentMonthSpending = transactions
      .filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === currentDate.getMonth() &&
               transactionDate.getFullYear() === currentDate.getFullYear()
      })
      .reduce((total, t) => total + Math.abs(t.amount), 0)

    // Calculate the percentage difference from budget
    // Negative value means over budget, positive means under budget
    return ((settings.monthlyBudget - currentMonthSpending) / settings.monthlyBudget) * 100
  }

  const calculatePredictedSpending = (transactions: Transaction[]): number => {
    if (transactions.length === 0) return 0

    // Get transactions from the last 3 months
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    
    const recentTransactions = transactions.filter(t => new Date(t.date) >= threeMonthsAgo)
    
    if (recentTransactions.length === 0) return 0

    // Calculate average monthly spending
    const monthlyTotals = new Map<string, number>()
    
    recentTransactions.forEach(transaction => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyTotals.has(monthKey)) {
        monthlyTotals.set(monthKey, 0)
      }
      
      monthlyTotals.set(monthKey, monthlyTotals.get(monthKey)! + Math.abs(transaction.amount))
    })

    const averageMonthlySpending = Array.from(monthlyTotals.values())
      .reduce((sum, total) => sum + total, 0) / monthlyTotals.size

    // Apply a simple trend-based adjustment (±10% based on recent trend)
    const trend = calculateSpendingTrend(recentTransactions)
    const adjustmentFactor = 1 + (trend / 1000) // Convert trend percentage to decimal and dampen it
    
    return averageMonthlySpending * adjustmentFactor
  }

  const generateProactiveSuggestions = async () => {
    try {
      if (!analyticsData || !settings?.monthlyBudget) {
        return
      }

      // Get upcoming bills
      const upcomingBills = scheduledPayments?.filter(payment => {
        const dueDate = new Date(payment.dueDate)
        const today = new Date()
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
        return daysUntilDue <= 7 && daysUntilDue > 0
      }) || []

      // Check for potential shortages
      const monthlyIncome = settings.monthlyBudget
      const predictedExpenses = insights.predictedSpending
      const potentialShortage = predictedExpenses > monthlyIncome

      // Generate savings opportunities
      const savingsOpportunities = analyticsData?.aiRecommendations?.spendingOptimizations || []

      const suggestions: ProactiveSuggestion[] = [
        // Upcoming bills notifications
        ...upcomingBills.map(bill => ({
          id: `bill-${bill.id}`,
          type: 'bill' as const,
          title: 'Upcoming Bill',
          description: `${bill.description} due in ${Math.ceil((new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days`,
          impact: bill.amount,
          dueDate: bill.dueDate,
          priority: 'high' as const,
          action: {
            text: 'Schedule Payment',
            onClick: () => console.log('Schedule payment for', bill.id)
          }
        })),

        // Potential shortage warning
        ...(potentialShortage ? [{
          id: 'shortage-warning',
          type: 'shortage' as const,
          title: 'Potential Budget Shortage',
          description: `Based on your spending patterns, you might exceed your monthly budget by ${formatCurrency(predictedExpenses - monthlyIncome)}`,
          impact: predictedExpenses - monthlyIncome,
          priority: 'high' as const,
          action: {
            text: 'View Budget Details',
            onClick: () => console.log('View budget details')
          }
        }] : []),

        // Savings opportunities
        ...savingsOpportunities.map(opportunity => ({
          id: `saving-${opportunity.category}`,
          type: 'saving' as const,
          title: `Savings Opportunity in ${opportunity.category}`,
          description: opportunity.suggestions[0],
          impact: opportunity.potentialSavings,
          priority: (opportunity.potentialSavings > 100 ? 'high' : 'medium') as const,
          action: {
            text: 'See How to Save',
            onClick: () => console.log('View savings details', opportunity.category)
          }
        }))
      ]

      // Add investment suggestions if there's excess savings
      if (insights.budgetAdherence > 20) {
        const investmentAmount = insights.predictedSpending * (insights.budgetAdherence / 100)
        suggestions.push({
          id: 'investment-opportunity',
          type: 'investment' as const,
          title: 'Investment Opportunity',
          description: `You're ${insights.budgetAdherence.toFixed(1)}% under budget. Consider investing the surplus of ${formatCurrency(investmentAmount)} for better returns.`,
          impact: investmentAmount,
          priority: 'medium' as const,
          action: {
            text: 'View Investment Options',
            onClick: () => console.log('View investment options')
          }
        })
      }

      // Add goal-based suggestions
      if (analyticsData.aiRecommendations.investmentOpportunities.length > 0) {
        analyticsData.aiRecommendations.investmentOpportunities.forEach(opportunity => {
          suggestions.push({
            id: `investment-${opportunity.type}`,
            type: 'investment' as const,
            title: opportunity.type,
            description: opportunity.description,
            impact: opportunity.expectedReturn,
            priority: (opportunity.riskLevel === 'low' ? 'medium' : 'high') as const,
            action: {
              text: 'Learn More',
              onClick: () => console.log('View investment details', opportunity.type)
            }
          })
        })
      }

      setProactiveSuggestions(suggestions)
    } catch (error) {
      console.error('Error generating proactive suggestions:', error)
      setProactiveSuggestions([])
    }
  }

  // Call generateProactiveSuggestions when relevant data changes
  useEffect(() => {
    if (analyticsData && settings?.monthlyBudget && insights) {
      generateProactiveSuggestions()
    }
  }, [analyticsData, settings?.monthlyBudget, insights, scheduledPayments])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Monthly Spending',
      value: formatAmount(monthlySpending[monthlySpending.length - 1]?.spending || 0),
      trend: insights.spendingTrend > 0 ? 'up' : 'down',
      change: `${Math.abs(insights.spendingTrend).toFixed(1)}%`,
      description: insights.spendingTrend > 0 ? 'Increased from last month' : 'Decreased from last month',
      icon: <ChartBarIcon className="h-5 w-5 text-white" />
    },
    {
      title: 'Budget Status',
      value: formatAmount(settings?.monthlyBudget || 0),
      trend: insights.budgetAdherence >= 0 ? 'down' : 'up',
      change: `${Math.abs(insights.budgetAdherence).toFixed(1)}%`,
      description: insights.budgetAdherence >= 0 ? 'Under budget' : 'Over budget',
      icon: <ArrowTrendingDownIcon className="h-5 w-5 text-white" />
    },
    {
      title: 'Largest Expense',
      value: formatAmount(insights.largestCategory.amount),
      trend: 'up',
      change: insights.largestCategory.category,
      description: 'Top spending category',
      icon: <SparklesIcon className="h-5 w-5 text-white" />
    },
    {
      title: 'Next Month',
      value: formatAmount(insights.predictedSpending),
      trend: insights.predictedSpending > (settings?.monthlyBudget || 0) ? 'up' : 'down',
      change: insights.predictedSpending > (settings?.monthlyBudget || 0) ? 'Above budget' : 'Within budget',
      description: 'Predicted spending',
      icon: <ArrowTrendingUpIcon className="h-5 w-5 text-white" />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 rounded-xl overflow-hidden">
          <div className="backdrop-blur-sm bg-black/5 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="max-w-[600px]">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <SparklesIcon className="h-6 w-6" />
                  Let's analyze your financial journey together
                </h2>
                <p className="text-sm text-primary-100 mt-2">
                  I've analyzed your finances to help you understand where you're thriving and where we can grow
                </p>
              </div>
              <div className="flex items-center">
                <Tippy content="Choose how far back you'd like us to look - I'll help you spot trends and patterns">
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value as any)}
                    className="bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 hover:bg-white/20 transition-colors cursor-help"
                  >
                    <option value="1M">Last month's journey</option>
                    <option value="3M">Past 3 months together</option>
                    <option value="6M">Last 6 months of progress</option>
                    <option value="1Y">Your full year journey</option>
                  </select>
                </Tippy>
          </div>
        </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-primary-100">{stat.title}</p>
                    <div className="p-2 rounded-lg bg-white/10">
                      {stat.icon}
                    </div>
            </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`inline-flex items-center text-sm ${
                      stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {stat.trend === 'up' ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                      )}
                      {stat.change}
                    </span>
                    <span className="text-xs text-primary-200">{stat.description}</span>
          </div>
                </motion.div>
              ))}
            </div>
          </div>
          </div>

        {/* Analysis Focus */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">What would you like us to explore together?</h3>
                <Tippy content="I can help you understand different aspects of your finances in a way that makes sense">
                  <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-help" />
                </Tippy>
            </div>
          </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'overview',
                  icon: ChartBarIcon,
                  title: 'Your Complete Picture',
                  description: "Let's see how all your finances work together"
                },
                {
                  id: 'spending',
                  icon: BanknotesIcon,
                  title: 'Your Spending Story',
                  description: "I'll help you understand your spending patterns"
                },
                {
                  id: 'prediction',
                  icon: RocketLaunchIcon,
                  title: 'Your Future Path',
                  description: "Let's plan your journey ahead together"
                }
              ].map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setFocusArea(item.id as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    p-4 rounded-xl text-left transition-all duration-200
                    ${focusArea === item.id
                      ? 'bg-primary-50 border-2 border-primary-500 shadow-sm'
                      : 'bg-gray-50 border-2 border-transparent hover:border-primary-200'
                    }
                  `}
                >
                  <item.icon className={`h-6 w-6 mb-3 ${
                    focusArea === item.id ? 'text-primary-600' : 'text-gray-500'
                  }`} />
                  <h4 className="text-base font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </motion.button>
              ))}
          </div>
        </div>
      </div>

        {/* Charts Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-primary-500" />
                Your Financial Story
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedChart('area')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedChart === 'area'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Flow Analysis
                </button>
                <button
                  onClick={() => setSelectedChart('pie')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedChart === 'pie'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Spending Breakdown
                </button>
          </div>
        </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                {selectedChart === 'area' ? (
                  <AreaChart data={monthlySpending}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                />
                <Area 
                  type="monotone"
                  dataKey="spending"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorIncome)"
                      name="Spending"
                />
                <Area 
                  type="monotone"
                  dataKey="budget"
                  stroke="#10B981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSavings)"
                      name="Budget"
                />
              </AreaChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={spendingByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="amount"
                    >
                      {spendingByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      formatter={(value: number) => [formatAmount(value), 'Amount']}
                    />
                  </PieChart>
                )}
            </ResponsiveContainer>
          </div>

            {/* Legend for Pie Chart */}
            {selectedChart === 'pie' && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {spendingByCategory.map((category, index) => (
                  <div key={category.category} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm text-gray-600">{category.category}</span>
                    <span className="text-sm font-medium text-gray-900">${category.amount}</span>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* AI Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">AI Financial Recommendations</h3>
                <Tippy content="Smart suggestions based on your spending patterns">
                  <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-help" />
                </Tippy>
              </div>
            </div>
        
        <div className="space-y-4">
          {insights.spendingTrend > 10 && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <h3 className="text-red-800 font-medium">High Spending Alert</h3>
              <p className="text-red-600 text-sm mt-1">
                Your spending has increased by {insights.spendingTrend.toFixed(1)}%. Consider reviewing your expenses in {insights.largestCategory.category}.
              </p>
            </div>
          )}

          {insights.budgetAdherence < 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
              <h3 className="text-yellow-800 font-medium">Budget Warning</h3>
              <p className="text-yellow-600 text-sm mt-1">
                You're {Math.abs(insights.budgetAdherence).toFixed(1)}% over budget. Try to reduce spending or adjust your budget target.
              </p>
            </div>
          )}

          {insights.budgetAdherence > 20 && (
            <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
              <h3 className="text-green-800 font-medium">Savings Opportunity</h3>
              <p className="text-green-600 text-sm mt-1">
                You're well under budget! Consider allocating the extra {formatAmount(insights.predictedSpending * (insights.budgetAdherence/100))} to savings or investments.
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <h3 className="text-blue-800 font-medium">Next Month Forecast</h3>
            <p className="text-blue-600 text-sm mt-1">
              Based on your patterns, we predict you'll spend around {formatAmount(insights.predictedSpending)} next month.
                  {insights.predictedSpending > (settings?.monthlyBudget || 3000)
                ? " This exceeds your budget target."
                : " This is within your budget target."}
            </p>
          </div>
        </div>
          </div>
        </div>

        {/* Proactive Suggestions */}
        {proactiveSuggestions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Proactive Insights</h3>
                  <Tippy content="I'm actively monitoring your finances to help you stay ahead">
                    <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-help" />
                  </Tippy>
                </div>
              </div>

              <div className="grid gap-4">
                {proactiveSuggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                      p-4 rounded-lg border
                      ${suggestion.type === 'bill' ? 'bg-blue-50 border-blue-100' : ''}
                      ${suggestion.type === 'shortage' ? 'bg-red-50 border-red-100' : ''}
                      ${suggestion.type === 'saving' ? 'bg-green-50 border-green-100' : ''}
                      ${suggestion.type === 'investment' ? 'bg-purple-50 border-purple-100' : ''}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`
                        p-2 rounded-lg
                        ${suggestion.type === 'bill' ? 'bg-blue-100 text-blue-600' : ''}
                        ${suggestion.type === 'shortage' ? 'bg-red-100 text-red-600' : ''}
                        ${suggestion.type === 'saving' ? 'bg-green-100 text-green-600' : ''}
                        ${suggestion.type === 'investment' ? 'bg-purple-100 text-purple-600' : ''}
                      `}>
                        {suggestion.type === 'bill' && <CalendarIcon className="h-5 w-5" />}
                        {suggestion.type === 'shortage' && <ExclamationTriangleIcon className="h-5 w-5" />}
                        {suggestion.type === 'saving' && <SparklesIcon className="h-5 w-5" />}
                        {suggestion.type === 'investment' && <ChartBarIcon className="h-5 w-5" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                          {suggestion.priority && (
                            <span className={`
                              text-xs px-2 py-1 rounded-full
                              ${suggestion.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
                              ${suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                              ${suggestion.priority === 'low' ? 'bg-green-100 text-green-700' : ''}
                            `}>
                              {suggestion.priority} priority
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-600">{suggestion.description}</p>

                        {suggestion.impact && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium text-gray-700">
                              Impact: {formatAmount(Math.abs(suggestion.impact))}
                            </span>
                          </div>
                        )}

                        {suggestion.dueDate && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                            <ClockIcon className="h-4 w-4" />
                            Due: {new Date(suggestion.dueDate).toLocaleDateString()}
                          </div>
                        )}

                        {suggestion.action && (
                          <button
                            onClick={suggestion.action.onClick}
                            className="mt-3 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                          >
                            {suggestion.action.text}
                            <ArrowRightIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 