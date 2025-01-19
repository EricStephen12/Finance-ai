'use client'

import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { Toast } from '@/types/toast'

interface ToastComponentProps {
  toast: Toast
  onClose: () => void
}

export function ToastComponent({ toast, onClose }: ToastComponentProps) {
  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    error: <XCircleIcon className="h-5 w-5 text-red-500" />,
    warning: <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />,
    info: <InformationCircleIcon className="h-5 w-5 text-blue-500" />
  }

  const colors = {
    success: 'bg-green-50/90 border-green-200/50 shadow-green-100/50',
    error: 'bg-red-50/90 border-red-200/50 shadow-red-100/50',
    warning: 'bg-yellow-50/90 border-yellow-200/50 shadow-yellow-100/50',
    info: 'bg-blue-50/90 border-blue-200/50 shadow-blue-100/50'
  }

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }

  const buttonColors = {
    success: 'hover:bg-green-100/80 focus:ring-green-500',
    error: 'hover:bg-red-100/80 focus:ring-red-500',
    warning: 'hover:bg-yellow-100/80 focus:ring-yellow-500',
    info: 'hover:bg-blue-100/80 focus:ring-blue-500'
  }

  return (
    <div
      className={`rounded-xl border backdrop-blur-sm p-4 shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${colors[toast.type]}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className={`p-1 rounded-full bg-white/80 backdrop-blur-sm shadow-sm ${textColors[toast.type]}`}>
            {icons[toast.type]}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium ${textColors[toast.type]}`}>{toast.title}</h3>
          <div className="mt-1 text-sm text-gray-600">{toast.message}</div>
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-1.5 text-gray-500 transition-colors duration-200 ${buttonColors[toast.type]} focus:outline-none focus:ring-2 focus:ring-offset-1`}
          >
            <span className="sr-only">Dismiss</span>
            <XCircleIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 