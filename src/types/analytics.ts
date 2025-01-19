import { Category } from './category'

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

export interface SpendingPattern {
  temporal: TemporalPattern[]
  categorical: CategoryPattern[]
  recurring: RecurringPattern[]
}

export interface TemporalPattern {
  daily: TrendInfo
  weekly: TrendInfo
  monthly: TrendInfo
  seasonality: SeasonalityInfo
}

export interface CategoryPattern {
  category: Category
  total: number
  average: number
  trend: TrendInfo
  frequency: number
}

export interface RecurringPattern {
  amount: number
  category: Category
  merchant: string
  interval: number
  confidence: number
}

export interface TrendInfo {
  slope: number
  intercept: number
  direction: 'increasing' | 'decreasing' | 'stable'
  strength: number
}

export interface SeasonalityInfo {
  exists: boolean
  period: number
  strength: number
}

// Prediction Types
export interface SpendingForecast {
  daily: DailyForecast[]
  byCategory: CategoryForecast[]
  confidence: number
}

export interface DailyForecast {
  date: Date
  expectedAmount: number
  lowerBound: number
  upperBound: number
  confidence: number
}

export interface CategoryForecast {
  category: Category
  expectedAmount: number
  trend: TrendInfo
  confidence: number
}

export interface SpendingPatterns {
  dailyAverage: number
  categoryDistribution: Record<Category, number>
  volatility: number
}

export interface RecurringExpense {
  amount: number
  category: Category
  interval: number
  probability: number
  nextExpected: Date
}

export interface TrendAnalysis {
  shortTerm: TrendMetrics
  mediumTerm: TrendMetrics
  longTerm: TrendMetrics
}

export interface TrendMetrics {
  slope: number
  intercept: number
  r2: number
} 