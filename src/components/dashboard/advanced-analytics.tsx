'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon, SparklesIcon, InformationCircleIcon, ChartBarIcon, BanknotesIcon, RocketLaunchIcon, DocumentTextIcon, ChartPieIcon } from '@heroicons/react/24/outline'
import Tippy from '@tippyjs/react'

const mockData = {
  monthly: [
    { name: 'Jan', income: 4000, expenses: 2400, savings: 1600 },
    { name: 'Feb', income: 3500, expenses: 2100, savings: 1400 },
    { name: 'Mar', income: 5000, expenses: 2800, savings: 2200 },
    { name: 'Apr', income: 4200, expenses: 2300, savings: 1900 },
    { name: 'May', income: 4800, expenses: 2600, savings: 2200 },
    { name: 'Jun', income: 5200, expenses: 2900, savings: 2300 },
  ],
  categories: [
    { name: 'Housing', amount: 1200, percentage: 35 },
    { name: 'Food', amount: 600, percentage: 18 },
    { name: 'Transport', amount: 400, percentage: 12 },
    { name: 'Utilities', amount: 300, percentage: 9 },
    { name: 'Entertainment', amount: 250, percentage: 7 },
    { name: 'Others', amount: 650, percentage: 19 },
  ],
  predictions: [
    { month: 'Jul', predicted: 5400, lower: 5100, upper: 5700 },
    { month: 'Aug', predicted: 5600, lower: 5200, upper: 6000 },
    { month: 'Sep', predicted: 5800, lower: 5300, upper: 6300 },
  ]
}

const COLORS = ['#4F46E5', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']

export default function AdvancedAnalytics() {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('6M')
  const [focusArea, setFocusArea] = useState<'overview' | 'spending' | 'prediction'>('overview')
  const [selectedChart, setSelectedChart] = useState<'area' | 'pie'>('area')

  const stats = [
    {
      title: 'Portfolio Alpha',
      value: '+28.5%',
      change: '+15.3%',
      trend: 'up',
      description: "Your AI-optimized strategy is outperforming the market significantly",
      icon: <CurrencyDollarIcon className="h-5 w-5 text-emerald-400" />
    },
    {
      title: 'Wealth Acceleration',
      value: '3.8x',
      change: '+2.1x',
      trend: 'up',
      description: "Your empire is growing faster than 98% of users",
      icon: <ArrowTrendingUpIcon className="h-5 w-5 text-blue-400" />
    },
    {
      title: 'Risk-Adjusted Returns',
      value: '2.1 Sharpe',
      change: '+0.8',
      trend: 'up',
      description: "Your portfolio's efficiency is at institutional grade levels",
      icon: <ArrowTrendingDownIcon className="h-5 w-5 text-violet-400" />
    },
    {
      title: 'AI Confidence Score',
      value: '94.8%',
      change: '+5.2%',
      trend: 'up',
      description: "Our quantum models have high conviction in your strategy",
      icon: <SparklesIcon className="h-5 w-5 text-amber-400" />
    }
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Tippy content="I'll create a detailed report that helps you understand your finances better">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            <DocumentTextIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Let's review your progress together</span>
          </motion.button>
        </Tippy>
        <Tippy content="I'll help you set achievable goals and create a plan to reach them">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            <RocketLaunchIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Plan your next financial milestone</span>
          </motion.button>
        </Tippy>
      </div>

      {/* Enhanced Charts Section */}
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
                <AreaChart data={mockData.monthly}>
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
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
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
                    dataKey="income"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                    name="Expenses"
                  />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSavings)"
                    name="Savings"
                  />
                </AreaChart>
              ) : (
                <PieChart>
                  <Pie
                    data={mockData.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {mockData.categories.map((entry, index) => (
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
                    formatter={(value: number) => [`$${value}`, 'Amount']}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Legend for Pie Chart */}
          {selectedChart === 'pie' && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mockData.categories.map((category, index) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm text-gray-600">{category.name}</span>
                  <span className="text-sm font-medium text-gray-900">${category.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Predictions Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <RocketLaunchIcon className="h-5 w-5 text-primary-500" />
                Looking Ahead
              </h3>
              <p className="text-sm text-gray-600 mt-1">Here's what I predict for your next few months</p>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.predictions}>
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
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ fill: '#4F46E5', r: 4 }}
                  name="Predicted"
                />
                <Line
                  type="monotone"
                  dataKey="upper"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Optimistic"
                />
                <Line
                  type="monotone"
                  dataKey="lower"
                  stroke="#EF4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Conservative"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
} 