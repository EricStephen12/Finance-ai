'use client'

import { useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastComponent } from '@/components/Toast'
import type { Toast, ToastOptions } from '@/types/toast'

let toastContainer: HTMLDivElement | null = null

if (typeof window !== 'undefined') {
  toastContainer = document.getElementById('toast-container') as HTMLDivElement
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2'
    document.body.appendChild(toastContainer)
  }
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback(({ title, message, type, duration = 5000 }: ToastOptions) => {
    if (!toastContainer) return

    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, title, message, type }

    const toastRoot = document.createElement('div')
    toastContainer.appendChild(toastRoot)
    const root = createRoot(toastRoot)

    const removeToast = () => {
      root.unmount()
      toastRoot.remove()
      setToasts(current => current.filter(t => t.id !== id))
    }

    root.render(<ToastComponent toast={toast} onClose={removeToast} />)
    setToasts(current => [...current, toast])

    if (duration > 0) {
      setTimeout(removeToast, duration)
    }
  }, [])

  return { showToast }
} 