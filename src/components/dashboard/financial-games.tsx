'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrophyIcon,
  ChartBarIcon,
  SparklesIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

interface GameScenario {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'investing' | 'saving' | 'budgeting' | 'business'
  duration: number // in minutes
  rewards: {
    points: number
    badges: string[]
    insights: string[]
  }
  progress: number
}

interface PortfolioSimulation {
  id: string
  initialAmount: number
  currentValue: number
  assets: {
    type: string
    allocation: number
    performance: number
  }[]
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
  timeHorizon: number // in years
  monthlyContribution: number
  projectedValue: number
}

interface LeaderboardEntry {
  id: string
  rank: number
  username: string // anonymized
  achievement: string
  score: number
  badge: string
  category: 'saving' | 'investing' | 'budgeting' | 'overall'
  trend: 'up' | 'down' | 'stable'
}

interface Achievement {
  id: string
  title: string
  description: string
  progress: number
  reward: string
  dateEarned?: string
}

export default function FinancialGames() {
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [scenarios, setScenarios] = useState<GameScenario[]>([
    {
      id: '1',
      title: 'Build a Millionaire Portfolio',
      description: 'Start with $10,000 and make investment decisions to reach $1 million',
      difficulty: 'intermediate',
      category: 'investing',
      duration: 20,
      rewards: {
        points: 1000,
        badges: ['Investment Guru', 'Portfolio Master'],
        insights: ['Risk management strategies', 'Diversification principles']
      },
      progress: 45
    },
    {
      id: '2',
      title: 'Emergency Fund Challenge',
      description: 'Build a 6-month emergency fund through smart budgeting decisions',
      difficulty: 'beginner',
      category: 'saving',
      duration: 15,
      rewards: {
        points: 500,
        badges: ['Safety Net Builder', 'Financial Planner'],
        insights: ['Expense prioritization', 'Saving strategies']
      },
      progress: 30
    },
    {
      id: '3',
      title: 'Start-up Simulator',
      description: 'Manage a virtual business and make critical financial decisions',
      difficulty: 'advanced',
      category: 'business',
      duration: 30,
      rewards: {
        points: 1500,
        badges: ['Business Tycoon', 'Strategic Planner'],
        insights: ['Cash flow management', 'Business growth strategies']
      },
      progress: 10
    }
  ])

  const [portfolioSim, setPortfolioSim] = useState<PortfolioSimulation>({
    id: '1',
    initialAmount: 10000,
    currentValue: 12500,
    assets: [
      { type: 'Stocks', allocation: 60, performance: 8.5 },
      { type: 'Bonds', allocation: 30, performance: 4.2 },
      { type: 'Cash', allocation: 10, performance: 1.5 }
    ],
    riskLevel: 'moderate',
    timeHorizon: 20,
    monthlyContribution: 500,
    projectedValue: 1200000
  })

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: '1',
      rank: 1,
      username: 'Saver123',
      achievement: 'Highest Monthly Savings Rate',
      score: 2500,
      badge: '🏆',
      category: 'saving',
      trend: 'up'
    },
    {
      id: '2',
      rank: 2,
      username: 'InvestPro',
      achievement: 'Best Portfolio Returns',
      score: 2200,
      badge: '📈',
      category: 'investing',
      trend: 'stable'
    },
    {
      id: '3',
      rank: 3,
      username: 'BudgetMaster',
      achievement: 'Most Consistent Budget Adherence',
      score: 2000,
      badge: '⭐',
      category: 'budgeting',
      trend: 'up'
    }
  ])

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Portfolio Pioneer',
      description: 'Created first diversified investment portfolio',
      progress: 100,
      reward: '500 points',
      dateEarned: '2024-01-15'
    },
    {
      id: '2',
      title: 'Savings Superstar',
      description: 'Maintained positive savings rate for 3 months',
      progress: 75,
      reward: '750 points'
    }
  ])

  return (
    <div className="space-y-6 pt-6">
      {/* Games Header */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <TrophyIcon className="h-6 w-6" />
              Financial Games & Challenges
            </h2>
            <p className="text-primary-100">
              Learn and earn through interactive financial simulations
            </p>
          </div>
          <div className="text-right text-primary-100">
            <div className="text-2xl font-bold">{achievements.length}</div>
            <div className="text-sm">Achievements Earned</div>
          </div>
        </div>
      </div>

      {/* Game Scenarios */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all cursor-pointer"
              onClick={() => setActiveGame(scenario.id)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  scenario.category === 'investing' ? 'bg-blue-100 text-blue-600' :
                  scenario.category === 'saving' ? 'bg-green-100 text-green-600' :
                  scenario.category === 'budgeting' ? 'bg-purple-100 text-purple-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  {scenario.category === 'investing' && <ChartBarIcon className="h-5 w-5" />}
                  {scenario.category === 'saving' && <BanknotesIcon className="h-5 w-5" />}
                  {scenario.category === 'budgeting' && <BuildingLibraryIcon className="h-5 w-5" />}
                  {scenario.category === 'business' && <ArrowTrendingUpIcon className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{scenario.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      scenario.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      scenario.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {scenario.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{scenario.duration} min</span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-1">Progress</div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 transition-all duration-500"
                        style={{ width: `${scenario.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Portfolio Simulation */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Millionaire Portfolio Simulator</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900">Current Portfolio</h4>
              <div className="mt-3 space-y-3">
                {portfolioSim.assets.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                      <span className="text-sm text-gray-600">{asset.type}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-900 font-medium">{asset.allocation}%</span>
                      <span className="text-green-600 ml-2">+{asset.performance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900">Simulation Settings</h4>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Risk Level</span>
                  <span className="font-medium text-gray-900">{portfolioSim.riskLevel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time Horizon</span>
                  <span className="font-medium text-gray-900">{portfolioSim.timeHorizon} years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Contribution</span>
                  <span className="font-medium text-gray-900">${portfolioSim.monthlyContribution}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-900">Projected Growth</h4>
            <div className="mt-4 space-y-4">
              <div>
                <div className="text-sm text-gray-600">Initial Investment</div>
                <div className="text-2xl font-bold text-gray-900">${portfolioSim.initialAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Current Value</div>
                <div className="text-2xl font-bold text-green-600">${portfolioSim.currentValue.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Projected Value (in {portfolioSim.timeHorizon} years)</div>
                <div className="text-2xl font-bold text-primary-600">${portfolioSim.projectedValue.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Elite Leaderboard</h3>
          <div className="flex gap-2">
            {['overall', 'saving', 'investing', 'budgeting'].map((category) => (
              <button
                key={category}
                className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 capitalize"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-50 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-primary-600 w-8">#{entry.rank}</div>
                <div>
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    {entry.username}
                    <span className="text-xl">{entry.badge}</span>
                  </div>
                  <div className="text-sm text-gray-600">{entry.achievement}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-medium text-gray-900">{entry.score.toLocaleString()} pts</div>
                  <div className="text-xs text-gray-500 capitalize">{entry.category}</div>
                </div>
                <div className={`
                  p-1 rounded-full
                  ${entry.trend === 'up' ? 'bg-green-100 text-green-600' :
                    entry.trend === 'down' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'}
                `}>
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-gray-50 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                  <StarIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 transition-all duration-500"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-primary-600 font-medium">{achievement.reward}</span>
                    {achievement.dateEarned && (
                      <span className="text-gray-500">
                        Earned {new Date(achievement.dateEarned).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 