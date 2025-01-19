import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, limit as limitQuery, Timestamp } from 'firebase/firestore'
import { getAuth } from 'firebase-admin/auth'
import '@/lib/firebase/admin' // Initialize Firebase Admin

async function getCurrentUser(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header')
  }

  const token = authHeader.split('Bearer ')[1]
  try {
    const adminAuth = getAuth()
    const decodedToken = await adminAuth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    throw new Error('Invalid authentication token')
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    const { searchParams } = new URL(request.url)
    
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = searchParams.get('limit')

    let q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid)
    )

    if (type) {
      q = query(q, where('type', '==', type))
    }
    if (category) {
      q = query(q, where('category', '==', category))
    }
    if (startDate) {
      q = query(q, where('date', '>=', new Date(startDate)))
    }
    if (endDate) {
      q = query(q, where('date', '<=', new Date(endDate)))
    }

    q = query(q, orderBy('date', 'desc'))
    
    if (limit) {
      q = query(q, limitQuery(parseInt(limit)))
    }

    const querySnapshot = await getDocs(q)
    const transactions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch transactions' },
      { status: 401 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    const data = await request.json()

    if (!data.amount || !data.type || !data.category || !data.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const transactionData = {
      ...data,
      userId: user.uid,
      date: Timestamp.fromDate(new Date(data.date)),
      createdAt: Timestamp.now()
    }

    const docRef = await addDoc(collection(db, 'transactions'), transactionData)
    
    return NextResponse.json({
      id: docRef.id,
      ...transactionData
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create transaction' },
      { status: 401 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    const data = await request.json()
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    const transactionRef = doc(db, 'transactions', data.id)
    const transactionSnap = await getDocs(query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      where('__name__', '==', data.id)
    ))

    if (transactionSnap.empty) {
      return NextResponse.json(
        { error: 'Transaction not found or unauthorized' },
        { status: 404 }
      )
    }

    const updateData = {
      ...data,
      date: data.date ? Timestamp.fromDate(new Date(data.date)) : undefined,
      updatedAt: Timestamp.now()
    }
    delete updateData.id
    delete updateData.userId

    await updateDoc(transactionRef, updateData)
    
    return NextResponse.json({
      id: data.id,
      ...updateData
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update transaction' },
      { status: 401 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    const transactionSnap = await getDocs(query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      where('__name__', '==', id)
    ))

    if (transactionSnap.empty) {
      return NextResponse.json(
        { error: 'Transaction not found or unauthorized' },
        { status: 404 }
      )
    }

    await deleteDoc(doc(db, 'transactions', id))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete transaction' },
      { status: 401 }
    )
  }
} 