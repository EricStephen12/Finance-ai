import { NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { initAdmin } from '@/lib/firebase/admin'

// Initialize Firebase Admin
initAdmin()

// Helper function to verify auth token
async function verifyToken(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No token provided')
  }

  const token = authHeader.split('Bearer ')[1]
  return getAuth().verifyIdToken(token)
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const decodedToken = await verifyToken(authHeader)
    const uid = decodedToken.uid

    const db = getFirestore()
    const userDoc = await db.collection('users').doc(uid).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(userDoc.data())
  } catch (error) {
    console.error('Error getting profile:', error)
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: error instanceof Error && error.message === 'No token provided' ? 401 : 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const decodedToken = await verifyToken(authHeader)
    const uid = decodedToken.uid

    const updatedProfile = await request.json()
    const db = getFirestore()
    
    await db.collection('users').doc(uid).set(updatedProfile, { merge: true })

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: error instanceof Error && error.message === 'No token provided' ? 401 : 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const decodedToken = await verifyToken(authHeader)
    const uid = decodedToken.uid

    const updates = await request.json()
    const db = getFirestore()
    
    await db.collection('users').doc(uid).update(updates)

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: error instanceof Error && error.message === 'No token provided' ? 401 : 500 }
    )
  }
} 