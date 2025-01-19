'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon, SparklesIcon, InformationCircleIcon, ChartBarIcon, BanknotesIcon, RocketLaunchIcon, DocumentTextIcon, ChartPieIcon } from '@heroicons/react/24/outline'
import Tippy from '@tippyjs/react'
import { AnalyticsEngine } from '@/lib/services/analyticsEngine'
import { PredictionEngine } from '@/lib/services/predictionEngine'
import { AnomalyDetector } from '@/lib/services/anomalyDetector'
import { useTransactions } from '@/hooks/useTransactions'
import { SpendingPattern, AnomalyReport, SpendingForecast } from '@/types/analytics'

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
  const { transactions } = useTransactions()
  const [patterns, setPatterns] = useState<SpendingPattern | null>(null)
  const [anomalies, setAnomalies] = useState<AnomalyReport | null>(null)
  const [forecast, setForecast] = useState<SpendingForecast | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('6M')
  const [focusArea, setFocusArea] = useState<'overview' | 'spending' | 'prediction'>('overview')
  const [selectedChart, setSelectedChart] = useState<'area' | 'pie'>('area')

  const stats = [
    {
      title: 'Portfolio Performance',
      value: '+28.5%',
      change: '+15.3%',
      trend: 'up',
      description: "Your optimized strategy is outperforming market benchmarks",
      icon: <CurrencyDollarIcon className="h-5 w-5 text-emerald-400" />
    },
    {
      title: 'Growth Rate',
      value: '3.8x',
      change: '+2.1x',
      trend: 'up',
      description: "Your portfolio growth is in the top performance tier",
      icon: <ArrowTrendingUpIcon className="h-5 w-5 text-blue-400" />
    },
    {
      title: 'Risk-Adjusted Returns',
      value: '2.1 Sharpe',
      change: '+0.8',
      trend: 'up',
      description: "Your portfolio maintains institutional-grade efficiency levels",
      icon: <ArrowTrendingDownIcon className="h-5 w-5 text-violet-400" />
    },
    {
      title: 'Strategy Confidence',
      value: '94.8%',
      change: '+5.2%',
      trend: 'up',
      description: "Advanced models show high reliability in your strategy",
      icon: <SparklesIcon className="h-5 w-5 text-amber-400" />
    }
  ]

  useEffect(() => {
    async function analyzeData() {
      if (!transactions.length) return

      setIsLoading(true)
      try {
        // Initialize our analytics engines
        const analyticsEngine = new AnalyticsEngine()
        const predictionEngine = new PredictionEngine()
        const anomalyDetector = new AnomalyDetector()

        // Run parallel analysis
        const [patternResults, anomalyResults, forecastResults] = await Promise.all([
          analyticsEngine.detectSpendingPatterns(transactions),
          anomalyDetector.detectAnomalies(transactions),
          predictionEngine.forecastSpending(transactions)
        ])

        setPatterns(patternResults)
        setAnomalies(anomalyResults)
        setForecast(forecastResults)
      } catch (error) {
        console.error('Error analyzing data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    analyzeData()
  }, [transactions])

  // Render functions for different sections
  const renderPatternAnalysis = () => {
    if (!patterns) return null

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Spending Patterns</h3>
        
        {/* Temporal Patterns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {patterns.temporal.map((pattern, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow">
              <h4 className="font-medium">{pattern.daily.direction} Trend</h4>
              <p className="text-sm text-gray-600">
                Confidence: {(pattern.daily.strength * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>

        {/* Category Patterns */}
        <div className="mt-6">
          <h4 className="font-medium mb-3">Category Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patterns.categorical.map((pattern, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{pattern.category}</span>
                  <span className="text-sm text-gray-600">
                    ${pattern.average.toFixed(2)} avg
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {pattern.trend.direction} trend ({(pattern.frequency * 30).toFixed(1)} times/month)
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderAnomalyDetection = () => {
    if (!anomalies) return null

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Anomaly Detection</h3>

        {/* Amount Anomalies */}
        {anomalies.amountAnomalies.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Unusual Amounts</h4>
            <div className="space-y-2">
              {anomalies.amountAnomalies.map((anomaly, index) => (
                <div key={index} className="p-3 bg-white rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">${anomaly.transaction.amount}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      anomaly.severity === 'high' ? 'bg-red-100 text-red-800' :
                      anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{anomaly.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pattern Breaks */}
        {anomalies.patternBreaks.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Pattern Breaks</h4>
            <div className="space-y-2">
              {anomalies.patternBreaks.map((break_, index) => (
                <div key={index} className="p-3 bg-white rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{break_.pattern.category}</span>
                    <span className="text-sm text-gray-600">
                      {(break_.deviation * 100).toFixed(1)}% deviation
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderForecast = () => {
    if (!forecast) return null

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Spending Forecast</h3>

        {/* Daily Forecast */}
        <div className="mt-4">
          <h4 className="font-medium mb-2">Next 30 Days</h4>
          <div className="space-y-2">
            {forecast.daily.slice(0, 5).map((day, index) => (
              <div key={index} className="p-3 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {day.date.toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-600">
                    ${day.expectedAmount.toFixed(2)}
                    <span className="text-xs ml-1">
                      ±${(day.upperBound - day.expectedAmount).toFixed(2)}
                    </span>
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${day.confidence * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Forecast */}
        <div className="mt-6">
          <h4 className="font-medium mb-2">Category Predictions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forecast.byCategory.map((category, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category.category}</span>
                  <span className="text-sm text-gray-600">
                    ${category.expectedAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {category.trend.direction} trend
                  ({(category.confidence * 100).toFixed(1)}% confidence)
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <div>Loading analytics...</div>
  }

  return (
    <div className="space-y-8">
      {renderPatternAnalysis()}
      {renderAnomalyDetection()}
      {renderForecast()}
    </div>
  )
} 