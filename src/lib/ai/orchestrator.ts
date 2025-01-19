import { analyzeSentiment, getFinancialAdvice, getInvestmentAdvice, analyzeBudget } from './models'
import { FinancialAnalysisType } from '@/types/analytics'

interface FinancialAnalysisRequest {
  type: 'emotional' | 'financial' | 'investment' | 'budget'
  transactions?: any[]
  goals?: string[]
  income?: number
  expenses?: number[]
  riskTolerance?: number
  financialState?: any
}

interface EmotionalAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  emotionalState: {
    stress: number
    confidence: number
    satisfaction: number
  }
  recommendations: string[]
}

export class AIOrchestratorService {
  async analyzeFinancialData({ transactions, type = 'spending', goals = [] }: {
    transactions: any[]
    type?: FinancialAnalysisType
    goals?: any[]
  }) {
    try {
      // Validate analysis type
      const validTypes = ['spending', 'forecast', 'budget', 'tax']
      if (!validTypes.includes(type)) {
        throw new Error('Invalid analysis type')
      }

      // Process transactions
      const processedData = transactions.map(t => ({
        amount: t.amount || 0,
        category: t.category || 'uncategorized',
        date: t.date || new Date(),
        type: t.type || 'expense'
      }))

      // Perform analysis based on type
      switch (type) {
        case 'spending':
          return this.analyzeSpending(processedData)
        case 'forecast':
          return this.analyzeForecast(processedData, goals)
        case 'budget':
          return this.analyzeBudget(processedData)
        case 'tax':
          return this.analyzeTax(processedData)
        default:
          throw new Error('Unsupported analysis type')
      }
    } catch (error) {
      console.error('Error in AI analysis:', error)
      throw new Error('Failed to analyze financial data')
    }
  }

