'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import {
  CalculatorIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  InformationCircleIcon,
  SparklesIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface TaxDeduction {
  id: string
  category: string
  amount: number
  status: 'claimed' | 'pending' | 'potential'
  description: string
  deadline: string
  requirements: string[]
  aiSuggestions: string[]
}

interface TaxSaving {
  category: string
  amount: number
  description: string
  icon: JSX.Element
}

const mockDeductions: TaxDeduction[] = [
  {
    id: '1',
    category: 'Retirement Contributions',
    amount: 19500,
    status: 'claimed',
    description: '401(k) and IRA contributions for tax year 2024',
    deadline: '2024-12-31',
    requirements: [
      'Must be earned income',
      'Cannot exceed annual limits',
      'Employer match documentation'
    ],
    aiSuggestions: [
      'Increase contribution to reach maximum limit',
      'Consider Roth conversion strategy',
      'Review employer match optimization'
    ]
  },
  {
    id: '2',
    category: 'Home Office Deduction',
    amount: 5200,
    status: 'potential',
    description: 'Home office expenses and utilities for remote work',
    deadline: '2024-04-15',
    requirements: [
      'Regular and exclusive use',
      'Principal place of business',
      'Detailed expense records'
    ],
    aiSuggestions: [
      'Document office measurements',
      'Track utility expenses separately',
      'Consider direct expenses allocation'
    ]
  },
  {
    id: '3',
    category: 'Educational Expenses',
    amount: 4000,
    status: 'pending',
    description: 'Professional development and certification costs',
    deadline: '2024-04-15',
    requirements: [
      'Must be work-related',
      'Maintain course completion certificates',
      'Payment documentation'
    ],
    aiSuggestions: [
      'Check eligibility for Lifetime Learning Credit',
      'Document skill improvement relevance',
      'Track related travel expenses'
    ]
  }
]

const taxSavings: TaxSaving[] = [
  {
    category: 'Income Tax Reduction',
    amount: 12500,
    description: 'Through strategic deductions and credits',
    icon: <BanknotesIcon className="h-6 w-6" />
  },
  {
    category: 'Investment Tax Savings',
    amount: 4800,
    description: 'Via tax-loss harvesting and qualified dividends',
    icon: <ChartBarIcon className="h-6 w-6" />
  },
  {
    category: 'Estate Tax Planning',
    amount: 15000,
    description: 'Through trust structures and gifting strategies',
    icon: <BuildingLibraryIcon className="h-6 w-6" />
  }
]

interface TaxStrategy {
  id: string
  title: string
  description: string
  deadline: string
  potentialSavings: number
  icon: JSX.Element
}

const taxStrategies: TaxStrategy[] = [
  {
    id: '1',
    title: 'Maximize Retirement Contributions',
    description: 'I recommend increasing your 401(k) and IRA contributions to reduce your taxable income.',
    deadline: 'December 31, 2024',
    potentialSavings: 5500,
    icon: <AcademicCapIcon className="h-5 w-5 text-primary-600" />
  },
  {
    id: '2',
    title: 'Tax Loss Harvesting',
    description: 'Let me help you strategically sell investments at a loss to offset capital gains.',
    deadline: 'December 31, 2024',
    potentialSavings: 3200,
    icon: <ChartBarIcon className="h-5 w-5 text-primary-600" />
  },
  {
    id: '3',
    title: 'Business Expense Optimization',
    description: 'I can help you identify and properly document deductible business expenses.',
    deadline: 'April 15, 2024',
    potentialSavings: 4800,
    icon: <CalculatorIcon className="h-5 w-5 text-primary-600" />
  }
]

const taxDeadlines = [
  {
    id: '1',
    title: 'Q4 Estimated Tax Payment',
    date: 'January 15, 2024'
  },
  {
    id: '2',
    title: 'Federal Tax Return Deadline',
    date: 'April 15, 2024'
  },
  {
    id: '3',
    title: 'Q2 Estimated Tax Payment',
    date: 'June 15, 2024'
  }
]

export default function TaxPlanning() {
  return (
    <div className="space-y-6">
      {/* Tax Overview */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              I've discovered some great ways to help you save on taxes
            </h2>
            <p className="text-primary-200 mt-1 text-sm sm:text-base">I know taxes can be stressful, but don't worry - we'll work through this together, step by step</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {taxSavings.map((saving) => (
            <div key={saving.category} className="bg-primary-800/50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 text-primary-200 mb-1 sm:mb-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6">{saving.icon}</div>
                <span className="text-sm sm:text-base">{saving.category}</span>
              </div>
              <p className="text-xl sm:text-2xl font-semibold">
                ${saving.amount.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-primary-200">Together, we could save this much</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Strategies */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Here's what I think would work best for you</h3>
            <Tippy content="I've carefully considered your unique situation to find strategies that make sense for you">
              <button className="text-gray-400 hover:text-gray-600">
                <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </Tippy>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {taxStrategies.map((strategy) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-3 sm:p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-primary-100 rounded-lg p-1.5 sm:p-2 flex-shrink-0">
                  <div className="w-4 h-4 sm:w-5 sm:h-5">{strategy.icon}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-medium text-gray-900">{strategy.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{strategy.description}</p>
                  <div className="mt-2 sm:mt-3 flex flex-wrap gap-2 sm:gap-4">
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                      <span>Due: {strategy.deadline}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-green-600">
                      <BanknotesIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                      <span>Potential: ${strategy.potentialSavings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tax Calendar */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Important Tax Dates</h3>
            <span className="text-xs sm:text-sm text-gray-500">Mark your calendar</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {taxDeadlines.map((deadline) => (
            <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                <span className="text-sm sm:text-base font-medium text-gray-900">{deadline.title}</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">{deadline.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Tippy content="Let's work together to find every possible way to reduce your tax burden">
          <button className="flex items-center justify-center space-x-2 p-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
            <CalculatorIcon className="h-5 w-5" />
            <span>Let's find more savings together</span>
          </button>
        </Tippy>
        <Tippy content="I'll create a personalized plan that takes into account your unique situation">
          <button className="flex items-center justify-center space-x-2 p-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
            <DocumentTextIcon className="h-5 w-5" />
            <span>Get your custom tax strategy</span>
          </button>
        </Tippy>
      </div>
    </div>
  )
} 