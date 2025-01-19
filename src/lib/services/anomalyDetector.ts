import { Transaction } from '@/types/transaction'
import { Category } from '@/types/category'

export class AnomalyDetector {
  // Configurable thresholds
  private readonly AMOUNT_ZSCORE_THRESHOLD = 3.0  // Standard deviations for amount anomalies
  private readonly FREQUENCY_THRESHOLD = 2.0      // Multiplier for frequency anomalies
  private readonly PATTERN_BREAK_THRESHOLD = 0.3  // 30% deviation from pattern

  detectAnomalies(transactions: Transaction[]): AnomalyReport {
    const byCategory = this.groupByCategory(transactions)
    
    return {
      amountAnomalies: this.detectAmountAnomalies(transactions, byCategory),
      frequencyAnomalies: this.detectFrequencyAnomalies(transactions, byCategory),
      patternBreaks: this.detectPatternBreaks(transactions, byCategory),
      suspiciousActivity: this.detectSuspiciousActivity(transactions)
    }
  }

  private detectAmountAnomalies(
    transactions: Transaction[],
    byCategory: Map<Category, Transaction[]>
  ): AmountAnomaly[] {
    const anomalies: AmountAnomaly[] = []

    byCategory.forEach((categoryTransactions, category) => {
      const amounts = categoryTransactions.map(t => t.amount)
      const stats = this.calculateStats(amounts)

      categoryTransactions.forEach(transaction => {
        const zscore = Math.abs((transaction.amount - stats.mean) / stats.std)
        
        if (zscore > this.AMOUNT_ZSCORE_THRESHOLD) {
          anomalies.push({
            transaction,
            type: 'amount',
            severity: this.calculateSeverity(zscore),
            reason: `Unusual amount for ${category} category (${zscore.toFixed(1)} standard deviations from mean)`
          })
        }
      })
    })

    return anomalies
  }

  private detectFrequencyAnomalies(
    transactions: Transaction[],
    byCategory: Map<Category, Transaction[]>
  ): FrequencyAnomaly[] {
    const anomalies: FrequencyAnomaly[] = []
    const timeRanges = this.calculateTimeRanges(transactions)

    byCategory.forEach((categoryTransactions, category) => {
      const normalFrequency = categoryTransactions.length / timeRanges.totalDays
      const dailyCounts = this.getDailyCounts(categoryTransactions)

      dailyCounts.forEach((count, date) => {
        if (count > normalFrequency * this.FREQUENCY_THRESHOLD) {
          anomalies.push({
            date: new Date(date),
            category,
            type: 'frequency',
            count,
            normalCount: normalFrequency,
            severity: this.calculateSeverity(count / normalFrequency)
          })
        }
      })
    })

    return anomalies
  }

  private detectPatternBreaks(
    transactions: Transaction[],
    byCategory: Map<Category, Transaction[]>
  ): PatternBreak[] {
    const breaks: PatternBreak[] = []
    const patterns = this.identifyPatterns(transactions)

    patterns.forEach(pattern => {
      const recentTransactions = transactions
        .filter(t => 
          t.category === pattern.category &&
          t.date >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        )

      recentTransactions.forEach(transaction => {
        const deviation = Math.abs(
          (transaction.amount - pattern.expectedAmount) / pattern.expectedAmount
        )

        if (deviation > this.PATTERN_BREAK_THRESHOLD) {
          breaks.push({
            transaction,
            pattern,
            deviation,
            severity: this.calculateSeverity(deviation * 2)
          })
        }
      })
    })

    return breaks
  }

  private detectSuspiciousActivity(transactions: Transaction[]): SuspiciousActivity[] {
    const suspicious: SuspiciousActivity[] = []
    const recentTransactions = transactions
      .filter(t => t.date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))

