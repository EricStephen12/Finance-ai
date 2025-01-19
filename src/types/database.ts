export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY'

export type TransactionType = 'income' | 'expense' | 'transfer'

export type TransactionCategory =
  | 'salary'
  | 'investment'
  | 'food'
  | 'transportation'
  | 'housing'
  | 'utilities'
  | 'entertainment'
  | 'healthcare'
  | 'education'
  | 'shopping'
  | 'other'

export interface Profile {
  id: string
  created_at: string
  full_name: string
  preferred_currency: CurrencyCode
  monthly_budget: number
  savings_goal: number
  risk_tolerance: number
  avatar_url?: string
  email: string
}

export interface Transaction {
  id: string
  created_at: string
  user_id: string
  type: TransactionType
  category: TransactionCategory
  amount: number
  currency: CurrencyCode
  description: string
  date: string
  recurring: boolean
  recurring_interval?: string
}

export interface Account {
  id: string
  created_at: string
  user_id: string
  name: string
  type: string
  balance: number
  currency: CurrencyCode
  institution?: string
  last_synced?: string
}

export interface BudgetGoal {
  id: string
  created_at: string
  user_id: string
  category: TransactionCategory
  amount: number
  currency: CurrencyCode
  period: 'monthly' | 'yearly'
  start_date: string
  end_date?: string
}

export interface AIInsight {
  id: string
  created_at: string
  user_id: string
  type: 'spending_pattern' | 'savings_opportunity' | 'investment_advice' | 'budget_alert'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  read: boolean
  metadata?: Record<string, any>
}

export interface RecurringTransaction {
  id: string
  created_at: string
  user_id: string
  type: TransactionType
  category: TransactionCategory
  amount: number
  currency: CurrencyCode
  description: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  start_date: string
  end_date?: string
  last_processed?: string
  active: boolean
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at'>
        Update: Partial<Omit<Transaction, 'id' | 'created_at'>>
      }
      accounts: {
        Row: Account
        Insert: Omit<Account, 'id' | 'created_at'>
        Update: Partial<Omit<Account, 'id' | 'created_at'>>
      }
      budget_goals: {
        Row: BudgetGoal
        Insert: Omit<BudgetGoal, 'id' | 'created_at'>
        Update: Partial<Omit<BudgetGoal, 'id' | 'created_at'>>
      }
      ai_insights: {
        Row: AIInsight
        Insert: Omit<AIInsight, 'id' | 'created_at'>
        Update: Partial<Omit<AIInsight, 'id' | 'created_at'>>
      }
      recurring_transactions: {
        Row: RecurringTransaction
        Insert: Omit<RecurringTransaction, 'id' | 'created_at'>
        Update: Partial<Omit<RecurringTransaction, 'id' | 'created_at'>>
      }
    }
  }
} 