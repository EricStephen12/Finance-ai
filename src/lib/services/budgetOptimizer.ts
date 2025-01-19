import { Transaction } from '@/types/transaction'
import { Category } from '@/types/category'
import { BudgetAnalysis } from '@/types/analytics'

export class BudgetOptimizer {
  // Standard budget ratios based on 50/30/20 rule
  private readonly BUDGET_RATIOS = {
    essential: 0.5,    // 50% for needs
    discretionary: 0.3, // 30% for wants
    savings: 0.2       // 20% for savings/debt
  }

  // Category-specific target ratios within essential spending
  private readonly ESSENTIAL_RATIOS = {
    housing: 0.35,      // 35% of essential spending
    utilities: 0.10,    // 10% of essential spending
    groceries: 0.15,    // 15% of essential spending
    healthcare: 0.15,   // 15% of essential spending
    transportation: 0.15, // 15% of essential spending
    insurance: 0.10     // 10% of essential spending
  }

  async optimizeBudget(
    transactions: Transaction[],
    monthlyIncome: number
  ): Promise<BudgetAnalysis> {
    const currentSpending = this.analyzeCurrentSpending(transactions)
    const optimizedAllocations = this.calculateOptimalAllocations(monthlyIncome)
    const adjustments = this.calculateRequiredAdjustments(
      currentSpending,
      optimizedAllocations
    )

    return {
      allocations: this.generateAllocations(optimizedAllocations),
      adjustments: this.generateAdjustments(currentSpending, optimizedAllocations),
      recommendations: this.generateRecommendations(adjustments)
    }
  }

  private analyzeCurrentSpending(transactions: Transaction[]): Map<Category, number> {
    const spending = new Map<Category, number>()
    
    transactions.forEach(transaction => {
      const current = spending.get(transaction.category) || 0
      spending.set(transaction.category, current + transaction.amount)
    })
    
    return spending
  }

  private calculateOptimalAllocations(monthlyIncome: number): Map<Category, number> {
    const allocations = new Map<Category, number>()
    
    // Calculate essential spending budget
    const essentialBudget = monthlyIncome * this.BUDGET_RATIOS.essential
    
    // Allocate essential spending by category
    Object.entries(this.ESSENTIAL_RATIOS).forEach(([category, ratio]) => {
      allocations.set(category as Category, essentialBudget * ratio)
    })
    
    // Allocate discretionary spending
    const discretionaryBudget = monthlyIncome * this.BUDGET_RATIOS.discretionary
    const discretionaryCategories = ['entertainment', 'dining', 'shopping', 'hobbies']
    const discretionaryRatio = discretionaryBudget / discretionaryCategories.length
    
    discretionaryCategories.forEach(category => {
      allocations.set(category as Category, discretionaryRatio)
    })
    
    // Allocate savings
    allocations.set('savings', monthlyIncome * this.BUDGET_RATIOS.savings)
    
    return allocations
  }

  private calculateRequiredAdjustments(
    current: Map<Category, number>,
    optimal: Map<Category, number>
  ): Map<Category, number> {
    const adjustments = new Map<Category, number>()
    
    optimal.forEach((optimalAmount, category) => {
      const currentAmount = current.get(category) || 0
      const adjustment = optimalAmount - currentAmount
      
      if (Math.abs(adjustment) > optimalAmount * 0.05) { // 5% threshold
        adjustments.set(category, adjustment)
      }
    })
    
    return adjustments
  }

  private generateAllocations(
    allocations: Map<Category, number>
  ): Array<{category: string; amount: number; percentage: number}> {
    const total = Array.from(allocations.values()).reduce((sum, amount) => sum + amount, 0)
    
    return Array.from(allocations.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / total) * 100
    }))
  }

  private generateAdjustments(
    current: Map<Category, number>,
    optimal: Map<Category, number>
  ): Array<{category: string; currentAmount: number; suggestedAmount: number; reason: string}> {
    const adjustments: Array<{
      category: string;
      currentAmount: number;
      suggestedAmount: number;
      reason: string;
    }> = []

    optimal.forEach((optimalAmount, category) => {
      const currentAmount = current.get(category) || 0
      const difference = optimalAmount - currentAmount
      
      if (Math.abs(difference) > optimalAmount * 0.05) {
        adjustments.push({
          category,
          currentAmount,
          suggestedAmount: optimalAmount,
          reason: this.generateAdjustmentReason(category, difference, optimalAmount)
        })
      }
    })

    return adjustments.sort((a, b) => 
      Math.abs(b.suggestedAmount - b.currentAmount) - 
      Math.abs(a.suggestedAmount - a.currentAmount)
    )
  }

  private generateAdjustmentReason(
    category: string,
    difference: number,
    optimalAmount: number
  ): string {
    const percentageDiff = (difference / optimalAmount) * 100
    const direction = difference > 0 ? 'increase' : 'decrease'
    
    if (Math.abs(percentageDiff) > 20) {
      return `Significant ${direction} needed to align with recommended budget allocation`
    } else if (Math.abs(percentageDiff) > 10) {
      return `Moderate ${direction} recommended for better budget balance`
    } else {
      return `Minor ${direction} suggested for optimal budget allocation`
    }
  }

  private generateRecommendations(
    adjustments: Map<Category, number>
  ): string[] {
    const recommendations: string[] = []
    const sortedAdjustments = Array.from(adjustments.entries())
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))

    // Generate high-priority recommendations
    sortedAdjustments.slice(0, 3).forEach(([category, adjustment]) => {
      if (adjustment > 0) {
        recommendations.push(
          `Increase ${category} budget by ${this.formatCurrency(adjustment)} to meet recommended allocation`
        )
      } else {
        recommendations.push(
          `Reduce ${category} spending by ${this.formatCurrency(Math.abs(adjustment))} to optimize budget`
        )
      }
    })

    // Add general recommendations based on patterns
    if (this.hasHighEssentialSpending(adjustments)) {
      recommendations.push(
        'Consider reviewing essential expenses for potential cost-saving opportunities'
      )
    }

    if (this.hasLowSavings(adjustments)) {
      recommendations.push(
        'Prioritize increasing savings by reducing discretionary spending'
      )
    }

    return recommendations
  }

  private hasHighEssentialSpending(adjustments: Map<Category, number>): boolean {
    const essentialCategories = Object.keys(this.ESSENTIAL_RATIOS)
    const essentialAdjustments = essentialCategories
      .map(category => adjustments.get(category as Category) || 0)
    
    return essentialAdjustments.some(adjustment => adjustment < 0)
  }

  private hasLowSavings(adjustments: Map<Category, number>): boolean {
    const savingsAdjustment = adjustments.get('savings') || 0
    return savingsAdjustment > 0
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
} 