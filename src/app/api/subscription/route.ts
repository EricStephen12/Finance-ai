import { NextResponse } from 'next/server'
import { getUserSubscriptionTier, checkFeatureAccessForUser } from '@/lib/services/subscriptionService'
import { createUserProfile, updateUserSubscription } from '@/lib/services/userService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const tier = await getUserSubscriptionTier(userId)
    return NextResponse.json({ tier })
  } catch (error) {
    console.error('Error getting subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, plan } = body

    if (!userId || !plan) {
      return NextResponse.json({ error: 'User ID and plan are required' }, { status: 400 })
    }

    // Update user subscription
    await updateUserSubscription(userId, {
      plan: plan as 'free' | 'pro' | 'business',
      status: 'active',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { userId, feature } = body

    if (!userId || !feature) {
      return NextResponse.json({ error: 'User ID and feature are required' }, { status: 400 })
    }

    const hasAccess = await checkFeatureAccessForUser(userId, feature)
    return NextResponse.json({ hasAccess })
  } catch (error) {
    console.error('Error checking feature access:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 