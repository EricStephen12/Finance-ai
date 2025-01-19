import { Transaction } from '@/types/transaction'
import { Category } from '@/types/category'

export class PredictionEngine {
  // Spending Forecast
  async forecastSpending(
    transactions: Transaction[],
    forecastPeriod: number = 30 // days
  ): Promise<SpendingForecast> {
    const patterns = this.analyzeSpendingPatterns(transactions)
    const recurring = this.identifyRecurringExpenses(transactions)
    const trends = this.calculateTrends(transactions)

    return {
      daily: this.generateDailyForecast(patterns, recurring, trends, forecastPeriod),
      byCategory: this.generateCategoryForecast(patterns, recurring, trends, forecastPeriod),
      confidence: this.calculateForecastConfidence(patterns)
    }
  }

  // Pattern Analysis
  private analyzeSpendingPatterns(transactions: Transaction[]): SpendingPatterns {
    const byDay = this.groupByDay(transactions)
    const byCategory = this.groupByCategory(transactions)

    return {
      dailyAverage: this.calculateDailyAverage(byDay),
      categoryDistribution: this.calculateCategoryDistribution(byCategory),
      volatility: this.calculateVolatility(byDay)
    }
  }

  // Recurring Expense Detection
  private identifyRecurringExpenses(transactions: Transaction[]): RecurringExpense[] {
    const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime())
    const recurring: RecurringExpense[] = []

    // Group by category and amount
    const groups = this.groupSimilarTransactions(sorted)

    for (const group of groups) {
      if (group.length >= 3) { // Need at least 3 occurrences to establish pattern
        const intervals = this.calculateIntervals(group)
        const averageInterval = this.average(intervals)
        const intervalVariance = this.variance(intervals)

        // If interval variance is low enough, consider it recurring
        if (intervalVariance < averageInterval * 0.2) {
          recurring.push({
            amount: group[0].amount,
            category: group[0].category,
            interval: Math.round(averageInterval),
            probability: 1 - (intervalVariance / averageInterval),
            nextExpected: this.predictNextOccurrence(group, averageInterval)
          })
        }
      }
    }

    return recurring
  }

  // Trend Analysis
  private calculateTrends(transactions: Transaction[]): TrendAnalysis {
    const dailyTotals = this.groupByDay(transactions)
    const dates = Object.keys(dailyTotals).sort()
    const amounts = dates.map(date => dailyTotals[date])

    return {
      shortTerm: this.calculateTrendMetrics(amounts.slice(-7)),  // Last week
      mediumTerm: this.calculateTrendMetrics(amounts.slice(-30)), // Last month
      longTerm: this.calculateTrendMetrics(amounts) // All time
    }
  }

  // Forecast Generation
  private generateDailyForecast(
    patterns: SpendingPatterns,
    recurring: RecurringExpense[],
    trends: TrendAnalysis,
    days: number
  ): DailyForecast[] {
    const forecast: DailyForecast[] = []
    const baselineDaily = patterns.dailyAverage
    const volatility = patterns.volatility

    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)

      // Calculate expected recurring expenses for this day
      const recurringExpenses = recurring
        .filter(r => this.isExpectedOnDate(r, date))
        .reduce((sum, r) => sum + r.amount, 0)

      // Apply trend adjustment
      const trendAdjustment = this.calculateTrendAdjustment(trends, i)

      // Generate forecast with confidence interval
      const expectedAmount = baselineDaily * trendAdjustment + recurringExpenses
      const range = expectedAmount * volatility

      forecast.push({
        date,
        expectedAmount,
        lowerBound: expectedAmount - range,
        upperBound: expectedAmount + range,
        confidence: this.calculateDayConfidence(i, volatility)
      })
    }

    return forecast
  }

  // Utility Functions
  private average(numbers: number[]): number {
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length
  }

  private variance(numbers: number[]): number {
    const avg = this.average(numbers)
    return this.average(numbers.map(n => Math.pow(n - avg, 2)))
  }

  private calculateIntervals(transactions: Transaction[]): number[] {
    const intervals: number[] = []
    for (let i = 1; i < transactions.length; i++) {
      const days = (transactions[i].date.getTime() - transactions[i-1].date.getTime()) 
        / (1000 * 60 * 60 * 24)
      intervals.push(days)
    }
    return intervals
  }

  private predictNextOccurrence(
    transactions: Transaction[], 
    interval: number
  ): Date {
    const lastDate = transactions[transactions.length - 1].date
    const nextDate = new Date(lastDate)
    nextDate.setDate(nextDate.getDate() + Math.round(interval))
    return nextDate
  }

  private calculateTrendAdjustment(trends: TrendAnalysis, daysAhead: number): number {
    const shortTermWeight = Math.max(0, 1 - daysAhead / 7)
    const mediumTermWeight = Math.max(0, 1 - daysAhead / 30)
    const longTermWeight = 1

    return (
      trends.shortTerm.slope * shortTermWeight +
      trends.mediumTerm.slope * mediumTermWeight +
      trends.longTerm.slope * longTermWeight
    ) / (shortTermWeight + mediumTermWeight + longTermWeight)
  }

  private calculateDayConfidence(daysAhead: number, volatility: number): number {
    // Confidence decreases with time and volatility
    return Math.max(0.5, 1 - (daysAhead * volatility / 100))
  }

  private groupSimilarTransactions(transactions: Transaction[]): Transaction[][] {
    const groups: Map<string, Transaction[]> = new Map()

    transactions.forEach(t => {
      const key = `${t.category}-${t.amount}`
      const group = groups.get(key) || []
      group.push(t)
      groups.set(key, group)
    })

    return Array.from(groups.values())
  }

  private isExpectedOnDate(recurring: RecurringExpense, date: Date): boolean {
    const lastOccurrence = recurring.nextExpected
    const daysSince = (date.getTime() - lastOccurrence.getTime()) / (1000 * 60 * 60 * 24)
    return Math.abs(daysSince % recurring.interval) < 1
  }
} 