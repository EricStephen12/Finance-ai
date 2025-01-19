'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, limit, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'

export interface Transaction {
  id: string
  userId: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface TransactionFilters {
  type?: 'income' | 'expense'
  category?: string
  startDate?: Date
  endDate?: Date
  limit?: number
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { showToast } = useToast()

  // Subscribe to transactions in real-time
  useEffect(() => {
    if (!user) {
      setTransactions([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc'),
      limit(100)
    )

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const updatedTransactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[]
        setTransactions(updatedTransactions)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching transactions:', error)
        showToast({
          title: 'Error',
          message: 'Failed to fetch transactions',
          type: 'error'
        })
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  // Add a new transaction
  const addTransaction = async (data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return

    try {
      const now = Timestamp.now()
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...data,
        userId: user.uid,
        createdAt: now,
        updatedAt: now
      })

      showToast({
        title: 'Success',
        message: 'Transaction added successfully',
        type: 'success'
      })

      return docRef.id
    } catch (error) {
      console.error('Error adding transaction:', error)
      showToast({
        title: 'Error',
        message: 'Failed to add transaction',
        type: 'error'
      })
    }
  }

  // Update an existing transaction
  const updateTransaction = async (id: string, data: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => {
    if (!user) return

    try {
      const docRef = doc(db, 'transactions', id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      })

      showToast({
        title: 'Success',
        message: 'Transaction updated successfully',
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating transaction:', error)
      showToast({
        title: 'Error',
        message: 'Failed to update transaction',
        type: 'error'
      })
    }
  }

  // Delete a transaction
  const deleteTransaction = async (id: string) => {
    if (!user) return

    try {
      await deleteDoc(doc(db, 'transactions', id))
      showToast({
        title: 'Success',
        message: 'Transaction deleted successfully',
        type: 'success'
      })
    } catch (error) {
      console.error('Error deleting transaction:', error)
      showToast({
        title: 'Error',
        message: 'Failed to delete transaction',
        type: 'error'
      })
    }
  }

  // Filter transactions
  const filterTransactions = async (filters: TransactionFilters) => {
    if (!user) return []

    try {
      let q = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid)
      )

      if (filters.type) {
        q = query(q, where('type', '==', filters.type))
      }

      if (filters.category) {
        q = query(q, where('category', '==', filters.category))
      }

      if (filters.startDate) {
        q = query(q, where('date', '>=', Timestamp.fromDate(filters.startDate)))
      }

      if (filters.endDate) {
        q = query(q, where('date', '<=', Timestamp.fromDate(filters.endDate)))
      }

      q = query(q, orderBy('date', 'desc'))

      if (filters.limit) {
        q = query(q, limit(filters.limit))
      }

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[]
    } catch (error) {
      console.error('Error filtering transactions:', error)
      showToast({
        title: 'Error',
        message: 'Failed to filter transactions',
        type: 'error'
      })
      return []
    }
  }

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    filterTransactions
  }
} 