import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth'
import { getFirestore, initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Initialize Auth with persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting auth persistence:', error)
  })

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Add essential scopes
googleProvider.addScope('email')
googleProvider.addScope('profile')

// Initialize Firestore with persistence
initializeFirestore(app, {
  cache: {
    persistenceEnabled: true,
    cacheSizeBytes: 100 * 1024 * 1024 // 100 MB
  }
})

// Enable offline persistence
if (typeof window !== 'undefined') {
  try {
    const { enableIndexedDbPersistence } = require('firebase/firestore')
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.')
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.')
      }
    })
  } catch (error) {
    console.warn('Error enabling persistence:', error)
  }
}

// Configure security rules
const securityRules = {
  rules_version: '2',
  service: 'cloud.firestore',
  match: {
    '/databases/{database}/documents': {
      match: '/users/{userId}': {
        allow read, write: 'if request.auth != null && request.auth.uid == userId'
      },
      match: '/transactions/{transactionId}': {
        allow read, write: 'if request.auth != null && resource.data.userId == request.auth.uid'
      },
      match: '/scheduled_payments/{paymentId}': {
        allow read, write: 'if request.auth != null && resource.data.userId == request.auth.uid'
      },
      match: '/settings/{userId}': {
        allow read, write: 'if request.auth != null && request.auth.uid == userId'
      }
    }
  }
}

export { app, auth, db, storage, securityRules } 