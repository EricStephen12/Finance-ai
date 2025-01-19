import { NextResponse } from 'next/server'
import { createUserProfile, getUserProfile, updateUserProfile } from '@/lib/services/userService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const profile = await getUserProfile(userId)
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error getting user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { uid, email, displayName } = body

    if (!uid || !email) {
      return NextResponse.json({ error: 'User ID and email are required' }, { status: 400 })
    }

    await createUserProfile(uid, email, displayName)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { userId, data } = body

    if (!userId || !data) {
      return NextResponse.json({ error: 'User ID and update data are required' }, { status: 400 })
    }

    await updateUserProfile(userId, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 