import { Transaction } from '@/types/transaction'
import { AnalyticsEngine } from './analyticsEngine'
import { PredictionEngine } from './predictionEngine'
import { AnomalyDetector } from './anomalyDetector'
import { BudgetOptimizer } from './budgetOptimizer'

export interface FinancialInsight {
  type: 'pattern' | 'anomaly' | 'prediction' | 'budget' | 'opportunity'
  title: string
  description: string
  severity: 'info' | 'warning' | 'alert'
  confidence: number
  category?: string
  value?: number
  trend?: string
  action?: string
}

export class InsightsEngine {
  private analyticsEngine: AnalyticsEngine
  private predictionEngine: PredictionEngine
  private anomalyDetector: AnomalyDetector
  private budgetOptimizer: BudgetOptimizer

  constructor() {
    this.analyticsEngine = new AnalyticsEngine()
    this.predictionEngine = new PredictionEngine()
    this.anomalyDetector = new AnomalyDetector()
    this.budgetOptimizer = new BudgetOptimizer()
  }

  async generateInsights(
    transactions: Transaction[],
    monthlyIncome: number
  ): Promise<FinancialInsight[]> {
    const insights: FinancialInsight[] = []

    // Run all analysis in parallel
    const [
      patterns,
      anomalies,
      forecast,
      budget
    ] = await Promise.all([
      this.analyticsEngine.detectSpendingPatterns(transactions),
      this.anomalyDetector.detectAnomalies(transactions),
      this.predictionEngine.forecastSpending(transactions),
      this.budgetOptimizer.optimizeBudget(transactions, monthlyIncome)
    ])

    // Pattern-based insights
    patterns.temporal.forEach(pattern => {
      if (pattern.daily.strength > 0.7) {
        insights.push({
          type: 'pattern',
          title: 'Strong Spending Pattern Detected',
          description: `Your ${pattern.daily.direction} spending trend has ${
            (pattern.daily.strength * 100).toFixed(1)
          }% consistency`,
          severity: pattern.daily.direction === 'increasing' ? 'warning' : 'info',
          confidence: pattern.daily.strength,
          trend: pattern.daily.direction
        })
      }
    })

    // Anomaly-based insights
    anomalies.amountAnomalies.forEach(anomaly => {
      insights.push({
        type: 'anomaly',
        title: 'Unusual Transaction Detected',
        description: anomaly.reason,
        severity: anomaly.severity === 'high' ? 'alert' : 'warning',
        confidence: 0.9,
        category: anomaly.transaction.category,
        value: anomaly.transaction.amount
      })
    })

    // Forecast-based insights
    if (forecast.confidence > 0.7) {
      const nextMonth = forecast.daily.slice(0, 30)
      const totalExpected = nextMonth.reduce((sum, day) => sum + day.expectedAmount, 0)
      
      insights.push({
        type: 'prediction',
        title: 'Next Month Forecast',
        description: `Expected spending of $${totalExpected.toFixed(2)} next month`,
        severity: totalExpected > monthlyIncome ? 'warning' : 'info',
        confidence: forecast.confidence,
        value: totalExpected,
        action: totalExpected > monthlyIncome 
          ? 'Consider reducing non-essential expenses'
          : 'You're on track with your spending'
      })
    }

    // Budget-based insights
    budget.adjustments.forEach(adjustment => {
      if (adjustment.suggestedAmount < adjustment.currentAmount) {
        insights.push({
          type: 'budget',
          title: 'Budget Adjustment Needed',
          description: adjustment.reason,
          severity: 'warning',
          confidence: 0.85,
          category: adjustment.category,
          value: adjustment.currentAmount - adjustment.suggestedAmount,
          action: `Reduce ${adjustment.category} spending by $${
            (adjustment.currentAmount - adjustment.suggestedAmount).toFixed(2)
          }`
        })
      }
    })

    // Opportunity insights
    const savingsRate = this.calculateSavingsRate(transactions, monthlyIncome)
    if (savingsRate < 0.2) { // Less than 20% savings
      insights.push({
        type: 'opportunity',
        title: 'Savings Opportunity',
        description: `Your current savings rate is ${(savingsRate * 100).toFixed(1)}%. Consider increasing it to 20%`,
        severity: 'warning',
        confidence: 0.9,
        value: savingsRate,
        action: 'Review non-essential expenses for savings opportunities'
      })
    }

    return this.prioritizeInsights(insights)
  }

  private calculateSavingsRate(transactions: Transaction[], monthlyIncome: number): number {
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0)
    return Math.max(0, (monthlyIncome - totalExpenses) / monthlyIncome)
  }

  private prioritizeInsights(insights: FinancialInsight[]): FinancialInsight[] {
    // Score each insight
    const scoredInsights = insights.map(insight => ({
      insight,
      score: this.calculateInsightScore(insight)
    }))

    // Sort by score and return top insights
    return scoredInsights
      .sort((a, b) => b.score - a.score)
      .map(({ insight }) => insight)
      .slice(0, 10) // Limit to top 10 insights
  }

  private calculateInsightScore(insight: FinancialInsight): number {
    let score = insight.confidence

    // Adjust score based on severity
    switch (insight.severity) {
      case 'alert':
        score *= 1.5
        break
      case 'warning':
        score *= 1.2
        break
      case 'info':
        score *= 1.0
        break
    }

    // Boost score for actionable insights
    if (insight.action) {
      score *= 1.1
    }

    // Boost score for high-value insights
    if (insight.value && insight.value > 1000) {
      score *= 1.2
    }

    return score
  }
} 