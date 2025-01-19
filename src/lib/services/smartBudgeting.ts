import { Transaction } from '@/types/transaction'
import { Category } from '@/types/category'
import { GeoLocation } from '@/types/location'

// Core Types
interface BudgetAnalysis {
  essentialExpenses: number
  discretionaryExpenses: number
  savingsRate: number
  recommendations: BudgetRecommendation[]
}

interface BudgetRecommendation {
  category: Category
  currentSpending: number
  recommendedSpending: number
  potentialSavings: number
  alternatives?: SavingsOpportunity[]
}

interface SavingsOpportunity {
  location: GeoLocation
  name: string
  currentPrice: number
  suggestedPrice: number
  distance: number
  rating: number
}

// Core Smart Budgeting Service
export class SmartBudgetingService {
  // 1. Core Expense Analysis
  async analyzeExpenses(transactions: Transaction[]): Promise<BudgetAnalysis> {
    const categorized = this.categorizeExpenses(transactions)
    const essentialExpenses = this.calculateEssentialExpenses(categorized)
    const discretionaryExpenses = this.calculateDiscretionaryExpenses(categorized)
    const savingsRate = this.calculateSavingsRate(transactions)
    
    const recommendations = await this.generateRecommendations(
      categorized,
      essentialExpenses,
      discretionaryExpenses
    )

    return {
      essentialExpenses,
      discretionaryExpenses,
      savingsRate,
      recommendations
    }
  }

  // 2. Expense Categorization
  private categorizeExpenses(transactions: Transaction[]): Map<Category, Transaction[]> {
    const categorized = new Map<Category, Transaction[]>()
    
    transactions.forEach(transaction => {
      const existing = categorized.get(transaction.category) || []
      categorized.set(transaction.category, [...existing, transaction])
    })
    
    return categorized
  }

  // 3. Smart Recommendations
  private async generateRecommendations(
    categorized: Map<Category, Transaction[]>,
    essentialExpenses: number,
    discretionaryExpenses: number
  ): Promise<BudgetRecommendation[]> {
    const recommendations: BudgetRecommendation[] = []

    for (const [category, transactions] of categorized) {
      const currentSpending = this.calculateTotalSpending(transactions)
      const recommendedSpending = this.calculateRecommendedSpending(
        category,
        essentialExpenses,
        discretionaryExpenses
      )

      if (currentSpending > recommendedSpending) {
        recommendations.push({
          category,
          currentSpending,
          recommendedSpending,
          potentialSavings: currentSpending - recommendedSpending,
          alternatives: await this.findSavingsOpportunities(category, transactions)
        })
      }
    }

    return recommendations.sort((a, b) => b.potentialSavings - a.potentialSavings)
  }

  // 4. Location-Based Savings
  private async findSavingsOpportunities(
    category: Category,
    transactions: Transaction[]
  ): Promise<SavingsOpportunity[]> {
    if (!this.isCategoryEligibleForLocationSavings(category)) {
      return []
    }

    const locations = await this.fetchNearbyAlternatives(category)
    return this.rankSavingsOpportunities(locations, transactions)
  }

  // 5. Utility Functions
  private calculateEssentialExpenses(categorized: Map<Category, Transaction[]>): number {
    let total = 0
    for (const [category, transactions] of categorized) {
      if (this.isEssentialCategory(category)) {
        total += this.calculateTotalSpending(transactions)
      }
    }
    return total
  }

  private calculateDiscretionaryExpenses(categorized: Map<Category, Transaction[]>): number {
    let total = 0
    for (const [category, transactions] of categorized) {
      if (!this.isEssentialCategory(category)) {
        total += this.calculateTotalSpending(transactions)
      }
    }
    return total
  }

  private calculateSavingsRate(transactions: Transaction[]): number {
    const income = this.calculateTotalIncome(transactions)
    const expenses = this.calculateTotalExpenses(transactions)
    return income > 0 ? ((income - expenses) / income) * 100 : 0
  }

  private calculateTotalSpending(transactions: Transaction[]): number {
    return transactions.reduce((sum, t) => sum + t.amount, 0)
  }

  private isEssentialCategory(category: Category): boolean {
    const essentialCategories = ['housing', 'utilities', 'groceries', 'healthcare', 'transportation']
    return essentialCategories.includes(category.toLowerCase())
  }

  private isCategoryEligibleForLocationSavings(category: Category): boolean {
    const eligibleCategories = ['groceries', 'dining', 'shopping', 'entertainment']
    return eligibleCategories.includes(category.toLowerCase())
  }

  private calculateRecommendedSpending(
    category: Category,
    essentialExpenses: number,
    discretionaryExpenses: number
  ): number {
    // Implement budget allocation rules based on category type
    const totalExpenses = essentialExpenses + discretionaryExpenses
    const categorySpendingRatios = {
      housing: 0.3,
      utilities: 0.1,
      groceries: 0.15,
      transportation: 0.15,
      healthcare: 0.1,
      entertainment: 0.05,
      shopping: 0.05,
      dining: 0.05,
      other: 0.05
    }

    return totalExpenses * (categorySpendingRatios[category.toLowerCase()] || 0.05)
  }
} 