import { db } from '@/lib/firebase/config'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export type SubscriptionTier = 'free' | 'pro'

interface SubscriptionFeatures {
  analytics: 'basic' | 'advanced'
  transactions: number
  customCategories: boolean
  support: 'standard' | 'priority'
  dataExport: boolean
  goalSetting: boolean
  budgetPlanning: boolean
  monthlyReports: boolean
  mobileAccess: boolean
}

const subscriptionFeatures: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    analytics: 'basic',
    transactions: 50,
    customCategories: false,
    support: 'standard',
    dataExport: false,
    goalSetting: false,
    budgetPlanning: false,
    monthlyReports: true,
    mobileAccess: true
  },
  pro: {
    analytics: 'advanced',
    transactions: 1000,
    customCategories: true,
    support: 'priority',
    dataExport: true,
    goalSetting: true,
    budgetPlanning: true,
    monthlyReports: true,
    mobileAccess: true
  }
}

export interface Subscription {
  id: string
  userId: string
  tier: SubscriptionTier
  status: 'active' | 'canceled'
  currentPeriodEnd: string
  price: number
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userId)
    const subscriptionSnap = await getDoc(subscriptionRef)

    if (subscriptionSnap.exists()) {
      return subscriptionSnap.data() as Subscription
    }

    // Create a free subscription if none exists
    const freeSubscription: Subscription = {
      id: `sub_${Date.now()}`,
      userId,
      tier: 'free',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      price: 0
    }

    await setDoc(subscriptionRef, freeSubscription)
    return freeSubscription
  } catch (error) {
    console.error('Error getting subscription:', error)
    throw new Error('Failed to get subscription')
  }
}

export async function upgradeToPro(userId: string): Promise<void> {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userId)
    await setDoc(subscriptionRef, {
      tier: 'pro',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      price: 9.99
    }, { merge: true })
  } catch (error) {
    console.error('Error upgrading subscription:', error)
    throw new Error('Failed to upgrade subscription')
  }
}

export function getFeatures(tier: SubscriptionTier): SubscriptionFeatures {
  return subscriptionFeatures[tier]
}

export function canAccessFeature(tier: SubscriptionTier, feature: keyof SubscriptionFeatures): boolean | string | number {
  return subscriptionFeatures[tier][feature]
}

export function getUpgradeMessage(feature: keyof SubscriptionFeatures): string {
  const messages: Record<keyof SubscriptionFeatures, string> = {
    analytics: 'Upgrade to Pro for advanced analytics',
    transactions: 'Upgrade to Pro for up to 1000 transactions',
    customCategories: 'Upgrade to Pro to create custom categories',
    support: 'Upgrade to Pro for priority support',
    dataExport: 'Upgrade to Pro to export your data',
    goalSetting: 'Upgrade to Pro to set and track financial goals',
    budgetPlanning: 'Upgrade to Pro for advanced budget planning',
    monthlyReports: 'Monthly reports included in all plans',
    mobileAccess: 'Mobile access included in all plans'
  }
  return messages[feature]
}

export function getPricing(): { free: number; pro: number } {
  return {
    free: 0,
    pro: 9.99
  }
}

export function getFeaturesList(tier: SubscriptionTier): string[] {
  if (tier === 'free') {
    return [
      'Basic Analytics',
      'Transaction Tracking',
      'Monthly Reports',
      'Standard Support',
      'Mobile App Access'
    ]
  }
  return [
    'Advanced Analytics',
    'Unlimited Transactions',
    'Custom Categories',
    'Priority Support',
    'Data Export',
    'Goal Setting',
    'Budget Planning'
  ]
} 