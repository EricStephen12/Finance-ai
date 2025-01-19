'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

const PUBLIC_PATHS = ['/login', '/signup', '/reset-password']

export default function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only redirect for protected routes
    const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/settings') ||
                           pathname.startsWith('/profile')
    
    if (!user && isProtectedRoute && !PUBLIC_PATHS.includes(pathname)) {
      router.push('/login')
      return
    }
  }, [user, pathname, router])

  return <>{children}</>
} 