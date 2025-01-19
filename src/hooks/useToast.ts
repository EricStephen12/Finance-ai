import { useState, useCallback } from 'react'

interface Toast {
  id: number
  title: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface ToastOptions {
  title: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback(({ title, message, type, duration = 3000 }: ToastOptions) => {
    const id = Date.now()
    
    setToasts(prev => [...prev, { id, title, message, type }])

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, duration)
  }, [])

  return {
    toasts,
    showToast
  }
} 