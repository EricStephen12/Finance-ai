'use client'

import { useState, useCallback } from 'react'
import { useToast } from './useToast'

interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  date: Date
  merchant?: string
}

interface TransactionFilters {
  type?: 'income' | 'expense'
  category?: string
  startDate?: Date
  endDate?: Date
  limit?: number
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const fetchTransactions = useCallback(async (filters?: TransactionFilters) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters?.type) queryParams.append('type', filters.type)
      if (filters?.category) queryParams.append('category', filters.category)
      if (filters?.startDate) queryParams.append('startDate', filters.startDate.toISOString())
      if (filters?.endDate) queryParams.append('endDate', filters.endDate.toISOString())
      if (filters?.limit) queryParams.append('limit', filters.limit.toString())

      const response = await fetch(`/api/finance/transactions?${queryParams}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transactions')
      }

      setTransactions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      showToast({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to fetch transactions',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/finance/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add transaction')
      }

      setTransactions(current => [data, ...current])
      showToast({
        title: 'Success',
        message: 'Transaction added successfully',
        type: 'success'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      showToast({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to add transaction',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/finance/transactions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update transaction')
      }

      setTransactions(current =>
        current.map(t => (t.id === id ? { ...t, ...updates } : t))
      )
      showToast({
        title: 'Success',
        message: 'Transaction updated successfully',
        type: 'success'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      showToast({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to update transaction',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/finance/transactions?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete transaction')
      }

      setTransactions(current => current.filter(t => t.id !== id))
      showToast({
        title: 'Success',
        message: 'Transaction deleted successfully',
        type: 'success'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      showToast({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to delete transaction',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [showToast])

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  }
} 