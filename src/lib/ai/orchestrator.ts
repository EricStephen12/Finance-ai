import { analyzeSentiment, getFinancialAdvice, getInvestmentAdvice, analyzeBudget } from './models'

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

class AIOrchestratorService {
  async analyzeFinancialData(data: FinancialAnalysisRequest): Promise<any> {
    try {
      switch (data.type) {
        case 'emotional':
          return this.analyzeEmotionalContext(data)
        case 'financial':
          return this.analyzeFinancialContext(data)
        case 'investment':
          return this.analyzeInvestmentContext(data)
        case 'budget':
          return this.analyzeBudgetContext(data)
        default:
          throw new Error('Invalid analysis type')
      }
    } catch (error) {
      console.error('Error in AI analysis:', error)
      throw new Error('Failed to analyze financial data')
    }
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