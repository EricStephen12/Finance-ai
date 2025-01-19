'use client'

import { useToast } from '@/hooks/useToast'
import Toast from './Toast'

export default function ToastContainer() {
  const { toasts, showToast } = useToast()

  const handleClose = (id: number) => {
    // The toast will be automatically removed by the useToast hook
    // This is just for immediate visual feedback
    const toastElement = document.getElementById(`toast-${id}`)
    if (toastElement) {
      toastElement.style.opacity = '0'
    }
  }

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className="transition-opacity duration-300 ease-in-out"
          >
            <Toast
              id={toast.id}
              title={toast.title}
              message={toast.message}
              type={toast.type}
              onClose={handleClose}
            />
          </div>
        ))}
      </div>
    </div>
  )
} 