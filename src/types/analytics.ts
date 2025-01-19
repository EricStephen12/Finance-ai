export type FinancialAnalysisType = 'spending' | 'forecast' | 'budget' | 'tax'

export interface SpendingAnalysis {
  patterns: Array<{
    category: string
    amount: number
    trend: 'increasing' | 'decreasing' | 'stable'
    anomalies: string[]
  }>
  opportunities: Array<{
    category: string
    potentialSavings: number
    suggestions: string[]
  }>
  insights: string[]
  type: 'spending'
}

export interface ForecastAnalysis {
  predictions: Array<{
    period: string
    amount: number
    confidence: number
  }>
  confidence: number
  recommendations: string[]
}

export interface BudgetAnalysis {
  allocations: Array<{
    category: string
    amount: number
    percentage: number
  }>
  adjustments: Array<{
    category: string
    currentAmount: number
    suggestedAmount: number
    reason: string
  }>
  recommendations: string[]
}

export interface TaxAnalysis {
  deductions: Array<{
    category: string
    amount: number
    eligibility: number
  }>
  credits: Array<{
    type: string
    amount: number
    requirements: string[]
  }>
  strategies: Array<{
    description: string
    potentialSavings: number
    steps: string[]
  }>
}

export type FinancialAnalysis = SpendingAnalysis | ForecastAnalysis | BudgetAnalysis | TaxAnalysis 