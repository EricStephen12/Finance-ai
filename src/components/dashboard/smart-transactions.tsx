'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingBagIcon,
  HomeIcon,
  TruckIcon,
  FilmIcon,
  WifiIcon,
  HeartIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface Transaction {
  id: string
  date: string
  merchant: string
  category: string
  amount: number
  type: 'expense' | 'income'
  status: 'completed' | 'pending'
  icon: JSX.Element
}

const categories = {
  'Shopping': ShoppingBagIcon,
  'Housing': HomeIcon,
  'Transport': TruckIcon,
  'Entertainment': FilmIcon,
  'Utilities': WifiIcon,
  'Healthcare': HeartIcon,
  'Income': BanknotesIcon,
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-21',
    merchant: 'Amazon',
    category: 'Shopping',
    amount: 89.99,
    type: 'expense',
    status: 'completed',
    icon: <ShoppingBagIcon className="h-5 w-5" />
  },
  {
    id: '2',
    date: '2024-01-20',
    merchant: 'Salary Deposit',
    category: 'Income',
    amount: 5200.00,
    type: 'income',
    status: 'completed',
    icon: <BanknotesIcon className="h-5 w-5" />
  },
  {
    id: '3',
    date: '2024-01-19',
    merchant: 'Netflix',
    category: 'Entertainment',
    amount: 14.99,
    type: 'expense',
    status: 'completed',
    icon: <FilmIcon className="h-5 w-5" />
  },
  {
    id: '4',
    date: '2024-01-18',
    merchant: 'Uber',
    category: 'Transport',
    amount: 24.50,
    type: 'expense',
    status: 'completed',
    icon: <TruckIcon className="h-5 w-5" />
  },
  {
    id: '5',
    date: '2024-01-17',
    merchant: 'Rent Payment',
    category: 'Housing',
    amount: 1200.00,
    type: 'expense',
    status: 'pending',
    icon: <HomeIcon className="h-5 w-5" />
  }
]

export default function SmartTransactions() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<'all' | 'expense' | 'income'>('all')

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || transaction.category === selectedCategory
    const matchesType = selectedType === 'all' || transaction.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-sm p-6 border border-green-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 font-medium">Money Coming In</p>
              <p className="text-3xl font-bold text-emerald-900 mt-1">
                ${totalIncome.toFixed(2)}
              </p>
              <p className="text-sm text-emerald-600 mt-2 flex items-center">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                Looking good! Keep it up!
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-emerald-200/50 flex items-center justify-center">
              <ArrowUpIcon className="h-7 w-7 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-sm p-6 border border-primary-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700 font-medium">Your Spending</p>
              <p className="text-3xl font-bold text-primary-900 mt-1">
                ${totalExpenses.toFixed(2)}
              </p>
              <p className="text-sm text-primary-600 mt-2 flex items-center">
                <SparklesIcon className="h-4 w-4 mr-1" />
                Let me help you optimize this
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-primary-200/50 flex items-center justify-center">
              <ArrowDownIcon className="h-7 w-7 text-primary-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Let me help you find a transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-primary-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'all' | 'expense' | 'income')}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 text-sm"
            >
              <option value="all">Show me everything</option>
              <option value="expense">Just my spending</option>
              <option value="income">Only my income</option>
            </select>
          </div>

          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 text-sm"
          >
            <option value="">All spending categories</option>
            {Object.keys(categories).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="divide-y divide-gray-100">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    transaction.type === 'income' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-primary-100 text-primary-600'
                  }`}>
                    {transaction.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.merchant}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-primary-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              {transaction.status === 'pending' && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                    <ClockIcon className="h-4 w-4 mr-1.5" />
                    Pending Transaction
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 