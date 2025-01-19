'use client'

import { useState } from 'react'
import { useTransactions, Transaction } from '@/hooks/useTransactions'
import { Dialog } from '@headlessui/react'
import { PlusIcon, PencilIcon, TrashIcon, FunnelIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { Timestamp } from 'firebase/firestore'
import { useSettings } from '@/contexts/SettingsContext'
import { currencies } from '@/constants/currencies'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'

const categories = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Savings',
  'Personal',
  'Entertainment',
  'Other'
]

export default function TransactionsPage() {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const { settings, formatCurrency, convertCurrency, loading: settingsLoading } = useSettings()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Other',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const { user } = useAuth()

  const fetchTransactions = async () => {
    try {
      if (!user) return

      const transactionsRef = collection(db, 'transactions')
      const q = query(
        transactionsRef,
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      )

      const querySnapshot = await getDocs(q)
      const fetchedTransactions = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          // Convert amount to user's preferred currency
          amount: convertCurrency(data.amount, data.currency || 'USD', settings.currency)
        }
      })

      setTransactions(fetchedTransactions)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update the transaction amount display
  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formattedAmount = formatCurrency(Math.abs(amount))
    return type === 'income' ? formattedAmount : `-${formattedAmount}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      type: formData.type as 'income' | 'expense',
        amount: parseFloat(formData.amount),
        category: formData.category,
      description: formData.description,
      date: Timestamp.fromDate(new Date(formData.date))
      }

    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data)
      } else {
        await addTransaction(data)
      }
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving transaction:', error)
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
      date: new Date(transaction.date.toDate()).toISOString().split('T')[0]
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id)
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      category: 'Other',
      description: '',
      date: new Date().toISOString().split('T')[0]
    })
    setEditingTransaction(null)
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || transaction.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const currencySymbol = settings?.currency ? currencies[settings.currency]?.symbol || '$' : '$'

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 rounded-xl overflow-hidden">
          <div className="backdrop-blur-sm bg-black/5 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="max-w-[600px]">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <SparklesIcon className="h-6 w-6" />
                  Your Transaction History
                </h2>
                <p className="text-sm text-primary-100 mt-2">
                  Track and manage your financial activities with smart categorization
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    resetForm()
                    setIsModalOpen(true)
                  }}
                  className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Transaction
                </button>
                <button className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200">
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-primary-100">Total Income</p>
                  <div className="p-2 rounded-lg bg-white/10">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center text-sm text-emerald-400">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    +{((totalIncome / (totalIncome + totalExpenses || 1)) * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs text-primary-200">Total incoming funds</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-primary-100">Total Expenses</p>
                  <div className="p-2 rounded-lg bg-white/10">
                    <ArrowTrendingDownIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center text-sm text-red-400">
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                    -{((totalExpenses / (totalIncome + totalExpenses || 1)) * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs text-primary-200">Total outgoing funds</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-primary-100">Net Balance</p>
                  <div className="p-2 rounded-lg bg-white/10">
                    <SparklesIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalIncome - totalExpenses)}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`inline-flex items-center text-sm ${
                    totalIncome > totalExpenses ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {totalIncome > totalExpenses ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {totalIncome > totalExpenses ? 'Surplus' : 'Deficit'}
                  </span>
                  <span className="text-xs text-primary-200">Net financial position</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FunnelIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-12 pr-10 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm min-w-[180px]"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <span className="text-sm text-gray-500">{filteredTransactions.length} transactions</span>
            </div>

            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-100 hover:bg-primary-50/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      transaction.type === 'income' 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowTrendingUpIcon className="h-5 w-5" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.category} • {new Date(transaction.date.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className={`text-lg font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No transactions found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Transaction Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-auto p-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
              {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                  className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent p-2.5"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({currencySymbol})</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent p-2.5"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent p-2.5"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingTransaction ? 'Update' : 'Add'} Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  )
} 