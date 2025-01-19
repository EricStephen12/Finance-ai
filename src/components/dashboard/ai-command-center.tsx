'use client'

import { FC, useState } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

interface AICommandCenterProps {
  userId: string
  insights?: {
    financial?: any[]
    market?: any[]
    behavioral?: any[]
    quantum?: any[]
  }
  isNewUser?: boolean
  isLoading?: boolean
}

const AICommandCenter: FC<AICommandCenterProps> = ({
  userId,
  insights,
  isNewUser,
  isLoading
}) => {
  const [activeContext, setActiveContext] = useState<string | null>(null)
  
  const contextualGuidance = {
    wealth: {
      title: 'Building Wealth',
      description: 'Start with Wealth Overview to see your full financial picture, then use Smart Budgeting to optimize your spending.',
      nextSteps: ['Wealth Overview', 'Smart Budgeting']
    },
    investment: {
      title: 'Growing Investments',
      description: 'Check AI Insights for market opportunities, then consult the Investment Advisor for personalized strategies.',
      nextSteps: ['AI Insights', 'Investment Advisor']
    },
    tax: {
      title: 'Tax Optimization',
      description: 'Review your Tax Planning dashboard for potential savings, then use AI Insights to optimize your strategy.',
      nextSteps: ['Tax Planning', 'AI Insights']
    }
  }

  // Default insights for new users
  const defaultInsights = {
    financial: [{
      title: 'Welcome to Financial Analysis',
      description: 'Update your financial information to get personalized insights about your spending and saving patterns',
      isDefault: true
    }],
    market: [{
      title: 'Market Intelligence Ready',
      description: 'Add your investment preferences to receive tailored market updates and opportunities',
      isDefault: true
    }],
    behavioral: [{
      title: 'Behavioral Analysis Available',
      description: 'Start tracking your financial activities to unlock personalized behavioral insights',
      isDefault: true
    }],
    quantum: [{
      title: 'Advanced Predictions',
      description: 'Complete your profile to access AI-powered predictions and recommendations',
      isDefault: true
    }]
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">AI Command Center</h2>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Use default insights for new users or when no insights available
  const displayInsights = insights || defaultInsights

  return (
    <div className="space-y-6">
      {/* Contextual Guidance */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          {Object.keys(contextualGuidance).map(context => (
            <button
              key={context}
              onClick={() => setActiveContext(context)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeContext === context
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {contextualGuidance[context].title}
            </button>
          ))}
        </div>
        
        {activeContext && (
          <div className="space-y-4">
            <p className="text-gray-600">{contextualGuidance[activeContext].description}</p>
            <div className="flex gap-2">
              {contextualGuidance[activeContext].nextSteps.map(step => (
                <Link
                  key={step}
                  href={`/dashboard/${step.toLowerCase().replace(' ', '-')}`}
                  className="inline-flex items-center px-4 py-2 bg-white rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  {step}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Financial Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {displayInsights.financial?.map((insight, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg ${insight.isDefault ? 
              'bg-gray-50 border border-gray-200' : 
              'bg-blue-50'
            }`}
          >
            <h3 className={`font-semibold ${insight.isDefault ? 'text-gray-800' : 'text-blue-800'}`}>
              {insight.title}
                      </h3>
            <p className={`text-sm ${insight.isDefault ? 'text-gray-600' : 'text-blue-600'}`}>
              {insight.description}
            </p>
            {insight.isDefault && (
              <button className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                Update Profile →
              </button>
                      )}
                    </div>
        ))}
        
        {displayInsights.market?.map((insight, index) => (
          <div 
                          key={index}
            className={`p-4 rounded-lg ${insight.isDefault ? 
              'bg-gray-50 border border-gray-200' : 
              'bg-green-50'
            }`}
          >
            <h3 className={`font-semibold ${insight.isDefault ? 'text-gray-800' : 'text-green-800'}`}>
              {insight.title}
            </h3>
            <p className={`text-sm ${insight.isDefault ? 'text-gray-600' : 'text-green-600'}`}>
              {insight.description}
            </p>
            {insight.isDefault && (
              <button className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                Set Preferences →
                        </button>
                  )}
          </div>
        ))}
      </div>

      {/* Advanced Analysis */}
      <div className="space-y-4">
        {displayInsights.behavioral?.map((insight, index) => (
          <div 
                key={index}
            className={`p-4 rounded-lg ${insight.isDefault ? 
              'bg-gray-50 border border-gray-200' : 
              'bg-purple-50'
            }`}
          >
            <h3 className={`font-semibold ${insight.isDefault ? 'text-gray-800' : 'text-purple-800'}`}>
              {insight.title}
            </h3>
            <p className={`text-sm ${insight.isDefault ? 'text-gray-600' : 'text-purple-600'}`}>
              {insight.description}
            </p>
            {insight.isDefault && (
              <button className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                Start Tracking →
              </button>
            )}
          </div>
        ))}
        
        {displayInsights.quantum?.map((insight, index) => (
          <div 
                key={index}
            className={`p-4 rounded-lg ${insight.isDefault ? 
              'bg-gray-50 border border-gray-200' : 
              'bg-yellow-50'
            }`}
          >
            <h3 className={`font-semibold ${insight.isDefault ? 'text-gray-800' : 'text-yellow-800'}`}>
              {insight.title}
            </h3>
            <p className={`text-sm ${insight.isDefault ? 'text-gray-600' : 'text-yellow-600'}`}>
              {insight.description}
            </p>
            {insight.isDefault && (
              <button className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                Complete Profile →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 

export default AICommandCenter 