import { aiOrchestrator } from './orchestrator'

export interface EmotionalContext {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  emotionalState: {
    stress: number
    confidence: number
    satisfaction: number
  }
  recommendations: string[]
}

export interface FinancialState {
  income?: number
  savings?: number
  debt?: number
  expenses?: number[]
  goals?: string[]
  investments?: {
    category: string
    amount: number
  }[]
  goalsProgress?: number
  missedPayments?: boolean
  overdrafts?: boolean
}

export async function analyzeEmotionalContext(data: {
  transactions: any[]
  goals: string[]
  income: number
  expenses: number[]
  financialState: FinancialState
  }): Promise<EmotionalContext> {
  try {
    const analysis = await aiOrchestrator.analyzeFinancialData({
      type: 'emotional',
      ...data
    })

    return analysis
  } catch (error) {
    console.error('Error analyzing emotional context:', error)
    throw new Error('Failed to analyze emotional context')
  }
}

export function getEmotionalInsights(context: EmotionalContext): string[] {
  const insights: string[] = []

  // Add sentiment-based insights
  switch (context.sentiment) {
    case 'positive':
      insights.push('You\'re showing a positive outlook on your finances')
      insights.push('This is a great time to consider growth opportunities')
      break
    case 'negative':
      insights.push('You seem concerned about your financial situation')
      insights.push('Let\'s focus on building stability and confidence')
      break
    case 'neutral':
      insights.push('You\'re taking a balanced approach to your finances')
      insights.push('Consider both protective and growth strategies')
      break
  }

  // Add stress-based insights
  if (context.emotionalState.stress > 7) {
    insights.push('Your financial stress levels are elevated')
    insights.push('Consider focusing on stress-reduction strategies')
  } else if (context.emotionalState.stress < 4) {
    insights.push('You\'re managing financial stress well')
    insights.push('This is a good time to plan for the future')
  }

  // Add confidence-based insights
  if (context.emotionalState.confidence < 5) {
    insights.push('Let\'s work on building your financial confidence')
    insights.push('Small, consistent wins can help boost your confidence')
  } else if (context.emotionalState.confidence > 7) {
    insights.push('You\'re showing strong financial confidence')
    insights.push('Use this confidence to tackle bigger financial goals')
  }

  // Add satisfaction-based insights
  if (context.emotionalState.satisfaction < 5) {
    insights.push('You might not be fully satisfied with your current financial situation')
    insights.push('Let\'s identify specific areas for improvement')
  } else if (context.emotionalState.satisfaction > 7) {
    insights.push('You\'re showing high satisfaction with your financial progress')
    insights.push('Consider setting more challenging goals')
  }

  return insights
}

export function getEmotionalRecommendations(context: EmotionalContext): string[] {
  const baseRecommendations = context.recommendations || []
  const emotionalRecommendations: string[] = []

  // Add stress management recommendations
  if (context.emotionalState.stress > 7) {
    emotionalRecommendations.push('Consider setting up automatic bill payments to reduce financial stress')
    emotionalRecommendations.push('Break down large financial goals into smaller, manageable steps')
    emotionalRecommendations.push('Schedule regular financial check-ins to stay on top of your situation')
  }

  // Add confidence building recommendations
  if (context.emotionalState.confidence < 5) {
    emotionalRecommendations.push('Start with small, achievable financial goals to build momentum')
    emotionalRecommendations.push('Track your daily expenses to feel more in control')
    emotionalRecommendations.push('Celebrate small financial wins to boost confidence')
  }

  // Add satisfaction enhancement recommendations
  if (context.emotionalState.satisfaction < 5) {
    emotionalRecommendations.push('Review and adjust your financial goals to better align with your values')
    emotionalRecommendations.push('Focus on progress rather than perfection')
    emotionalRecommendations.push('Consider working with a financial advisor for personalized guidance')
  }

  return [...baseRecommendations, ...emotionalRecommendations]
}

export function getEmotionalSupportMessage(context: EmotionalContext): string {
  const { sentiment, emotionalState } = context
  const { stress, confidence, satisfaction } = emotionalState

  if (stress > 7 && confidence < 4) {
    return "It's completely normal to feel stressed about finances. Remember, every small step counts, and we're here to help you navigate through this."
  }

  if (sentiment === 'negative' && satisfaction < 4) {
    return "We understand managing finances can be challenging. Let's focus on what we can control and work together to improve your situation."
  }

  if (confidence < 4) {
    return "Building financial confidence takes time. You're on the right path by actively managing your finances."
  }

  if (sentiment === 'positive' && satisfaction > 7) {
    return "Great job managing your finances! Your positive approach is a valuable asset for achieving your financial goals."
  }

  return "Remember, financial wellness is a journey. We're here to support you every step of the way."
} 