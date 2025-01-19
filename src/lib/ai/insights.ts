import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore'

interface SpendingPattern {
  category: string
  amount: number
  trend: 'increasing' | 'stable' | 'decreasing'
  frequency: number
  averageAmount: number
  monthlyVariation: number
  explanation: string
  actionableSteps: string[]
}

interface SavingsProjection {
  currentSavings: number
  projectedSavings: number
  monthlyGrowth: number
  yearlyGrowth: number
  potentialInvestmentReturns: number
  riskLevel: 'low' | 'medium' | 'high'
  explanation: string
  actionableSteps: string[]
}

interface FinancialTrend {
  metric: string
  trend: 'up' | 'down'
  percentage: number
  explanation: string
  impact: string
  actionableSteps: string[]
}

interface FinancialHealth {
  score: number
  trends: FinancialTrend[]
  explanation: string
  improvementSteps: string[]
  riskFactors: Array<{
    factor: string
    severity: 'low' | 'medium' | 'high'
    mitigation: string[]
  }>
}

interface SpendingCategory {
  category: string
  amount: number
  percentage: number
  comparison: 'above' | 'below' | 'within' | 'normal'
  explanation: string
  optimizationSteps: string[]
}

interface Recommendation {
  title: string
  description: string
  impact: {
    monthly: number
    yearly: number
    description: string
  }
  priority: 'high' | 'medium' | 'low'
  timeframe: string
  steps: string[]
  expectedOutcome: string
}

interface FinancialInsights {
  totalIncome: number
  totalExpenses: number
  currentSavings: number
  financialHealth: FinancialHealth
  spendingPatterns: SpendingCategory[]
  recommendations: Recommendation[]
  monthlyAnalysis: {
    summary: string
    keyFindings: string[]
    actionItems: string[]
  }
}

