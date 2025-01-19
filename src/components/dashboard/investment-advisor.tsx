'use client'

import { useEffect, useState } from 'react'
import { useSettings } from '@/contexts/SettingsContext'
import { motion } from 'framer-motion'
import {
  BanknotesIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ScaleIcon,
  BuildingLibraryIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

export default function InvestmentAdvisor() {
  const { userProfile, marketData, formatCurrency } = useSettings()
  const [recommendations, setRecommendations] = useState([])
  const [marketInsights, setMarketInsights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userProfile && marketData) {
      // Generate personalized recommendations based on user profile and market data
      const personalizedRecommendations = generateRecommendations(userProfile, marketData)
      setRecommendations(personalizedRecommendations)
      
      // Get market insights specific to user's country
      const countryInsights = getMarketInsights(marketData)
      setMarketInsights(countryInsights)
      setLoading(false)
    }
  }, [userProfile, marketData])

  const generateRecommendations = (profile: any, market: any) => {
    const recommendations = []
    const { riskTolerance, investmentGoals, monthlyIncome, assets } = profile
    const { stockMarket, bonds, realEstate, commodities } = market

    // Calculate investment capacity
    const monthlyInvestmentCapacity = calculateInvestmentCapacity(monthlyIncome, profile.monthlyExpenses)
    const totalPortfolioValue = calculateTotalPortfolio(assets)

    // Generate asset allocation based on risk tolerance and market conditions
    const allocation = generateAssetAllocation(riskTolerance, market)

    // Add recommendations based on user's country and market conditions
    if (stockMarket.trend === 'bullish') {
      recommendations.push({
        type: 'stocks',
        title: 'Stock Market Opportunity',
        description: `The ${profile.country} stock market is showing strong growth potential.`,
        allocation: allocation.stocks,
        monthlyAmount: monthlyInvestmentCapacity * (allocation.stocks / 100),
        icon: ChartBarIcon
      })
    }

    // Add local market specific recommendations
    if (market.localOpportunities?.length > 0) {
      market.localOpportunities.forEach(opportunity => {
        recommendations.push({
          type: 'local',
          title: opportunity.name,
          description: opportunity.description,
          potential: opportunity.potentialReturn,
          risk: opportunity.riskLevel,
          icon: GlobeAltIcon
        })
      })
    }

    // Add recommendations based on investment goals
    investmentGoals.forEach(goal => {
      const goalRecommendation = generateGoalBasedRecommendation(goal, market)
      if (goalRecommendation) {
        recommendations.push(goalRecommendation)
      }
    })

    return recommendations
  }

  const getMarketInsights = (market: any) => {
    return [
      {
        title: 'Market Overview',
        description: market.overview,
        trend: market.trend,
        icon: ArrowTrendingUpIcon
      },
      {
        title: 'Local Opportunities',
        description: market.opportunities,
        count: market.localOpportunities?.length || 0,
        icon: GlobeAltIcon
      },
      {
        title: 'Risk Assessment',
        description: market.riskAssessment,
        level: market.riskLevel,
        icon: ScaleIcon
      }
    ]
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
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Investment Advisor</h2>
        <p className="text-primary-100">
          Personalized investment recommendations for {userProfile.country} market
        </p>
      </div>

      {/* Market Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {marketInsights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center space-x-3 mb-4">
              <insight.icon className="h-6 w-6 text-primary-500" />
              <h3 className="font-semibold text-gray-900">{insight.title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{insight.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Investment Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h3>
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-primary-50 text-primary-600`}>
                  <recommendation.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{recommendation.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{recommendation.description}</p>
                  {recommendation.allocation && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-500">Recommended Allocation:</span>
                      <span className="font-medium text-gray-900">{recommendation.allocation}%</span>
                    </div>
                  )}
                  {recommendation.monthlyAmount && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-500">Monthly Investment:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(recommendation.monthlyAmount)}
                    </span>
                  </div>
                  )}
                </div>
              </div>
            </motion.div>
        ))}
        </div>
      </div>
    </div>
  )
}

// Helper functions
function calculateInvestmentCapacity(income: any, expenses: any) {
  const totalIncome = Object.values(income).reduce((sum: number, val: number) => sum + val, 0)
  const totalExpenses = Object.values(expenses).reduce((sum: number, val: number) => sum + val, 0)
  return totalIncome - totalExpenses
}

function calculateTotalPortfolio(assets: any) {
  return Object.values(assets).reduce((sum: number, val: number) => sum + val, 0)
}

function generateAssetAllocation(riskTolerance: string, market: any) {
  // Adjust allocation based on risk tolerance and market conditions
  switch (riskTolerance) {
    case 'conservative':
      return { stocks: 30, bonds: 50, cash: 20 }
    case 'moderate':
      return { stocks: 60, bonds: 30, cash: 10 }
    case 'aggressive':
      return { stocks: 80, bonds: 15, cash: 5 }
    default:
      return { stocks: 50, bonds: 40, cash: 10 }
  }
}

function generateGoalBasedRecommendation(goal: any, market: any) {
  // Generate specific recommendations based on investment goals
  switch (goal.type) {
    case 'retirement':
      return {
        type: 'goal',
        title: 'Retirement Planning',
        description: `Based on your retirement goal at age ${goal.targetAge}, we recommend a diversified portfolio.`,
        icon: BuildingLibraryIcon
      }
    case 'shortTerm':
      return {
        type: 'goal',
        title: 'Short-term Investment',
        description: 'For your short-term goals, we recommend lower-risk investments with good liquidity.',
        icon: BanknotesIcon
      }
    default:
      return null
  }
} 