    // Detect rapid succession transactions
    const timeOrderedTransactions = [...recentTransactions]
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    for (let i = 1; i < timeOrderedTransactions.length; i++) {
      const current = timeOrderedTransactions[i]
      const previous = timeOrderedTransactions[i - 1]
      const timeDiff = current.date.getTime() - previous.date.getTime()

      if (
        timeDiff < 5 * 60 * 1000 && // 5 minutes
        current.category === previous.category &&
        Math.abs(current.amount - previous.amount) < 1
      ) {
        suspicious.push({
          transactions: [previous, current],
          type: 'rapid_succession',
          severity: 'high',
          reason: 'Multiple similar transactions in rapid succession'
        })
      }
    }

    // Detect unusual location patterns
    if (this.hasLocationData(transactions)) {
      const locationAnomalies = this.detectLocationAnomalies(recentTransactions)
      suspicious.push(...locationAnomalies)
    }

    return suspicious
  }

  // Utility functions
  private calculateStats(numbers: number[]): { mean: number; std: number } {
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length
    const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length
    return { mean, std: Math.sqrt(variance) }
  }

  private calculateTimeRanges(transactions: Transaction[]): TimeRanges {
    const dates = transactions.map(t => t.date.getTime())
    return {
      start: new Date(Math.min(...dates)),
      end: new Date(Math.max(...dates)),
      totalDays: (Math.max(...dates) - Math.min(...dates)) / (24 * 60 * 60 * 1000)
    }
  }

  private getDailyCounts(transactions: Transaction[]): Map<string, number> {
    const counts = new Map<string, number>()
    
    transactions.forEach(transaction => {
      const date = transaction.date.toISOString().split('T')[0]
      counts.set(date, (counts.get(date) || 0) + 1)
    })
    
    return counts
  }

  private calculateSeverity(factor: number): 'low' | 'medium' | 'high' {
    if (factor > 5) return 'high'
    if (factor > 3) return 'medium'
    return 'low'
  }

  private groupByCategory(transactions: Transaction[]): Map<Category, Transaction[]> {
    const grouped = new Map<Category, Transaction[]>()
    
    transactions.forEach(transaction => {
      const category = transaction.category
      const existing = grouped.get(category) || []
      grouped.set(category, [...existing, transaction])
    })
    
    return grouped
  }

  private identifyPatterns(transactions: Transaction[]): TransactionPattern[] {
    const patterns: TransactionPattern[] = []
    const byCategory = this.groupByCategory(transactions)

    byCategory.forEach((categoryTransactions, category) => {
      const amounts = categoryTransactions.map(t => t.amount)
      const stats = this.calculateStats(amounts)

      if (stats.std / stats.mean < 0.2) { // Low variation indicates a pattern
        patterns.push({
          category,
          expectedAmount: stats.mean,
          confidence: 1 - (stats.std / stats.mean)
        })
      }
    })

    return patterns
  }

  private hasLocationData(transactions: Transaction[]): boolean {
    return transactions.some(t => t.location)
  }

  private detectLocationAnomalies(transactions: Transaction[]): SuspiciousActivity[] {
    const suspicious: SuspiciousActivity[] = []
    const locationHistory = new Map<Category, Set<string>>()

    // Build location history by category
    transactions.forEach(t => {
      if (t.location) {
        const locations = locationHistory.get(t.category) || new Set()
        locations.add(this.getLocationKey(t.location))
        locationHistory.set(t.category, locations)
      }
    })

    // Check for transactions in unusual locations
    transactions.forEach(transaction => {
      if (transaction.location) {
        const knownLocations = locationHistory.get(transaction.category)
        if (knownLocations && !knownLocations.has(this.getLocationKey(transaction.location))) {
          suspicious.push({
            transactions: [transaction],
            type: 'unusual_location',
            severity: 'medium',
            reason: 'Transaction in unusual location for this category'
          })
        }
      }
    })

    return suspicious
  }

  private getLocationKey(location: any): string {
    // Round coordinates to ~1km precision
    const lat = Math.round(location.latitude * 100) / 100
    const lng = Math.round(location.longitude * 100) / 100
    return `${lat},${lng}`
  }
} 