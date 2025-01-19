'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { collection, query, where, getDocs, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore'
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

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error caught by boundary:', error)
      setHasError(true)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <h3 className="text-red-800 font-medium">Something went wrong</h3>
        <p className="text-red-600 text-sm mt-1">
          We encountered an error loading this component. Please try refreshing the page.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

const ChartErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">Unable to display chart</p>
      </div>
    )
  }

  return <>{children}</>
}

const fetchTransactions = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn('Transactions query requires an index, returning empty array:', error);
    return []; // Return empty array instead of throwing
  }
}

const fetchScheduledPayments = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'scheduled_payments'),
      where('userId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('dueDate', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn('Scheduled payments query requires an index, returning empty array:', error);
    return []; // Return empty array instead of throwing
  }
}

export default function Analytics() {
  const { user } = useAuth()
  const { settings, formatCurrency } = useSettings()
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('1M')
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending[]>([])
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [spendingByCategory, setSpendingByCategory] = useState<SpendingByCategory[]>([])
  const [insights, setInsights] = useState<Insights>({
    spendingTrend: 0,
    largestCategory: { category: '', amount: 0 },
    budgetAdherence: 0,
    predictedSpending: 0
  })
  const [selectedChart, setSelectedChart] = useState<'area' | 'pie' | 'bar'>('area')
  const [focusArea, setFocusArea] = useState<'overview' | 'spending' | 'prediction'>('overview')
  const [proactiveSuggestions, setProactiveSuggestions] = useState<ProactiveSuggestion[]>([])
  const [scheduledPayments, setScheduledPayments] = useState<Array<{
    id: string;
    description: string;
    amount: number;
    dueDate: string;
  }>>([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalyticsData = useCallback(async () => {
    if (!user?.uid) {
      // Reset states when no user
      setAnalyticsData(null);
      setMonthlySpending([]);
      setSpendingByCategory([]);
      setInsights({
        spendingTrend: 0,
        largestCategory: { category: '', amount: 0 },
        budgetAdherence: 0,
        predictedSpending: 0
      });
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // First check if user has any data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (!userData || !userData.hasCompletedOnboarding) {
        // Show welcome state for new users
        setAnalyticsData(null);
        setMonthlySpending([]);
        setSpendingByCategory([]);
        setInsights({
          spendingTrend: 0,
          largestCategory: { category: '', amount: 0 },
          budgetAdherence: 0,
          predictedSpending: 0
        });
        setLoading(false);
        return;
      }

      // Fetch all data in parallel with error handling
      const [transactions, payments] = await Promise.all([
        fetchTransactions(user.uid),
        fetchScheduledPayments(user.uid)
      ]);

      // Process data even if some queries failed
      const monthlySpendingData = await processMonthlySpending(transactions);
      const spendingByCategoryData = await processSpendingByCategory(transactions);
      const insightsData = await calculateInsights(transactions, spendingByCategoryData);

      // Set data with fallbacks
      setMonthlySpending(monthlySpendingData || []);
      setSpendingByCategory(spendingByCategoryData || []);
      setInsights(insightsData || {
        spendingTrend: 0,
        largestCategory: { category: '', amount: 0 },
        budgetAdherence: 0,
        predictedSpending: 0
      });
      setScheduledPayments(payments || []);
      
      // Update analytics data
      setAnalyticsData({
        monthlySpending: monthlySpendingData || [],
        spendingByCategory: spendingByCategoryData || [],
        insights: insightsData || {
          spendingTrend: 0,
          largestCategory: { category: '', amount: 0 },
          budgetAdherence: 0,
          predictedSpending: 0
        },
        aiRecommendations: {
          spendingOptimizations: [],
          investmentOpportunities: [],
          budgetAdjustments: []
        }
      });

    } catch (error) {
      console.warn('Error in analytics data fetching, showing empty state:', error);
      // Show empty state instead of error
      setAnalyticsData(null);
      setMonthlySpending([]);
      setSpendingByCategory([]);
      setInsights({
        spendingTrend: 0,
        largestCategory: { category: '', amount: 0 },
        budgetAdherence: 0,
        predictedSpending: 0
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Memoize formatAmount function
  const formatAmount = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }, [])

  // Memoize handlers
  const handleSchedulePayment = useCallback((billId: string) => {
    console.log('Schedule payment for', billId)
  }, [])

  const handleViewBudgetDetails = useCallback(() => {
    console.log('View budget details')
  }, [])

  const handleViewSavingsDetails = useCallback((category: string) => {
    console.log('View savings details', category)
  }, [])

  const handleViewInvestmentOptions = useCallback(() => {
    console.log('View investment options')
  }, [])

  const handleViewInvestmentDetails = useCallback((type: string) => {
    console.log('View investment details', type)
  }, [])

  const generateProactiveSuggestions = useCallback(async () => {
    if (!analyticsData || !settings?.monthlyBudget || !insights) {
      setProactiveSuggestions([])
      return
    }

    try {
      // Get upcoming bills with proper validation
      const upcomingBills = (scheduledPayments || []).filter(payment => {
        if (!payment?.dueDate) return false
        const dueDate = new Date(payment.dueDate)
        const today = new Date()
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
        return daysUntilDue <= 7 && daysUntilDue > 0
      })

      // Check for potential shortages with validation
      const monthlyIncome = settings.monthlyBudget || 0
      const predictedExpenses = insights.predictedSpending || 0
      const potentialShortage = predictedExpenses > monthlyIncome

      // Generate savings opportunities with validation
      const savingsOpportunities = analyticsData.aiRecommendations?.spendingOptimizations || []

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
            onClick: () => handleSchedulePayment(bill.id)
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
            onClick: handleViewBudgetDetails
          }
        }] : []),

        // Savings opportunities
        ...savingsOpportunities.map(opportunity => ({
          id: `saving-${opportunity.category}`,
          type: 'saving' as const,
          title: `Savings Opportunity in ${opportunity.category}`,
          description: opportunity.suggestions[0] || 'Review your spending in this category',
          impact: opportunity.potentialSavings,
          priority: (opportunity.potentialSavings > 100 ? 'high' : 'medium') as const,
          action: {
            text: 'See How to Save',
            onClick: () => handleViewSavingsDetails(opportunity.category)
          }
        }))
      ]

      // Add investment suggestions if there's excess savings
      if ((insights.budgetAdherence || 0) > 20) {
        const investmentAmount = (insights.predictedSpending || 0) * ((insights.budgetAdherence || 0) / 100)
        suggestions.push({
          id: 'investment-opportunity',
          type: 'investment' as const,
          title: 'Investment Opportunity',
          description: `You're ${(insights.budgetAdherence || 0).toFixed(1)}% under budget. Consider investing the surplus of ${formatCurrency(investmentAmount)} for better returns.`,
          impact: investmentAmount,
          priority: 'medium' as const,
          action: {
            text: 'View Investment Options',
            onClick: handleViewInvestmentOptions
          }
        })
      }

      // Add goal-based suggestions with validation
      if (analyticsData.aiRecommendations?.investmentOpportunities?.length > 0) {
        analyticsData.aiRecommendations.investmentOpportunities.forEach(opportunity => {
          if (!opportunity?.type) return
          suggestions.push({
            id: `investment-${opportunity.type}`,
            type: 'investment' as const,
            title: opportunity.type,
            description: opportunity.description || 'Investment opportunity available',
            impact: opportunity.expectedReturn || 0,
            priority: (opportunity.riskLevel === 'low' ? 'medium' : 'high') as const,
            action: {
              text: 'Learn More',
              onClick: () => handleViewInvestmentDetails(opportunity.type)
            }
          })
        })
      }

      setProactiveSuggestions(suggestions)
    } catch (error) {
      console.error('Error generating proactive suggestions:', error)
      setProactiveSuggestions([])
    }
  }, [analyticsData, settings?.monthlyBudget, insights, scheduledPayments, formatCurrency, handleSchedulePayment, handleViewBudgetDetails, handleViewSavingsDetails, handleViewInvestmentOptions, handleViewInvestmentDetails])

  // Call generateProactiveSuggestions when relevant data changes
  useEffect(() => {
    if (analyticsData && settings?.monthlyBudget && insights) {
      generateProactiveSuggestions()
    }
  }, [analyticsData, settings?.monthlyBudget, insights, scheduledPayments, generateProactiveSuggestions])

  if (!user?.uid) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please sign in to view analytics</p>
      </div>
    )
  }

  // Replace error and empty state handling with welcome message
  if (!analyticsData && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto text-center py-12 px-4">
          <SparklesIcon className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Welcome to Financial Analytics</h2>
          <p className="mt-2 text-lg text-gray-600">
            Start tracking your finances to see insights and analytics here.
          </p>
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">Get Started:</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <BanknotesIcon className="h-8 w-8 text-primary-600 mb-4" />
                <h4 className="font-medium text-gray-900">Add Transactions</h4>
                <p className="mt-2 text-sm text-gray-500">
                  Record your income and expenses to start tracking your spending patterns.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <RocketLaunchIcon className="h-8 w-8 text-primary-600 mb-4" />
                <h4 className="font-medium text-gray-900">Set Financial Goals</h4>
                <p className="mt-2 text-sm text-gray-500">
                  Define your savings goals and monthly budget to get personalized insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Monthly Spending',
      value: formatAmount(monthlySpending[monthlySpending.length - 1]?.spending || 0),
      trend: (insights?.spendingTrend || 0) > 0 ? 'up' : 'down',
      change: `${Math.abs(insights?.spendingTrend || 0).toFixed(1)}%`,
      description: (insights?.spendingTrend || 0) > 0 ? 'Increased from last month' : 'Decreased from last month',
      icon: <ChartBarIcon className="h-5 w-5 text-white" />
    },
    {
      title: 'Budget Status',
      value: formatAmount(settings?.monthlyBudget || 0),
      trend: (insights?.budgetAdherence || 0) >= 0 ? 'down' : 'up',
      change: `${Math.abs(insights?.budgetAdherence || 0).toFixed(1)}%`,
      description: (insights?.budgetAdherence || 0) >= 0 ? 'Under budget' : 'Over budget',
      icon: <ArrowTrendingDownIcon className="h-5 w-5 text-white" />
    },
    {
      title: 'Largest Expense',
      value: formatAmount(insights?.largestCategory?.amount || 0),
      trend: 'up',
      change: insights?.largestCategory?.category || 'None',
      description: 'Top spending category',
      icon: <SparklesIcon className="h-5 w-5 text-white" />
    },
    {
      title: 'Next Month',
      value: formatAmount(insights?.predictedSpending || 0),
      trend: (insights?.predictedSpending || 0) > (settings?.monthlyBudget || 0) ? 'up' : 'down',
      change: (insights?.predictedSpending || 0) > (settings?.monthlyBudget || 0) ? 'Above budget' : 'Within budget',
      description: 'Predicted spending',
      icon: <ArrowTrendingUpIcon className="h-5 w-5 text-white" />
    }
  ]

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        {isInitialLoad ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center p-2 bg-red-100 rounded-full mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-gray-900 font-medium">{error}</p>
            <button 
              onClick={() => {
                setError(null)
                fetchAnalyticsData()
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        ) : !user?.uid ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Please sign in to view analytics</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.title}
                  className="relative bg-white p-6 rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center justify-center p-2 bg-primary-100 rounded-lg">
                      {stat.icon}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center">
                      {stat.trend === 'up' ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 text-red-500" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 text-green-500" />
                      )}
                      <span className={`text-sm ml-2 ${
                        stat.trend === 'up' ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            {monthlySpending.length > 0 && spendingByCategory.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Spending Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Monthly Spending</h2>
                    <div className="flex space-x-2">
                      {['1M', '3M', '6M', '1Y'].map((period) => (
                        <button
                          key={period}
                          onClick={() => setTimeframe(period as any)}
                          className={`px-3 py-1 text-sm rounded-md ${
                            timeframe === period
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-80">
                    <ChartErrorBoundary>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlySpending}>
                          <defs>
                            <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number) => formatAmount(value)}
                            labelFormatter={(label: string) => {
                              const [year, month] = label.split('-')
                              return `${new Date(parseInt(year), parseInt(month)-1).toLocaleString('default', { month: 'long' })} ${year}`
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="spending"
                            stroke="#3B82F6"
                            fillOpacity={1}
                            fill="url(#colorSpending)"
                          />
                          <Area
                            type="monotone"
                            dataKey="budget"
                            stroke="#10B981"
                            strokeDasharray="5 5"
                            fill="none"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartErrorBoundary>
                  </div>
                </div>

                {/* Spending by Category Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Spending by Category</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedChart('pie')}
                        className={`px-3 py-1 text-sm rounded-md ${
                          selectedChart === 'pie'
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Pie
                      </button>
                      <button
                        onClick={() => setSelectedChart('bar')}
                        className={`px-3 py-1 text-sm rounded-md ${
                          selectedChart === 'bar'
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Bar
                      </button>
                    </div>
                  </div>
                  <div className="h-80">
                    <ChartErrorBoundary>
                      <ResponsiveContainer width="100%" height="100%">
                        {selectedChart === 'pie' ? (
                          <PieChart>
                            <Pie
                              data={spendingByCategory}
                              dataKey="amount"
                              nameKey="category"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {spendingByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatAmount(value)} />
                            <Legend />
                          </PieChart>
                        ) : (
                          <BarChart data={spendingByCategory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => formatAmount(value)} />
                            <Bar dataKey="amount">
                              {spendingByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </ChartErrorBoundary>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-600">No spending data available for the selected period</p>
              </div>
            )}

            {/* Proactive Suggestions */}
            {proactiveSuggestions.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Proactive Suggestions
                </h2>
                <div className="space-y-4">
                  {proactiveSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{suggestion.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{suggestion.description}</p>
                          {suggestion.impact && (
                            <p className="text-sm font-medium text-primary-600 mt-2">
                              Impact: {formatAmount(suggestion.impact)}
                            </p>
                          )}
                        </div>
                        {suggestion.action && (
                          <button
                            onClick={suggestion.action.onClick}
                            className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            {suggestion.action.text}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
} 