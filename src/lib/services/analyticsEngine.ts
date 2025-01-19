import { Transaction } from '@/types/transaction'
import { Category } from '@/types/category'

export class AnalyticsEngine {
  // Pattern Detection
  detectSpendingPatterns(transactions: Transaction[]): SpendingPattern[] {
    return {
      temporal: this.analyzeTemporalPatterns(transactions),
      categorical: this.analyzeCategoryPatterns(transactions),
      recurring: this.detectRecurringTransactions(transactions)
    }
  }

  // Time Series Analysis
  private analyzeTemporalPatterns(transactions: Transaction[]): TemporalPattern[] {
    const dailySpending = this.aggregateByTimeUnit(transactions, 'day')
    const weeklySpending = this.aggregateByTimeUnit(transactions, 'week')
    const monthlySpending = this.aggregateByTimeUnit(transactions, 'month')

    return {
      daily: this.calculateTrends(dailySpending),
      weekly: this.calculateTrends(weeklySpending),
      monthly: this.calculateTrends(monthlySpending),
      seasonality: this.detectSeasonality(monthlySpending)
    }
  }

  // Category Analysis
  private analyzeCategoryPatterns(transactions: Transaction[]): CategoryPattern[] {
    const categoryGroups = this.groupByCategory(transactions)
    return Object.entries(categoryGroups).map(([category, txns]) => ({
      category,
      total: this.sum(txns.map(t => t.amount)),
      average: this.average(txns.map(t => t.amount)),
      trend: this.calculateTrend(txns.map(t => t.amount)),
      frequency: txns.length / this.dateRangeInDays(txns)
    }))
  }

  // Recurring Transaction Detection
  private detectRecurringTransactions(transactions: Transaction[]): RecurringPattern[] {
    const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime())
    const patterns: RecurringPattern[] = []

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i]
      const similar = sorted.slice(i + 1).filter(t => 
        t.amount === current.amount &&
        t.category === current.category &&
        t.merchant === current.merchant
      )

      if (similar.length >= 2) {
        const intervals = similar.map((t, idx) => 
          (t.date.getTime() - sorted[idx].date.getTime()) / (1000 * 60 * 60 * 24)
        )

        const averageInterval = this.average(intervals)
        const isRegular = this.standardDeviation(intervals) < averageInterval * 0.1

        if (isRegular) {
          patterns.push({
            amount: current.amount,
            category: current.category,
            merchant: current.merchant,
            interval: Math.round(averageInterval),
            confidence: this.calculateConfidence(intervals)
          })
        }
      }
    }

    return patterns
  }

  // Statistical Utilities
  private sum(numbers: number[]): number {
    return numbers.reduce((sum, n) => sum + n, 0)
  }

  private average(numbers: number[]): number {
    return this.sum(numbers) / numbers.length
  }

  private standardDeviation(numbers: number[]): number {
    const avg = this.average(numbers)
    const squareDiffs = numbers.map(n => Math.pow(n - avg, 2))
    return Math.sqrt(this.average(squareDiffs))
  }

  private calculateTrend(numbers: number[]): TrendInfo {
    // Simple linear regression
    const n = numbers.length
    const xs = Array.from({length: n}, (_, i) => i)
    const sumX = this.sum(xs)
    const sumY = this.sum(numbers)
    const sumXY = this.sum(xs.map((x, i) => x * numbers[i]))
    const sumXX = this.sum(xs.map(x => x * x))

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    return {
      slope,
      intercept,
      direction: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
      strength: Math.abs(slope) / this.average(numbers)
    }
  }

  private calculateConfidence(intervals: number[]): number {
    const std = this.standardDeviation(intervals)
    const mean = this.average(intervals)
    return Math.max(0, Math.min(1, 1 - (std / mean)))
  }

  private dateRangeInDays(transactions: Transaction[]): number {
    const dates = transactions.map(t => t.date.getTime())
    return (Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24)
  }

  private aggregateByTimeUnit(
    transactions: Transaction[],
    unit: 'day' | 'week' | 'month'
  ): { date: Date; amount: number }[] {
    const grouped = new Map<string, number>()

    transactions.forEach(t => {
      const key = this.getTimeUnitKey(t.date, unit)
      grouped.set(key, (grouped.get(key) || 0) + t.amount)
    })

    return Array.from(grouped.entries()).map(([key, amount]) => ({
      date: new Date(key),
      amount
    }))
  }

  private getTimeUnitKey(date: Date, unit: 'day' | 'week' | 'month'): string {
    const d = new Date(date)
    switch (unit) {
      case 'day':
        return d.toISOString().split('T')[0]
      case 'week':
        d.setDate(d.getDate() - d.getDay())
        return d.toISOString().split('T')[0]
      case 'month':
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    }
  }

  private detectSeasonality(data: { date: Date; amount: number }[]): SeasonalityInfo {
    // Implement seasonal decomposition
    const values = data.map(d => d.amount)
    const n = values.length
    
    if (n < 12) return { exists: false, period: 0, strength: 0 }

    // Check for monthly seasonality (12 months)
    const monthlyCorrelation = this.calculateSeasonalCorrelation(values, 12)
    
    return {
      exists: monthlyCorrelation > 0.6,
      period: 12,
      strength: monthlyCorrelation
    }
  }

  private calculateSeasonalCorrelation(values: number[], period: number): number {
    const n = values.length
    if (n < period * 2) return 0

    const segments: number[][] = []
    for (let i = 0; i < Math.floor(n / period); i++) {
      segments.push(values.slice(i * period, (i + 1) * period))
    }

    let correlation = 0
    for (let i = 0; i < segments.length - 1; i++) {
      correlation += this.calculateCorrelation(segments[i], segments[i + 1])
    }

    return correlation / (segments.length - 1)
  }

  private calculateCorrelation(a: number[], b: number[]): number {
    const n = Math.min(a.length, b.length)
    const meanA = this.average(a)
    const meanB = this.average(b)
    
    let num = 0
    let denA = 0
    let denB = 0
    
    for (let i = 0; i < n; i++) {
      const diffA = a[i] - meanA
      const diffB = b[i] - meanB
      num += diffA * diffB
      denA += diffA * diffA
      denB += diffB * diffB
    }
    
    return num / Math.sqrt(denA * denB)
  }
} 