  private analyzeSpending(transactions: any[]) {
    // Group transactions by category
    const categories = transactions.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = []
      }
      acc[t.category].push(t)
      return acc
    }, {})

    // Calculate patterns and opportunities
    const patterns = Object.entries(categories).map(([category, transactions]) => {
      const total = transactions.reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0)
      const trend = this.calculateTrend(transactions as any[])
      return {
        category,
        amount: total,
        trend,
        anomalies: this.detectAnomalies(transactions as any[])
      }
    })

    const opportunities = patterns
      .filter(p => p.trend === 'increasing')
      .map(p => ({
        category: p.category,
        potentialSavings: p.amount * 0.1,
        suggestions: [
          `Review your ${p.category} spending`,
          `Consider alternatives for ${p.category}`,
          `Set a budget for ${p.category}`
        ]
      }))

    return {
      patterns,
      opportunities,
      insights: this.generateInsights(patterns),
      type: 'spending'
    }
  }

  private analyzeForecast(transactions: any[], goals: any[]) {
    // Implement forecast analysis
    return {
      predictions: [],
      confidence: 0,
      recommendations: []
    }
  }

  private analyzeBudget(transactions: any[]) {
    // Implement budget analysis
    return {
      allocations: [],
      adjustments: [],
      recommendations: []
    }
  }

  private analyzeTax(transactions: any[]) {
    // Implement tax analysis
    return {
      deductions: [],
      credits: [],
      strategies: []
    }
  }

  private calculateTrend(transactions: any[]): 'increasing' | 'decreasing' | 'stable' {
    if (transactions.length < 2) return 'stable'
    
    const amounts = transactions.map(t => t.amount)
    const trend = amounts[amounts.length - 1] - amounts[0]
    
    return trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable'
  }

  private detectAnomalies(transactions: any[]): string[] {
    const amounts = transactions.map(t => t.amount)
    const mean = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length
    const stdDev = Math.sqrt(
      amounts.reduce((sum, amt) => sum + Math.pow(amt - mean, 2), 0) / amounts.length
    )

    return amounts
      .map((amount, index) => {
        if (Math.abs(amount - mean) > 2 * stdDev) {
          return `Unusual ${amount > mean ? 'high' : 'low'} transaction on ${transactions[index].date}`
        }
        return null
      })
      .filter(Boolean) as string[]
  }

  private generateInsights(patterns: any[]): string[] {
    return patterns.map(p => 
      `${p.category}: ${p.trend} trend with ${p.anomalies.length} anomalies`
    )
  }

  private async analyzeEmotionalContext(data: FinancialAnalysisRequest): Promise<EmotionalAnalysis> {
    // Analyze financial state description
    const stateDescription = this.generateFinancialStateDescription(data.financialState)
    const sentimentResult = await analyzeSentiment(stateDescription)

    // Get financial advice based on emotional context
    const adviceResult = await getFinancialAdvice({
      income: data.income || 0,
      expenses: data.expenses || [],
      goals: data.goals || [],
      riskTolerance: this.calculateEmotionalRiskTolerance(sentimentResult.sentiment)
    })

    return {
      sentiment: sentimentResult.sentiment,
      confidence: sentimentResult.confidence,
      emotionalState: {
        stress: this.calculateStressLevel(data.financialState),
        confidence: this.calculateConfidenceLevel(data.financialState),
        satisfaction: this.calculateSatisfactionLevel(data.financialState)
      },
      recommendations: adviceResult.recommendations
    }
  }

  private async analyzeFinancialContext(data: FinancialAnalysisRequest) {
    return getFinancialAdvice({
      income: data.income || 0,
      expenses: data.expenses || [],
      goals: data.goals || [],
      riskTolerance: data.riskTolerance || 5
    })
  }

  private async analyzeInvestmentContext(data: FinancialAnalysisRequest) {
    return getInvestmentAdvice({
      amount: data.financialState?.investmentAmount || 0,
      timeline: data.financialState?.timeline || 5,
      riskTolerance: data.riskTolerance || 5,
      goals: data.goals || [],
      existingInvestments: data.financialState?.investments
    })
  }

  private async analyzeBudgetContext(data: FinancialAnalysisRequest) {
    return analyzeBudget(data.transactions || [])
  }

  private generateFinancialStateDescription(state: any): string {
    const aspects = []
    
    if (state.income) {
      aspects.push(`Monthly income: ${state.income}`)
    }
    
    if (state.savings) {
      aspects.push(`Current savings: ${state.savings}`)
    }
    
    if (state.debt) {
      aspects.push(`Outstanding debt: ${state.debt}`)
    }
    
    if (state.expenses) {
      aspects.push(`Monthly expenses: ${state.expenses}`)
    }
    
    if (state.goals) {
      aspects.push(`Financial goals: ${state.goals.join(', ')}`)
    }

    return aspects.join('. ') + '.'
  }

  private calculateStressLevel(state: any): number {
    let stress = 5 // Base level
    
    // Increase stress if expenses are close to or exceed income
    if (state.expenses && state.income) {
      const expenseRatio = state.expenses / state.income
      if (expenseRatio > 0.8) stress += 2
      if (expenseRatio > 1) stress += 3
    }
    
    // Increase stress for high debt
    if (state.debt && state.income) {
      const debtToIncomeRatio = state.debt / (state.income * 12)
      if (debtToIncomeRatio > 0.4) stress += 2
    }
    
    // Decrease stress for good savings
    if (state.savings && state.income) {
      const monthsOfSavings = state.savings / state.income
      if (monthsOfSavings > 6) stress -= 2
    }

    return Math.max(1, Math.min(10, stress))
  }

  private calculateConfidenceLevel(state: any): number {
    let confidence = 5 // Base level
    
    // Increase confidence for good savings
    if (state.savings && state.income) {
      const monthsOfSavings = state.savings / state.income
      if (monthsOfSavings > 3) confidence += 1
      if (monthsOfSavings > 6) confidence += 2
    }
    
    // Increase confidence for investment activity
    if (state.investments && state.investments.length > 0) {
      confidence += 2
    }
    
    // Decrease confidence for high debt
    if (state.debt && state.income) {
      const debtToIncomeRatio = state.debt / (state.income * 12)
      if (debtToIncomeRatio > 0.4) confidence -= 2
    }

    return Math.max(1, Math.min(10, confidence))
  }

  private calculateSatisfactionLevel(state: any): number {
    let satisfaction = 5 // Base level
    
    // Increase satisfaction for meeting goals
    if (state.goals && state.goalsProgress) {
      const progressRatio = state.goalsProgress / state.goals.length
      satisfaction += progressRatio * 3
    }
    
    // Increase satisfaction for positive net worth
    if (state.savings && state.debt) {
      const netWorth = state.savings - state.debt
      if (netWorth > 0) satisfaction += 2
    }
    
    // Decrease satisfaction for financial stress indicators
    if (state.missedPayments || state.overdrafts) {
      satisfaction -= 2
    }

    return Math.max(1, Math.min(10, satisfaction))
  }

  private calculateEmotionalRiskTolerance(sentiment: 'positive' | 'negative' | 'neutral'): number {
    switch (sentiment) {
      case 'positive':
        return 7 // More optimistic, higher risk tolerance
      case 'negative':
        return 3 // More cautious, lower risk tolerance
      case 'neutral':
      default:
        return 5 // Balanced risk tolerance
    }
  }
}

export const aiOrchestrator = new AIOrchestratorService() 