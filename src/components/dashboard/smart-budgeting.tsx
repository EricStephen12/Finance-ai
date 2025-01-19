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
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: '1', name: 'Housing', limit: 2000, spent: 1800, color: 'bg-blue-500' },
    { id: '2', name: 'Food', limit: 600, spent: 450, color: 'bg-green-500' },
    { id: '3', name: 'Transportation', limit: 400, spent: 320, color: 'bg-yellow-500' },
    { id: '4', name: 'Entertainment', limit: 300, spent: 280, color: 'bg-purple-500' },
    { id: '5', name: 'Utilities', limit: 250, spent: 220, color: 'bg-red-500' },
  ])

  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([
    {
      id: '1',
      description: 'Rent Payment',
      amount: 2000,
      dueDate: '2024-02-01',
      category: 'Housing',
      isRecurring: true,
      frequency: 'monthly',
      reminderTime: '09:00',
    },
    {
      id: '2',
      description: 'Grocery Shopping',
      amount: 150,
      dueDate: '2024-01-25',
      category: 'Food',
      isRecurring: true,
      frequency: 'weekly',
      reminderTime: '10:00',
    },
  ])

  const [dailyPlan, setDailyPlan] = useState<DailyBudgetPlan>({
    date: new Date().toISOString().split('T')[0],
    budget: 100,
    spent: 45,
    remainingBudget: 55,
    plannedExpenses: [
      { description: 'Lunch', amount: 15, time: '12:30' },
      { description: 'Coffee', amount: 5, time: '15:00' },
      { description: 'Dinner', amount: 25, time: '19:00' },
    ],
  })

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

  const [goals, setGoals] = useState<FinancialGoal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 5500,
      deadline: '2024-06-30',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Vacation Savings',
      targetAmount: 3000,
      currentAmount: 1200,
      deadline: '2024-08-15',
      priority: 'medium',
    },
  ])

  const [goalVisualizations, setGoalVisualizations] = useState<GoalVisualization[]>([
    {
      id: '1',
      goalId: '1',
      currentAmount: 5500,
      projections: {
        conservative: [
          { date: '2024-06-30', amount: 8000 },
          { date: '2024-12-31', amount: 10500 },
          { date: '2025-06-30', amount: 13000 }
        ],
        expected: [
          { date: '2024-06-30', amount: 9000 },
          { date: '2024-12-31', amount: 12000 },
          { date: '2025-06-30', amount: 15000 }
        ],
        optimistic: [
          { date: '2024-06-30', amount: 10000 },
          { date: '2024-12-31', amount: 13500 },
          { date: '2025-06-30', amount: 17000 }
        ]
      },
      dailyActions: [
        {
          id: '1',
          description: 'Skip daily coffee shop visit',
          amount: 5,
          frequency: 'daily',
          impact: {
            monthly: 150,
            yearly: 1825,
            fiveYear: 9125
          },
          compoundingEffect: 1.15
        },
        {
          id: '2',
          description: 'Pack lunch instead of buying',
          amount: 10,
          frequency: 'daily',
          impact: {
            monthly: 300,
            yearly: 3650,
            fiveYear: 18250
          },
          compoundingEffect: 1.15
        }
      ],
      milestones: [
        {
          id: '1',
          amount: 6000,
          date: '2024-03-31',
          description: 'Two months of expenses saved',
          achieved: false,
          tips: ['Set up automatic transfers', 'Review subscriptions for savings']
        },
        {
          id: '2',
          amount: 7500,
          date: '2024-05-31',
          description: 'Three months of expenses saved',
          achieved: false,
          tips: ['Consider a side gig', 'Look for cashback opportunities']
        }
      ]
    }
  ])

  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: '1',
      title: 'Review Subscription Services',
      description: 'Analyze monthly subscriptions for potential savings',
      dueDate: '2024-01-30',
      priority: 'high',
      completed: false,
      type: 'task',
    },
    {
      id: '2',
      title: 'Utility Bill Due',
      description: 'Pay electricity bill - $120',
      dueDate: '2024-01-28',
      priority: 'high',
      completed: false,
      type: 'reminder',
    },
    {
      id: '3',
      title: 'Savings Opportunity',
      description: 'Transfer $200 to emergency fund based on this month\'s surplus',
      dueDate: '2024-01-31',
      priority: 'medium',
      completed: false,
      type: 'suggestion',
    },
  ])

  const [personalizedTips, setPersonalizedTips] = useState([
    'Based on your spending pattern, you could save $150 monthly by bringing lunch 3 times a week',
    'Your entertainment spending is 15% higher than last month. Consider free local events this weekend',
    'Great job on reducing transportation costs! You\'ve saved $45 this month',
  ])

  const [userLocation, setUserLocation] = useState<{
    city: string
    state: string
    country: string
  } | null>(null)

  const [localOffers, setLocalOffers] = useState<LocalOffer[]>([
    {
      id: '1',
      title: 'Grocery Store Discount',
      description: '15% off on fresh produce at Local Market',
      location: 'Downtown Market',
      distance: '0.5 miles',
      savings: 15,
      category: 'Groceries',
      expiryDate: '2024-02-01',
    },
    {
      id: '2',
      title: 'Gas Station Rewards',
      description: '10 cents off per gallon at QuickFuel',
      location: 'Main Street',
      distance: '1.2 miles',
      savings: 10,
      category: 'Transportation',
      expiryDate: '2024-01-31',
    },
  ])

  const [localEvents, setLocalEvents] = useState<LocalFinancialEvent[]>([
    {
      id: '1',
      title: 'Financial Planning Workshop',
      description: 'Learn budgeting strategies for your local economy',
      date: '2024-02-15',
      location: 'Community Center',
      type: 'workshop',
      cost: 'free',
    },
    {
      id: '2',
      title: 'Local Investment Seminar',
      description: 'Discover investment opportunities in your area',
      date: '2024-02-20',
      location: 'Business District',
      type: 'seminar',
      cost: 25,
    },
  ])

  const [localizedTips, setLocalizedTips] = useState<string[]>([])

  const [dailyRoutines, setDailyRoutines] = useState<DailyRoutine[]>([
    {
      id: '1',
      time: '07:30',
      activity: 'Morning Coffee',
      budgetLimit: 5,
      category: 'Food',
      tips: [
        'Make coffee at home to save $4 daily',
        'Use a rewards card at local cafes',
        'Consider a monthly coffee subscription'
      ],
      notification: true
    },
    {
      id: '2',
      time: '12:00',
      activity: 'Lunch Break',
      budgetLimit: 15,
      category: 'Food',
      tips: [
        'Meal prep on Sundays to save $10/day',
        'Check local lunch specials',
        'Use food delivery membership for free delivery'
      ],
      notification: true
    },
    {
      id: '3',
      time: '17:00',
      activity: 'Grocery Shopping',
      budgetLimit: 50,
      category: 'Food',
      tips: [
        'Check weekly store promotions',
        'Buy in bulk for non-perishables',
        'Use store loyalty program'
      ],
      notification: true
    },
    {
      id: '4',
      time: '19:00',
      activity: 'Dinner',
      budgetLimit: 25,
      category: 'Food',
      tips: [
        'Cook at home to save $20+',
        'Use leftover ingredients',
        'Plan meals around sales'
      ],
      notification: true
    }
  ])

  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showBudgetPlanner, setShowBudgetPlanner] = useState(false)

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  useEffect(() => {
    // Get user's location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          // In a real app, you would use a geocoding service to get the location details
          // For demo purposes, we'll set a default location
          setUserLocation({
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
          })

          // Update tips based on location
          updateLocalizedTips()
        } catch (error) {
          console.error('Error getting location details:', error)
        }
      })
    }
  }, [])

  const updateLocalizedTips = () => {
    // In a real app, these would be generated based on actual local data
    setLocalizedTips([
      'Local gas prices are lowest on Tuesdays in your area',
      'Your neighborhood farmers market offers 20% discounts after 4 PM',
      'Nearby grocery stores have better prices on weekday mornings',
      'Local utility companies offer special rates during off-peak hours',
    ])
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
    }
  }

  const scheduleNotification = (payment: ScheduledPayment) => {
    if (notificationPermission === 'granted') {
      // Schedule notification based on payment.dueDate and payment.reminderTime
      const notificationTime = new Date(payment.dueDate)
      const [hours, minutes] = payment.reminderTime?.split(':') || ['9', '0']
      notificationTime.setHours(parseInt(hours), parseInt(minutes))

      const timeUntilNotification = notificationTime.getTime() - new Date().getTime()
      if (timeUntilNotification > 0) {
        setTimeout(() => {
          new Notification('Payment Reminder', {
            body: `${payment.description} - $${payment.amount} due today`,
            icon: '/favicon.ico'
          })
        }, timeUntilNotification)
      }
    }
  }

  const addScheduledPayment = (payment: Omit<ScheduledPayment, 'id'>) => {
    const newPayment = {
      ...payment,
      id: Date.now().toString()
    }
    setScheduledPayments(prev => [...prev, newPayment])
    scheduleNotification(newPayment)
  }

  const updateDailyPlan = (date: string) => {
    // In a real app, this would fetch the plan from the backend
    setDailyPlan({
      date,
      budget: 100,
      spent: 45,
      remainingBudget: 55,
      plannedExpenses: [
        { description: 'Lunch', amount: 15, time: '12:30' },
        { description: 'Coffee', amount: 5, time: '15:00' },
        { description: 'Dinner', amount: 25, time: '19:00' },
      ],
    })
  }

  const completeActionItem = (id: string) => {
    setActionItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: true } : item
      )
    )
  }

  const addGoal = (goal: Omit<FinancialGoal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
    }
    setGoals(prev => [...prev, newGoal])
  }

  const scheduleRoutineNotification = (routine: DailyRoutine) => {
    if (notificationPermission === 'granted' && routine.notification) {
      const [hours, minutes] = routine.time.split(':')
      const notificationTime = new Date()
      notificationTime.setHours(parseInt(hours), parseInt(minutes), 0)

      // If time has passed today, schedule for tomorrow
      if (notificationTime.getTime() < Date.now()) {
        notificationTime.setDate(notificationTime.getDate() + 1)
      }

      const timeUntilNotification = notificationTime.getTime() - Date.now()
      
      setTimeout(() => {
        new Notification('Daily Budget Reminder', {
          body: `${routine.activity} - Budget Limit: $${routine.budgetLimit}\nTip: ${routine.tips[0]}`,
          icon: '/favicon.ico'
        })
        // Reschedule for next day
        scheduleRoutineNotification(routine)
      }, timeUntilNotification)
    }
  }

  useEffect(() => {
    // Schedule all routine notifications
    if (notificationPermission === 'granted') {
      dailyRoutines.forEach(routine => {
        scheduleRoutineNotification(routine)
      })
    }
  }, [notificationPermission, dailyRoutines])

  useEffect(() => {
    generateSmartSuggestions()
  }, [categories, dailyRoutines, actionItems, personalizedTips])

  const generateSmartSuggestions = () => {
    const suggestions: SmartSuggestion[] = []

    // Analyze spending patterns by category
    categories.forEach(category => {
      const spendingRatio = category.spent / category.limit
      if (spendingRatio > 0.9) {
        suggestions.push({
          id: `cat-${category.id}`,
          type: 'support',
          title: `High Spending in ${category.name}`,
          description: `You've used ${Math.round(spendingRatio * 100)}% of your ${category.name} budget`,
          impact: {
            monthly: category.spent - category.limit,
            yearly: (category.spent - category.limit) * 12
          },
          difficulty: 'medium',
          timeframe: 'immediate',
          steps: [
            `Review your ${category.name} expenses`,
            'Identify non-essential spending',
            'Consider alternative options',
            'Set up category-specific alerts'
          ],
          category: category.name,
          emotionalContext: {
            tone: 'understanding',
            message: "It's normal to occasionally exceed budgets. Let's work together to get back on track.",
            followUp: "Remember, small adjustments can make a big difference!"
          },
          behaviorInsight: {
            pattern: "Frequent small purchases might be adding up quickly",
            suggestion: "Try tracking daily expenses in this category for a week",
            positiveReinforcement: "You've successfully managed other categories well!"
          }
        })
      }
    })

    // Add behavioral nudges based on spending patterns
    if (personalizedTips.length > 0) {
      suggestions.push({
        id: 'nudge-1',
        type: 'nudge',
        title: 'Small Changes, Big Impact',
        description: 'Here are some gentle reminders to help you stay on track',
        impact: {
          monthly: 200,
          yearly: 2400
        },
        difficulty: 'easy',
        timeframe: 'immediate',
        steps: personalizedTips,
        emotionalContext: {
          tone: 'encouraging',
          message: "You're making progress! Here are some tips to help you go further.",
          followUp: "Every small step counts towards your financial goals."
        },
        behaviorInsight: {
          pattern: "You're showing interest in improving your finances",
          suggestion: "Let's build on your momentum with these simple actions",
          positiveReinforcement: "Your commitment to financial growth is admirable!"
        }
      })
    }

    // Analyze daily routines for optimization
    dailyRoutines.forEach(routine => {
      const potentialSavings = routine.tips.reduce((acc, tip) => {
        const match = tip.match(/\$(\d+)/)
        return acc + (match ? parseInt(match[1]) : 0)
      }, 0)

      if (potentialSavings > 0) {
        suggestions.push({
          id: `routine-${routine.id}`,
          type: 'habit',
          title: `Optimize Your ${routine.activity}`,
          description: `Small changes to your ${routine.activity.toLowerCase()} routine could save you money`,
          impact: {
            monthly: potentialSavings * 30,
            yearly: potentialSavings * 365
          },
          difficulty: 'easy',
          timeframe: 'short_term',
          steps: routine.tips,
          relatedRoutine: routine
        })
      }
    })

    // Generate goal-based suggestions
    goals.forEach(goal => {
      const remaining = goal.targetAmount - goal.currentAmount
      const monthsToDeadline = Math.ceil(
        (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
      )
      
      if (remaining > 0 && monthsToDeadline > 0) {
        const monthlyRequired = remaining / monthsToDeadline
        suggestions.push({
          id: `goal-${goal.id}`,
          type: 'goal',
          title: `Boost Your ${goal.title} Progress`,
          description: `To reach your goal by ${new Date(goal.deadline).toLocaleDateString()}, you need to save ${formatAmount(monthlyRequired)} monthly`,
          impact: {
            monthly: monthlyRequired,
            yearly: monthlyRequired * 12
          },
          difficulty: monthlyRequired > 500 ? 'hard' : 'medium',
          timeframe: 'long_term',
          steps: [
            `Set up automatic transfer of ${formatAmount(monthlyRequired)} monthly`,
            'Review and reduce non-essential expenses',
            'Look for additional income opportunities',
            'Track progress weekly'
          ]
        })
      }
    })

    // Add local offers-based suggestions
    localOffers.forEach(offer => {
      suggestions.push({
        id: `offer-${offer.id}`,
        type: 'saving',
        title: `Save on ${offer.category}`,
        description: offer.description,
        impact: {
          monthly: offer.savings,
          yearly: offer.savings * 12
        },
        difficulty: 'easy',
        timeframe: 'immediate',
        steps: [
          `Visit ${offer.location}`,
          'Show the offer at checkout',
          'Consider bulk purchase if applicable',
          'Check for additional loyalty rewards'
        ],
        category: offer.category
      })
    })

    // Sort suggestions by impact and priority
    const sortedSuggestions = suggestions.sort((a, b) => {
      // Prioritize immediate and high-impact suggestions
      const aScore = (a.timeframe === 'immediate' ? 3 : a.timeframe === 'short_term' ? 2 : 1) *
        (a.impact.monthly > 100 ? 3 : a.impact.monthly > 50 ? 2 : 1)
      const bScore = (b.timeframe === 'immediate' ? 3 : b.timeframe === 'short_term' ? 2 : 1) *
        (b.impact.monthly > 100 ? 3 : b.impact.monthly > 50 ? 2 : 1)
      return bScore - aScore
    })

    setSmartSuggestions(sortedSuggestions)
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Overview Section */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-lg sm:rounded-xl overflow-hidden">
        <div className="backdrop-blur-sm bg-black/5 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="max-w-[600px]">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                Smart Budget Planning
              </h2>
              <p className="text-sm sm:text-base text-primary-200 mt-2">
                Let me help you manage your money wisely and achieve your financial goals
              </p>
            </div>
          </div>

          {/* Budget Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 hover:bg-white/15 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm sm:text-base font-medium text-white">{category.name}</h3>
                  <div className={`h-2 w-2 rounded-full ${category.color}`} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-primary-200">Spent</span>
                    <span className="text-white font-medium">${category.spent}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-primary-200">Limit</span>
                    <span className="text-white font-medium">${category.limit}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color} transition-all duration-500`}
                      style={{ width: `${(category.spent / category.limit) * 100}%` }}
                    />
                  </div>
                  <div className="text-right text-xs text-primary-200">
                    {Math.round((category.spent / category.limit) * 100)}% used
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scheduled Payments */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Upcoming Payments</h3>
              <Tippy content="I'll help you stay on top of your bills">
                <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tippy>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium">
              <PlusIcon className="h-4 w-4" />
              Add Payment
            </button>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {scheduledPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900">{payment.description}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs sm:text-sm text-gray-500">
                        Due {new Date(payment.dueDate).toLocaleDateString()}
                      </span>
                      {payment.isRecurring && (
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                          {payment.frequency}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm sm:text-base font-semibold text-gray-900">
                      ${payment.amount}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Budget Plan */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Today's Budget</h3>
              <Tippy content="I'll help you plan your daily spending">
                <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tippy>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-500">Daily Budget</span>
                <span className="text-sm sm:text-base font-semibold text-gray-900">${dailyPlan.budget}</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-500"
                  style={{ width: `${(dailyPlan.spent / dailyPlan.budget) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-500">Spent: ${dailyPlan.spent}</span>
                <span className="text-gray-500">Remaining: ${dailyPlan.remainingBudget}</span>
              </div>
            </div>

            {dailyPlan.plannedExpenses.map((expense, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900">{expense.description}</h4>
                    <span className="text-xs sm:text-sm text-gray-500">{expense.time}</span>
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">${expense.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Goals */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Your Goals</h3>
              <Tippy content="I'll help you track and achieve your financial goals">
                <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tippy>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium">
              <PlusIcon className="h-4 w-4" />
              Add Goal
            </button>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900">{goal.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs sm:text-sm text-gray-500">
                        Due {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${goal.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
                        ${goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${goal.priority === 'low' ? 'bg-green-100 text-green-700' : ''}
                      `}>
                        {goal.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm sm:text-base font-semibold text-gray-900">
                      ${goal.currentAmount} / ${goal.targetAmount}
                    </span>
                    <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 transition-all duration-500"
                        style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Goal Visualizer */}
          {goalVisualizations.map((visualization) => {
            const goal = goals.find(g => g.id === visualization.goalId)
            if (!goal) return null

            return (
              <div key={visualization.id} className="mt-6 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-medium text-gray-900 flex items-center gap-2">
                      <SparklesIcon className="h-5 w-5 text-primary-500" />
                      Goal Progress Visualizer
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      See how your daily actions compound towards {goal.title.toLowerCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">Target: {formatAmount(goal.targetAmount)}</div>
                    <div className="text-xs text-gray-600">by {new Date(goal.deadline).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Daily Actions Impact */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Small Actions, Big Impact</h5>
                  <div className="grid gap-3">
                    {visualization.dailyActions.map(action => (
                      <div key={action.id} className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{action.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Save {formatAmount(action.amount)} {action.frequency}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-green-600">
                              Monthly: {formatAmount(action.impact.monthly)}
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              Yearly: {formatAmount(action.impact.yearly)}
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              5 Years: {formatAmount(action.impact.fiveYear)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          With compound effect: {((action.compoundingEffect - 1) * 100).toFixed(0)}% extra growth
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projections */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Future Projections</h5>
                  <div className="space-y-3">
                    {['conservative', 'expected', 'optimistic'].map((scenario) => (
                      <div key={scenario} className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium capitalize text-gray-900">
                            {scenario} Scenario
                          </span>
                        </div>
                        <div className="space-y-2">
                          {visualization.projections[scenario as keyof typeof visualization.projections].map((point, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {new Date(point.date).toLocaleDateString()}
                              </span>
                              <span className="text-green-600 font-medium">
                                {formatAmount(point.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Achievement Milestones</h5>
                  <div className="space-y-3">
                    {visualization.milestones.map((milestone) => (
                      <div key={milestone.id} className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 p-1 rounded-full ${milestone.achieved ? 'text-green-500 bg-green-100' : 'text-gray-400 bg-gray-100'}`}>
                            <CheckCircleIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{milestone.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                Target: {formatAmount(milestone.amount)}
                              </span>
                              <span className="text-xs text-gray-500">
                                By: {new Date(milestone.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-2">
                              {milestone.tips.map((tip, index) => (
                                <div key={index} className="text-xs text-gray-600 flex items-start gap-1 mt-1">
                                  <ArrowRightIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  {tip}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Action Items</h3>
              <Tippy content="I'll help you stay on track with important financial tasks">
                <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tippy>
            </div>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className={`
                  bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors
                  ${item.completed ? 'opacity-75' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => completeActionItem(item.id)}
                    className={`
                      mt-1 p-1 rounded-full transition-colors
                      ${item.completed ? 'text-green-500 bg-green-100' : 'text-gray-400 hover:text-gray-600'}
                    `}
                  >
                    <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-medium text-gray-900">{item.title}</h4>
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${item.type === 'task' ? 'bg-blue-100 text-blue-700' : ''}
                        ${item.type === 'reminder' ? 'bg-purple-100 text-purple-700' : ''}
                        ${item.type === 'suggestion' ? 'bg-green-100 text-green-700' : ''}
                      `}>
                        {item.type}
                      </span>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600">{item.description}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-xs sm:text-sm text-gray-500">
                          Due {new Date(item.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {/* Feature Connections */}
                      {item.impactedFeatures && (
                        <div className="flex items-center gap-2">
                          <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                          <div className="flex gap-1">
                            {item.impactedFeatures.map(feature => (
                              <Link
                                key={feature}
                                href={`/dashboard/${feature.toLowerCase().replace(' ', '-')}`}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors"
                              >
                                {feature}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Local Offers */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Money-Saving Opportunities</h3>
              <Tippy content="I've found these local deals that match your spending habits">
                <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tippy>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {localOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary-100">
                    <TagIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900">{offer.title}</h4>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600">{offer.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <span>{offer.location}</span>
                      <span>•</span>
                      <span>{offer.distance}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Save ${offer.savings}
                      </span>
                      <span className="text-xs text-gray-500">
                        Expires {new Date(offer.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Suggestions */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <LightBulbIcon className="h-5 w-5 text-primary-500" />
                Smart Money-Saving Suggestions
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Personalized recommendations based on your current spending patterns and habits
              </p>
            </div>
            <Tippy content="These suggestions are updated daily based on your transactions and budget usage">
              <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tippy>
          </div>

          <div className="grid gap-4">
            {smartSuggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    p-2 rounded-lg
                    ${suggestion.type === 'saving' ? 'bg-green-100 text-green-600' : ''}
                    ${suggestion.type === 'budget_adjustment' ? 'bg-blue-100 text-blue-600' : ''}
                    ${suggestion.type === 'habit' ? 'bg-purple-100 text-purple-600' : ''}
                    ${suggestion.type === 'goal' ? 'bg-amber-100 text-amber-600' : ''}
                    ${suggestion.type === 'alert' ? 'bg-red-100 text-red-600' : ''}
                    ${suggestion.type === 'support' ? 'bg-yellow-100 text-yellow-600' : ''}
                    ${suggestion.type === 'nudge' ? 'bg-pink-100 text-pink-600' : ''}
                  `}>
                    {suggestion.type === 'saving' && <SparklesIcon className="h-5 w-5" />}
                    {suggestion.type === 'budget_adjustment' && <ChartBarIcon className="h-5 w-5" />}
                    {suggestion.type === 'habit' && <LightBulbIcon className="h-5 w-5" />}
                    {suggestion.type === 'goal' && <StarIcon className="h-5 w-5" />}
                    {suggestion.type === 'alert' && <ExclamationTriangleIcon className="h-5 w-5" />}
                    {suggestion.type === 'support' && <LightBulbIcon className="h-5 w-5" />}
                    {suggestion.type === 'nudge' && <ExclamationTriangleIcon className="h-5 w-5" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                      <span className={`
                        text-xs px-2 py-1 rounded-full
                        ${suggestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' : ''}
                        ${suggestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${suggestion.difficulty === 'hard' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {suggestion.difficulty} to implement
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-600">{suggestion.description}</p>

                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <div className="text-green-600">
                        <span className="font-medium">Monthly impact: </span>
                        {formatAmount(suggestion.impact.monthly)}
                      </div>
                      <div className="text-green-600">
                        <span className="font-medium">Yearly impact: </span>
                        {formatAmount(suggestion.impact.yearly)}
                      </div>
                    </div>

                    {suggestion.emotionalContext && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-3">
                        <div className={`text-sm ${
                          suggestion.emotionalContext.tone === 'encouraging' ? 'text-green-600' :
                          suggestion.emotionalContext.tone === 'reassuring' ? 'text-blue-600' :
                          suggestion.emotionalContext.tone === 'celebratory' ? 'text-purple-600' :
                          suggestion.emotionalContext.tone === 'motivating' ? 'text-amber-600' :
                          'text-gray-600'
                        }`}>
                          {suggestion.emotionalContext.message}
                        </div>
                        {suggestion.emotionalContext.followUp && (
                          <div className="text-xs text-gray-500 mt-2">
                            {suggestion.emotionalContext.followUp}
                          </div>
                        )}
                      </div>
                    )}

                    {suggestion.behaviorInsight && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-start gap-2">
                          <ChartBarIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div className="text-sm text-gray-600">{suggestion.behaviorInsight.pattern}</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <LightBulbIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div className="text-sm text-gray-600">{suggestion.behaviorInsight.suggestion}</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <StarIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div className="text-sm text-gray-600">{suggestion.behaviorInsight.positiveReinforcement}</div>
                        </div>
                      </div>
                    )}

                    {suggestion.steps && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">How to achieve this:</p>
                        <ul className="space-y-1">
                          {suggestion.steps.map((step, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <ArrowRightIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {suggestion.relatedRoutine && (
                      <div className="mt-3 flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Related to your {suggestion.relatedRoutine.activity.toLowerCase()} routine
                        </span>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-3">
                      <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                        Apply This Suggestion
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                      {suggestion.type !== 'alert' && (
                        <button 
                          onClick={() => {
                            if (suggestion.relatedRoutine) {
                              suggestion.relatedRoutine.notification = !suggestion.relatedRoutine.notification
                            }
                          }}
                          className="text-sm text-gray-600 hover:text-gray-700 flex items-center gap-1"
                        >
                          <BellIcon className="h-4 w-4" />
                          {suggestion.relatedRoutine?.notification ? 'Disable' : 'Enable'} Reminders
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Impact Summary */}
      <div className="mt-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">How Your Budget Affects Other Areas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ChartBarIcon className="h-5 w-5 text-primary-500" />
              <h4 className="font-medium">Investment Impact</h4>
            </div>
            <p className="text-sm text-gray-600">See how your budget changes affect investment opportunities</p>
            <Link
              href="/dashboard/investments"
              className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              View Investment Advisor
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BanknotesIcon className="h-5 w-5 text-primary-500" />
              <h4 className="font-medium">Wealth Growth</h4>
            </div>
            <p className="text-sm text-gray-600">Track how budgeting decisions impact your wealth goals</p>
            <Link
              href="/dashboard/wealth"
              className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              Check Wealth Overview
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCircleIcon className="h-5 w-5 text-primary-500" />
              <h4 className="font-medium">AI Insights</h4>
            </div>
            <p className="text-sm text-gray-600">Get personalized recommendations based on your budget</p>
            <Link
              href="/dashboard/insights"
              className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              View Insights
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 