'use client'

import { useEffect } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import RequireOnboarding from '@/components/auth/RequireOnboarding'
import { Toaster } from '@/components/ui/toaster'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      // You can add error reporting service here
    }

    const handleError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error)
      // You can add error reporting service here
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <AuthProvider>
      <SettingsProvider>
        <RequireOnboarding>
          {children}
        </RequireOnboarding>
        <Toaster />
      </SettingsProvider>
    </AuthProvider>
  )
} 