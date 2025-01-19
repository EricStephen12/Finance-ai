export interface FinancialInfo {
  income: {
    salary: number
    investments: number
    other: number
    custom: { [key: string]: number }
  }
  expenses: {
    housing: number
    utilities: number
    transportation: number
    food: number
    healthcare: number
    entertainment: number
    other: number
    custom: { [key: string]: number }
  }
  assets: {
    cash: number
    stocks: number
    bonds: number
    realEstate: number
    retirement: number
    other: number
    custom: { [key: string]: number }
  }
  liabilities: {
    mortgage: number
    carLoan: number
    studentLoans: number
    creditCards: number
    other: number
    custom: { [key: string]: number }
  }
  goals: {
    shortTerm: string[]
    longTerm: string[]
    custom: { [key: string]: string[] }
  }
} 