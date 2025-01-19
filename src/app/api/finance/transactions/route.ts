import { NextResponse } from 'next/server'
import { auth, db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, limit } from 'firebase/firestore'
import { signInWithCustomToken } from 'firebase/auth'

async function getCurrentUser(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.split('Bearer ')[1]
    const userCredential = await signInWithCustomToken(auth, token)
    return userCredential.user
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limitParam = parseInt(searchParams.get('limit') || '50')

    let q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc'),
      limit(limitParam)
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

    const snapshot = await getDocs(q)
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, type, category, description, date, merchant } = body

    if (!amount || !type || !category || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const transaction = {
      userId: user.uid,
      amount: parseFloat(amount),
      type,
      category,
      description,
      date: date ? new Date(date) : new Date(),
      merchant,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(db, 'transactions'), transaction)
    return NextResponse.json({ id: docRef.id, ...transaction })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const transactionRef = doc(db, 'transactions', id)
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

    await updateDoc(transactionRef, {
      ...updateData,
      updatedAt: new Date()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership
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
    console.error('Error deleting transaction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 