export async function generateFinancialInsights(userId: string): Promise<FinancialInsights> {
  try {
    // Fetch user's transactions
    const transactionsRef = collection(db, 'transactions')
    const q = query(
      transactionsRef,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const transactions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Transaction[]

    // Calculate total income and expenses
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    // Calculate current savings
    const currentSavings = totalIncome - totalExpenses

    // Calculate spending by category
    const categoryTotals = new Map<string, number>()
    transactions.forEach(t => {
      if (t.amount < 0 && t.category) {
        categoryTotals.set(
          t.category,
          (categoryTotals.get(t.category) || 0) + Math.abs(t.amount)
        )
      }
    })

    // Generate spending patterns
    const spendingPatterns = Array.from(categoryTotals.entries())
      .map(([category, amount]) => {
        const percentage = (amount / totalExpenses) * 100
        const isAboveNormal = percentage > 33 // Threshold for high spending in a category
        
        return {
          category,
          amount,
          percentage,
          comparison: isAboveNormal ? 'above' : 'within',
          explanation: isAboveNormal
            ? `Your ${category} spending is ${percentage.toFixed(1)}% of total expenses, which is above the recommended range.`
            : `Your ${category} spending is within normal range at ${percentage.toFixed(1)}% of total expenses.`,
          optimizationSteps: isAboveNormal
            ? [
                `Review your ${category} expenses for potential savings`,
                `Compare ${category} costs with alternatives`,
                `Consider setting a budget for ${category}`
              ]
            : [
                `Continue monitoring ${category} expenses`,
                `Look for occasional optimization opportunities`,
                `Set up alerts for unusual spending`
              ]
        }
      })
      .sort((a, b) => b.amount - a.amount)

    // Calculate financial health score
    const healthScore = calculateFinancialHealthScore({
      savingsRate: (currentSavings / totalIncome) * 100,
      expenseRatio: totalExpenses / totalIncome,
      categoryDiversification: categoryTotals.size,
      hasHighSpendingCategories: spendingPatterns.some(p => p.comparison === 'above')
    })

    // Generate recommendations based on spending patterns
    const recommendations = generateRecommendations({
      spendingPatterns,
      healthScore,
      totalIncome,
      totalExpenses,
      currentSavings
    })

    return {
      totalIncome,
      totalExpenses,
      currentSavings,
      financialHealth: {
        score: healthScore,
        explanation: generateHealthExplanation(healthScore),
        improvementSteps: generateImprovementSteps(healthScore, spendingPatterns),
        trends: calculateFinancialTrends(transactions),
        riskFactors: identifyRiskFactors(spendingPatterns, healthScore)
      },
      spendingPatterns,
      recommendations,
      monthlyAnalysis: {
        summary: generateMonthlySummary({
          totalIncome,
          totalExpenses,
          currentSavings,
          spendingPatterns
        }),
        keyFindings: generateKeyFindings({
          totalIncome,
          totalExpenses,
          currentSavings,
          spendingPatterns
        }),
        actionItems: recommendations.slice(0, 3).map(r => r.title)
      }
    }
  } catch (error) {
    console.error('Error generating financial insights:', error)
    // Return safe default values
    return {
      totalIncome: 0,
      totalExpenses: 0,
      currentSavings: 0,
      financialHealth: {
        score: 0,
        explanation: "Unable to calculate financial health at this time.",
        improvementSteps: [],
        trends: [],
        riskFactors: []
      },
      spendingPatterns: [],
      recommendations: [],
      monthlyAnalysis: {
        summary: "Unable to generate monthly analysis at this time.",
        keyFindings: [],
        actionItems: []
      }
    }
  }
}

function calculateFinancialHealthScore({
  savingsRate,
  expenseRatio,
  categoryDiversification,
  hasHighSpendingCategories
}: {
  savingsRate: number
  expenseRatio: number
  categoryDiversification: number
  hasHighSpendingCategories: boolean
}): number {
  let score = 0

  // Savings rate contribution (40% of total score)
  score += Math.min(40, savingsRate * 1.5)

  // Expense ratio contribution (30% of total score)
  score += Math.max(0, 30 * (1 - expenseRatio))

  // Category diversification contribution (20% of total score)
  score += Math.min(20, categoryDiversification * 2)

  // Penalty for high spending categories (10% penalty)
  if (hasHighSpendingCategories) {
    score *= 0.9
  }

  return Math.round(Math.max(0, Math.min(100, score)))
}

function generateHealthExplanation(score: number): string {
  if (score >= 80) {
    return "Your financial health is strong, with a good balance of savings and controlled expenses."
  } else if (score >= 60) {
    return "Your financial health is good, but there's room for improvement in some areas."
  } else if (score >= 40) {
    return "Your financial health needs attention. Focus on building savings and reducing expenses."
  } else {
    return "Your financial health requires immediate attention. Consider professional financial advice."
  }
}

function generateImprovementSteps(score: number, spendingPatterns: SpendingCategory[]): string[] {
  const steps = []

  if (score < 80) {
    const highSpendingCategories = spendingPatterns
      .filter(p => p.comparison === 'above')
      .map(p => p.category)

    if (highSpendingCategories.length > 0) {
      steps.push(`Review spending in ${highSpendingCategories.join(', ')}`)
    }
    steps.push("Build an emergency fund")
    steps.push("Create a monthly budget")
  }

  if (score < 60) {
    steps.push("Track all expenses diligently")
    steps.push("Look for additional income sources")
  }

  if (score < 40) {
    steps.push("Seek professional financial advice")
    steps.push("Focus on debt reduction")
  }

  return steps
}

function calculateFinancialTrends(transactions: Transaction[]): FinancialHealth['trends'] {
  // Implementation of trend calculation
  return []
}

function identifyRiskFactors(
  spendingPatterns: SpendingCategory[],
  healthScore: number
): FinancialHealth['riskFactors'] {
  const riskFactors = []

  // Check for high concentration in specific categories
  const highSpendingCategories = spendingPatterns.filter(p => p.percentage > 33)
  if (highSpendingCategories.length > 0) {
    riskFactors.push({
      factor: "High spending concentration",
      severity: "high",
      mitigation: [
        "Diversify spending across categories",
        "Review and optimize high-spending areas",
        "Set category-specific budgets"
      ]
    })
  }

  // Check overall financial health
  if (healthScore < 50) {
    riskFactors.push({
      factor: "Low financial health score",
      severity: "high",
      mitigation: [
        "Create a comprehensive budget",
        "Build emergency savings",
        "Seek professional financial advice"
      ]
    })
  }

  return riskFactors
}

function generateRecommendations({
  spendingPatterns,
  healthScore,
  totalIncome,
  totalExpenses,
  currentSavings
}: {
  spendingPatterns: SpendingCategory[]
  healthScore: number
  totalIncome: number
  totalExpenses: number
  currentSavings: number
}): Recommendation[] {
  const recommendations: Recommendation[] = []

  // Emergency fund recommendation
  if (currentSavings < totalExpenses * 6) {
    recommendations.push({
      title: "Build Emergency Fund",
      description: "Establish a robust emergency fund to cover unexpected expenses.",
      impact: {
        monthly: Math.min(totalIncome * 0.2, 1000),
        yearly: Math.min(totalIncome * 0.2, 1000) * 12,
        description: "Improved financial security and reduced reliance on credit."
      },
      priority: "high",
      timeframe: "6 months",
      steps: [
        "Set up automatic savings transfers",
        "Cut non-essential expenses",
        "Look for additional income opportunities"
      ],
      expectedOutcome: "6 months of expenses saved for emergencies"
    })
  }

  // Add more recommendations based on spending patterns and health score
  return recommendations
}

function generateMonthlySummary({
  totalIncome,
  totalExpenses,
  currentSavings,
  spendingPatterns
}: {
  totalIncome: number
  totalExpenses: number
  currentSavings: number
  spendingPatterns: SpendingCategory[]
}): string {
  const savingsRate = (currentSavings / totalIncome) * 100
  const highSpendingCategories = spendingPatterns
    .filter(p => p.comparison === 'above')
    .map(p => p.category)

  return `Your monthly savings rate is ${savingsRate.toFixed(1)}%${
    highSpendingCategories.length > 0
      ? ` with potential optimization opportunities in ${highSpendingCategories.join(', ')}`
      : ' with well-balanced spending across categories'
  }.`
}

function generateKeyFindings({
  totalIncome,
  totalExpenses,
  currentSavings,
  spendingPatterns
}: {
  totalIncome: number
  totalExpenses: number
  currentSavings: number
  spendingPatterns: SpendingCategory[]
}): string[] {
  const findings = []

  const savingsRate = (currentSavings / totalIncome) * 100
  findings.push(`Current savings rate: ${savingsRate.toFixed(1)}%`)

  const highSpendingCategories = spendingPatterns.filter(p => p.comparison === 'above')
  if (highSpendingCategories.length > 0) {
    findings.push(
      `High spending identified in: ${highSpendingCategories.map(p => p.category).join(', ')}`
    )
  }

  return findings
} 