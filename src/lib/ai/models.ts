import axios from 'axios'

const AI_ML_KEY = process.env.NEXT_PUBLIC_AI_ML_KEY

const AI_ML_ENDPOINTS = {
  BASE_URL: 'https://api.ai-ml-service.com/v1',
  SENTIMENT: '/analyze/sentiment',
  FINANCIAL_ADVICE: '/finance/advice',
  INVESTMENT: '/finance/investment',
  BUDGET: '/finance/budget',
  TRANSACTION: '/finance/transaction'
}

interface SentimentResponse {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
}

interface FinancialAdviceResponse {
  recommendations: string[]
  insights: string[]
  riskLevel: number
}

interface InvestmentAdviceResponse {
  recommendations: string[]
  allocation: {
    category: string
    percentage: number
  }[]
  riskLevel: number
}

interface BudgetAnalysisResponse {
  recommendations: string[]
  savingsPotential: number
  spendingPatterns: {
    category: string
    amount: number
    trend: 'increasing' | 'decreasing' | 'stable'
  }[]
}

interface TransactionCategoryResponse {
  category: string
  confidence: number
  subcategories: string[]
}

interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
}

export async function analyzeSentiment(text: string): Promise<SentimentResponse> {
  try {
    const response = await axios.post(
      `${AI_ML_ENDPOINTS.BASE_URL}${AI_ML_ENDPOINTS.SENTIMENT}`,
      { text },
      {
        headers: {
          'Authorization': `Bearer ${AI_ML_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error analyzing sentiment:', error)
    throw new Error('Failed to analyze sentiment')
  }
}

export async function getFinancialAdvice(
  userData: {
    income: number
    expenses: number[]
    goals: string[]
    riskTolerance: number
  }
): Promise<FinancialAdviceResponse> {
  try {
    const response = await axios.post(
      `${AI_ML_ENDPOINTS.BASE_URL}${AI_ML_ENDPOINTS.FINANCIAL_ADVICE}`,
      userData,
      {
        headers: {
          'Authorization': `Bearer ${AI_ML_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error getting financial advice:', error)
    throw new Error('Failed to get financial advice')
  }
}

export async function getInvestmentAdvice(
  userData: {
    amount: number
    timeline: number
    riskTolerance: number
    goals: string[]
    existingInvestments?: {
      category: string
      amount: number
    }[]
  }
): Promise<InvestmentAdviceResponse> {
  try {
    const response = await axios.post(
      `${AI_ML_ENDPOINTS.BASE_URL}${AI_ML_ENDPOINTS.INVESTMENT}`,
      userData,
      {
        headers: {
          'Authorization': `Bearer ${AI_ML_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error getting investment advice:', error)
    throw new Error('Failed to get investment advice')
  }
}

export async function analyzeBudget(
  transactions: {
    amount: number
    category: string
    date: string
    type: 'income' | 'expense'
  }[]
): Promise<BudgetAnalysisResponse> {
  try {
    const response = await axios.post(
      `${AI_ML_ENDPOINTS.BASE_URL}${AI_ML_ENDPOINTS.BUDGET}`,
      { transactions },
      {
        headers: {
          'Authorization': `Bearer ${AI_ML_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error analyzing budget:', error)
    throw new Error('Failed to analyze budget')
  }
}

export async function categorizeTransaction(
  transaction: {
    description: string
    amount: number
    date: string
  }
): Promise<TransactionCategoryResponse> {
  try {
    const response = await axios.post(
      `${AI_ML_ENDPOINTS.BASE_URL}${AI_ML_ENDPOINTS.TRANSACTION}`,
      transaction,
      {
        headers: {
          'Authorization': `Bearer ${AI_ML_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error categorizing transaction:', error)
    throw new Error('Failed to categorize transaction')
  }
}

export async function analyzeSentimentML(text: string): Promise<SentimentAnalysis> {
  // Enhanced financial context words
  const positiveWords = [
    // Financial success indicators
    'profit', 'gain', 'earned', 'saved', 'increased', 'grew', 'accumulated',
    'invested', 'return', 'dividend', 'appreciation', 'surplus', 'balanced',
    
    // Positive financial behaviors
    'budgeting', 'saving', 'investing', 'planning', 'tracking', 'managing',
    'diversifying', 'optimizing', 'reducing', 'automating',
    
    // Emotional financial wellbeing
    'confident', 'secure', 'comfortable', 'stable', 'prepared', 'protected',
    'responsible', 'disciplined', 'mindful', 'proactive',
    
    // Achievement words
    'goal', 'milestone', 'achievement', 'success', 'progress', 'improvement',
    'accomplished', 'reached', 'exceeded', 'achieved',
    
    // Growth indicators
    'opportunity', 'potential', 'growth', 'development', 'expansion',
    'advancement', 'momentum', 'upward', 'rising', 'climbing'
  ]

  const negativeWords = [
    // Financial stress indicators
    'debt', 'loss', 'deficit', 'overdue', 'expensive', 'costly', 'overspent',
    'borrowed', 'owe', 'payment', 'bill', 'interest', 'fee',
    
    // Negative financial behaviors
    'overspending', 'impulse', 'unplanned', 'forgot', 'missed', 'late',
    'unpaid', 'overdraft', 'penalty', 'collection',
    
    // Financial anxiety
    'worried', 'concerned', 'anxious', 'stressed', 'uncertain', 'insecure',
    'risky', 'unstable', 'unprepared', 'overwhelmed',
    
    // Problem indicators
    'issue', 'problem', 'difficulty', 'challenge', 'struggle', 'trouble',
    'crisis', 'emergency', 'unexpected', 'surprise',
    
    // Decline indicators
    'decrease', 'drop', 'fall', 'decline', 'reduced', 'lower',
    'down', 'falling', 'declining', 'shrinking'
  ]

  // Context modifiers that can affect sentiment weight
  const intensifiers = ['very', 'really', 'extremely', 'significantly', 'substantially']
  const diminishers = ['slightly', 'somewhat', 'a bit', 'marginally', 'minor']
  const negators = ['not', "don't", 'never', 'no', 'neither', 'nor', "hasn't", "haven't", "won't"]

  const words = text.toLowerCase().split(/\W+/)
  let positiveScore = 0
  let negativeScore = 0
  let intensifierMultiplier = 1
  let isNegated = false

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const prevWord = i > 0 ? words[i - 1] : null
    const nextWord = i < words.length - 1 ? words[i + 1] : null

    // Reset negation and intensity for new phrases
    if (['.', '!', '?', 'but', 'however'].includes(word)) {
      isNegated = false
      intensifierMultiplier = 1
      continue
    }

    // Check for negators
    if (negators.includes(word)) {
      isNegated = true
      continue
    }

    // Check for intensifiers/diminishers
    if (intensifiers.includes(word)) {
      intensifierMultiplier = 1.5
      continue
    } else if (diminishers.includes(word)) {
      intensifierMultiplier = 0.5
      continue
    }

    // Calculate sentiment with context
    if (positiveWords.includes(word)) {
      const score = 1 * intensifierMultiplier
      positiveScore += isNegated ? -score : score
    } else if (negativeWords.includes(word)) {
      const score = 1 * intensifierMultiplier
      negativeScore += isNegated ? -score : score
    }

    // Consider financial phrases (bigrams)
    if (prevWord) {
      const phrase = `${prevWord} ${word}`
      if (isPositiveFinancialPhrase(phrase)) {
        positiveScore += 1.5 * intensifierMultiplier * (isNegated ? -1 : 1)
      } else if (isNegativeFinancialPhrase(phrase)) {
        negativeScore += 1.5 * intensifierMultiplier * (isNegated ? -1 : 1)
      }
    }

    // Reset modifiers after applying them
    isNegated = false
    intensifierMultiplier = 1
  }

  // Calculate final sentiment
  const total = Math.abs(positiveScore) + Math.abs(negativeScore)
  if (total === 0) {
    return {
      sentiment: 'neutral',
      confidence: 1
    }
  }

  const normalizedPositive = positiveScore / total
  const normalizedNegative = negativeScore / total
  const threshold = 0.1 // Minimum difference for non-neutral sentiment

  if (Math.abs(normalizedPositive - normalizedNegative) < threshold) {
    return {
      sentiment: 'neutral',
      confidence: 1 - Math.abs(normalizedPositive - normalizedNegative)
    }
  }

  return {
    sentiment: normalizedPositive > normalizedNegative ? 'positive' : 'negative',
    confidence: Math.abs(normalizedPositive - normalizedNegative)
  }
}

function isPositiveFinancialPhrase(phrase: string): boolean {
  const positiveFinancialPhrases = [
    'savings growing', 'budget surplus', 'investment return', 'financial goal',
    'wealth building', 'emergency fund', 'debt free', 'credit score',
    'passive income', 'portfolio growth', 'smart investment', 'financial planning',
    'retirement saving', 'income increase', 'cost saving'
  ]
  return positiveFinancialPhrases.some(p => phrase.includes(p))
}

function isNegativeFinancialPhrase(phrase: string): boolean {
  const negativeFinancialPhrases = [
    'credit card debt', 'late payment', 'overdraft fee', 'financial stress',
    'budget deficit', 'payment missed', 'debt collector', 'bankruptcy filing',
    'loan default', 'interest charge', 'spending problem', 'financial difficulty',
    'money trouble', 'income decrease', 'cost increase'
  ]
  return negativeFinancialPhrases.some(p => phrase.includes(p))
} 