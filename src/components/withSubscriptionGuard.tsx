import { ComponentType } from 'react'
import { useSubscriptionFeatures } from '@/hooks/useSubscriptionFeatures'
import UpgradeModal from './UpgradeModal'
import { type FeatureAccess } from '@/lib/services/subscriptionService'

interface WithSubscriptionGuardProps {
  requiredFeature: keyof FeatureAccess
}

export function withSubscriptionGuard<P extends object>(
  WrappedComponent: ComponentType<P>,
  { requiredFeature }: WithSubscriptionGuardProps
) {
  return function SubscriptionGuardComponent(props: P) {
    const { 
      canAccess, 
      getUpgradeMessageForFeature,
      showUpgradeModal,
      setShowUpgradeModal
    } = useSubscriptionFeatures()

    const hasAccess = canAccess(requiredFeature)

    if (!hasAccess) {
      return (
        <>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Premium Feature
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {getUpgradeMessageForFeature(requiredFeature)}
              </p>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Upgrade Now
              </button>
            </div>
          </div>

          <UpgradeModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            feature={requiredFeature}
            message={getUpgradeMessageForFeature(requiredFeature)}
          />
        </>
      )
    }

    return <WrappedComponent {...props} />
  }
} 