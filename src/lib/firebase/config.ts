import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, browserLocalPersistence } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence, doc, onSnapshot } from 'firebase/firestore'
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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)

// Initialize Firestore with persistence options
const db = getFirestore(app)

// Initialize Storage
const storage = getStorage(app)

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Add essential scopes
googleProvider.addScope('email')
googleProvider.addScope('profile')

// Enable offline persistence for Firestore
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db, {
    forceOwnership: true
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.')
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.')
    }
  })

  // Add connection state listener
  const connectedRef = doc(db, '.info/connected')
  onSnapshot(connectedRef, (snap) => {
    if (snap.data()?.connected === false) {
      console.warn('Lost connection to Firestore. Some features may be limited.')
    }
  })
}

// Add auth state persistence
auth.setPersistence(browserLocalPersistence)
  .catch((error) => {
    console.error('Auth persistence error:', error)
  })

// Security rules should be configured in Firebase Console, not in the client code
// Removing client-side security rules as they should be managed in Firebase Console

export { app, auth, db, storage, googleProvider } 