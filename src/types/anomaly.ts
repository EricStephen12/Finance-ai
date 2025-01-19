import { Transaction } from './transaction'
import { Category } from './category'

export interface AnomalyReport {
  amountAnomalies: AmountAnomaly[]
  frequencyAnomalies: FrequencyAnomaly[]
  patternBreaks: PatternBreak[]
  suspiciousActivity: SuspiciousActivity[]
}

export interface AmountAnomaly {
  transaction: Transaction
  type: 'amount'
  severity: 'low' | 'medium' | 'high'
  reason: string
}

export interface FrequencyAnomaly {
  date: Date
  category: Category
  type: 'frequency'
  count: number
  normalCount: number
  severity: 'low' | 'medium' | 'high'
}

export interface PatternBreak {
  transaction: Transaction
  pattern: TransactionPattern
  deviation: number
  severity: 'low' | 'medium' | 'high'
}

export interface SuspiciousActivity {
  transactions: Transaction[]
  type: 'rapid_succession' | 'unusual_location' | 'pattern_deviation'
  severity: 'low' | 'medium' | 'high'
  reason: string
}

export interface TransactionPattern {
  category: Category
  expectedAmount: number
  confidence: number
}

export interface TimeRanges {
  start: Date
  end: Date
  totalDays: number
} 