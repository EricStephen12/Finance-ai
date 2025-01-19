export interface Portfolio {
  assets: Asset[]
  totalValue: number
  lastUpdated: Date
  historicalPrices: PriceHistory[]
  performance: PerformanceMetrics
}

export interface Asset {
  id: string
  symbol: string
  name: string
  type: AssetType
  quantity: number
  currentPrice: number
  costBasis: number
  sector?: string
  region?: string
  currency: string
  risk_level: RiskLevel
}

export interface AssetAllocation {
  type: AssetType
  currentPercentage: number
  targetPercentage: number
  value: number
}

export interface PriceHistory {
  date: Date
  price: number
  volume?: number
}

export interface PerformanceMetrics {
  totalReturn: number
  annualizedReturn: number
  sharpeRatio: number
  volatility: number
  maxDrawdown: number
  beta: number
  alpha: number
}

export type AssetType = 
  | 'stock'
  | 'bond'
  | 'etf'
  | 'mutual_fund'
  | 'crypto'
  | 'commodity'
  | 'real_estate'
  | 'cash'
  | 'other'

export type RiskLevel =
  | 'very_low'
  | 'low'
  | 'moderate'
  | 'high'
  | 'very_high' 