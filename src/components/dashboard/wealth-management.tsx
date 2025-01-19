'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import {
  BanknotesIcon,
  HomeIcon,
  AcademicCapIcon,
  HeartIcon,
  RocketLaunchIcon,
  ArrowTrendingUpIcon,
  CircleStackIcon,
  GlobeAltIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

interface FinancialGoal {
  id: string
  name: string
  icon: JSX.Element
  targetAmount: number
  currentAmount: number
  targetDate: string
  progress: number
  strategy: string
  aiRecommendations: string[]
}

interface AssetAllocation {
  category: string
  percentage: number
  amount: number
  change: number
  color: string
}

const mockGoals: FinancialGoal[] = [
  {
    id: '1',
    name: 'Retirement Fund',
    icon: <BanknotesIcon className="h-6 w-6" />,
    targetAmount: 2000000,
    currentAmount: 850000,
    targetDate: '2045',
    progress: 42.5,
    strategy: 'Aggressive Growth',
    aiRecommendations: [
      'Increase monthly contributions by 15% to stay on track',
      'Consider diversifying into emerging market ETFs',
      'Review tax-optimization strategies quarterly'
    ]
  },
  {
    id: '2',
    name: 'Home Purchase',
    icon: <HomeIcon className="h-6 w-6" />,
    targetAmount: 300000,
    currentAmount: 175000,
    targetDate: '2025',
    progress: 58.3,
    strategy: 'Conservative',
    aiRecommendations: [
      'Current savings rate will meet goal ahead of schedule',
      'Consider high-yield savings account for better returns',
      'Start researching mortgage pre-approval options'
    ]
  },
  {
    id: '3',
    name: 'Children\'s Education',
    icon: <AcademicCapIcon className="h-6 w-6" />,
    targetAmount: 400000,
    currentAmount: 120000,
    targetDate: '2035',
    progress: 30,
    strategy: 'Balanced Growth',
    aiRecommendations: [
      'Open a 529 plan for tax advantages',
      'Increase monthly contribution to $1,500',
      'Consider prepaid tuition plans'
    ]
  }
]

const assetAllocation: AssetAllocation[] = [
  { category: 'Stocks', percentage: 45, amount: 472500, change: 8.5, color: 'bg-blue-500' },
  { category: 'Bonds', percentage: 25, amount: 262500, change: 3.2, color: 'bg-green-500' },
  { category: 'Real Estate', percentage: 15, amount: 157500, change: 5.7, color: 'bg-yellow-500' },
  { category: 'Crypto', percentage: 10, amount: 105000, change: 12.3, color: 'bg-purple-500' },
  { category: 'Cash', percentage: 5, amount: 52500, change: 0.5, color: 'bg-gray-500' }
]

export default function WealthManagement() {
  const [selectedGoal, setSelectedGoal] = useState<string>(mockGoals[0].id)
  const totalPortfolio = assetAllocation.reduce((sum, asset) => sum + asset.amount, 0)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Portfolio Overview */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-semibold">Here's how your wealth is growing</h2>
              <Tippy content="I'm tracking all your assets to help you grow your wealth">
                <button className="focus:outline-none">
                  <InformationCircleIcon className="h-5 w-5 text-primary-200 hover:text-primary-100" />
                </button>
              </Tippy>
            </div>
            <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">${totalPortfolio.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-primary-200 mt-1">You've grown your wealth by 7.8% this month!</p>
          </div>
          <div className="flex items-center space-x-2">
            <Tippy content="I'm actively monitoring your portfolio performance">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary-700/50 flex items-center justify-center flex-shrink-0 cursor-help">
                <CircleStackIcon className="h-4 w-4 sm:h-6 sm:w-6 text-primary-200" />
              </div>
            </Tippy>
          </div>
        </div>

        {/* Asset Allocation Chart */}
        <div className="mt-6">
          <Tippy content="Let me show you how your investments are spread out">
            <div className="flex h-3 sm:h-4 rounded-full overflow-hidden cursor-help">
              {assetAllocation.map((asset) => (
                <div
                  key={asset.category}
                  className={`${asset.color}`}
                  style={{ width: `${asset.percentage}%` }}
                />
              ))}
            </div>
          </Tippy>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {assetAllocation.map((asset) => (
              <Tippy
                key={asset.category}
                content={`Your ${asset.category} investments: $${asset.amount.toLocaleString()} | Growth: ${asset.change > 0 ? '+' : ''}${asset.change}%`}
              >
                <div className="cursor-help">
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full ${asset.color}`} />
                    <span className="text-xs sm:text-sm truncate">{asset.category}</span>
                  </div>
                  <p className="text-sm sm:text-lg font-semibold mt-1">{asset.percentage}%</p>
                  <p className="text-[10px] sm:text-xs text-primary-200">
                    {asset.change > 0 ? 'Up ' : 'Down '}{Math.abs(asset.change)}%
                  </p>
                </div>
              </Tippy>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Goals */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Let's track your financial goals</h3>
          <Tippy content="I'll help you reach your goals with personalized recommendations">
            <button className="focus:outline-none">
              <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          </Tippy>
        </div>
        <div className="grid gap-4 sm:gap-6">
          {mockGoals.map((goal, index) => (
            <Tippy
              key={goal.id}
              content={`You're ${goal.progress}% of the way there! Strategy: ${goal.strategy}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-colors cursor-pointer ${
                  selectedGoal === goal.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-100 hover:border-primary-200'
                }`}
                onClick={() => setSelectedGoal(goal.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                      selectedGoal === goal.id ? 'bg-primary-100' : 'bg-gray-100'
                    }`}>
                      {goal.icon}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-lg font-semibold text-gray-900">{goal.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        We're aiming for ${goal.targetAmount.toLocaleString()} by {goal.targetDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base sm:text-lg font-semibold text-primary-600">
                      ${goal.currentAmount.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">You've saved so far</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
                    <span>Your progress</span>
                    <span>{goal.progress}% there!</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-primary-500 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {selectedGoal === goal.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 sm:mt-6"
                  >
                    <div className="bg-white rounded-lg p-3 sm:p-4">
                      <h5 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Here's what I recommend</h5>
                      <ul className="space-y-2">
                        {goal.aiRecommendations.map((recommendation, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <RocketLaunchIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-gray-600 line-clamp-2">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </Tippy>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <Tippy content="Let me help you optimize your portfolio">
          <button className="flex items-center justify-center space-x-2 p-3 sm:p-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-xs sm:text-sm">
            <GlobeAltIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>I'll rebalance your portfolio</span>
          </button>
        </Tippy>
        <Tippy content="Let's set up a new financial goal together">
          <button className="flex items-center justify-center space-x-2 p-3 sm:p-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-xs sm:text-sm">
            <ArrowTrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Let's add a new goal</span>
          </button>
        </Tippy>
        <Tippy content="I'll analyze your portfolio and give you personalized advice">
          <button className="flex items-center justify-center space-x-2 p-3 sm:p-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-xs sm:text-sm">
            <RocketLaunchIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Get my insights</span>
          </button>
        </Tippy>
      </div>
    </div>
  )
} 