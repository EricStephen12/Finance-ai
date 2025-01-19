import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  getSubscription,
  canAccessFeature,
  getUpgradeMessage,
  type SubscriptionTier,
  type SubscriptionFeatures
} from '@/lib/services/subscriptionService'

interface UseSubscriptionFeaturesReturn {
  tier: SubscriptionTier
  isLoading: boolean
  canAccess: (feature: keyof SubscriptionFeatures) => boolean | number
  getUpgradeMessageForFeature: (feature: keyof SubscriptionFeatures) => string
  showUpgradeModal: boolean
  setShowUpgradeModal: (show: boolean) => void
}

export function useSubscriptionFeatures(): UseSubscriptionFeaturesReturn {
  const { user } = useAuth()
  const [tier, setTier] = useState<SubscriptionTier>('free')
  const [isLoading, setIsLoading] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    async function loadSubscription() {
      if (user?.uid) {
        try {
          const subscription = await getSubscription(user.uid)
          setTier(subscription?.tier || 'free')
        } catch (error) {
          console.error('Error loading subscription:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadSubscription()
  }, [user?.uid])

  const canAccess = (feature: keyof SubscriptionFeatures): boolean | number => {
    return canAccessFeature(tier, feature)
  }

  const getUpgradeMessageForFeature = (feature: keyof SubscriptionFeatures): string => {
    return getUpgradeMessage(feature)
  }

  return {
    tier,
    isLoading,
    canAccess,
    getUpgradeMessageForFeature,
    showUpgradeModal,
    setShowUpgradeModal
  }
} 