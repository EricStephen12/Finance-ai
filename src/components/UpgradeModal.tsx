import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useSubscription } from '@/hooks/useSubscription'
import { useToast } from '@/hooks/useToast'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  feature?: string
  message?: string
}

const proFeatures = [
  'Advanced Analytics',
  'Unlimited Transactions',
  'Custom Categories',
  'Priority Support',
  'Data Export',
  'Goal Setting',
  'Budget Planning'
]

export default function UpgradeModal({ isOpen, onClose, feature, message }: UpgradeModalProps) {
  const { upgradePlan } = useSubscription()
  const { showToast } = useToast()

  const handleUpgrade = async () => {
    try {
      await upgradePlan('pro')
      showToast({
        title: 'Subscription upgraded!',
        message: 'You now have access to Pro features',
        type: 'success'
      })
      onClose()
    } catch (error) {
      showToast({
        title: 'Upgrade failed',
        message: error instanceof Error ? error.message : 'Failed to upgrade subscription',
        type: 'error'
      })
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-8 border border-gray-200/50">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 ring-8 ring-primary-100">
                    <SparklesIcon className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <div className="mt-4 text-center">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                      Upgrade to Pro
                    </Dialog.Title>
                    <p className="mt-3 text-sm text-gray-500">
                      {message || 'Get access to advanced features and unlock the full potential of your financial management'}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="rounded-xl border-2 border-primary-500/20 bg-gradient-to-b from-primary-50 to-white p-8">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">Pro Plan</h4>
                        <p className="mt-1 text-sm text-gray-500">Enhanced features for serious users</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-gray-900">$9.99</span>
                        <span className="text-gray-500">/month</span>
                      </div>
                    </div>
                    <ul className="mt-8 space-y-4">
                      {proFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="rounded-full bg-primary-100 p-1">
                            <CheckIcon className="h-4 w-4 text-primary-600 flex-shrink-0" />
                          </div>
                          <span className="ml-3 text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={handleUpgrade}
                      className="mt-8 block w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:from-primary-500 hover:to-primary-400 hover:shadow-xl hover:shadow-primary-500/30 active:shadow-md transition-all duration-200"
                    >
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 