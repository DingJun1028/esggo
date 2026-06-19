/**
 * 🔒 Firebase Configuration & Initialization
 * --------------------------------------------------
 * Centralized Firebase instance management.
 * Reads from environment variables (VITE_FIREBASE_...).
 */
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { omniLogger, LogCategory } from './omniLogger.js';

// 1. Config Object (Safe Fallback)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'localhost',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'esgss-omni-system',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 2. Singleton Initialization
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    omniLogger.info(LogCategory.SYSTEM, '🔥 Firebase App Initialized', {
      projectId: firebaseConfig.projectId,
    });
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  db = getFirestore(app);

  // 3. Environment Handling (Dev/Prod)
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
    omniLogger.info(LogCategory.SYSTEM, '🔧 Connecting to Firebase Emulators');
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
} catch (error) {
  omniLogger.error(LogCategory.SYSTEM, '❌ Firebase Initialization Failed', { error });
  // Do not throw; allowed the app to load with degraded functionality
}

export { app, auth, db };
