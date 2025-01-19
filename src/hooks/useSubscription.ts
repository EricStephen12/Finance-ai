import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { SubscriptionTier } from '@/lib/services/subscriptionService'

interface UseSubscriptionReturn {
  tier: SubscriptionTier
  loading: boolean
  error: string | null
  checkFeatureAccess: (feature: string) => Promise<boolean>
  upgradePlan: (plan: SubscriptionTier) => Promise<void>
}

export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth()
  const [tier, setTier] = useState<SubscriptionTier>('free')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubscription() {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/subscription?userId=${user.uid}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch subscription')
        }

        setTier(data.tier)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [user?.uid])

  const checkFeatureAccess = async (feature: string): Promise<boolean> => {
    if (!user?.uid) return false

    try {
      const response = await fetch('/api/subscription', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, feature })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check feature access')
      }

      return data.hasAccess
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }

  const upgradePlan = async (plan: SubscriptionTier): Promise<void> => {
    if (!user?.uid) return

    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, plan })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upgrade plan')
      }

      setTier(plan)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    tier,
    loading,
    error,
    checkFeatureAccess,
    upgradePlan
  }
} 