'use client';

import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type Storage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'fake-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'fake-auth-domain',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'fake-storage-bucket',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-ABCDEF',
};

export const isDemoMode = true;

const app: FirebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export { app };

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: Storage = getStorage(app);

export const initAnalytics = async () => {
  if (firebaseConfig.apiKey === 'fake-api-key' || !firebaseConfig.apiKey) {
    console.warn('Skipping Firebase Analytics: fake API key');
    return null;
  }
  if (typeof window !== 'undefined') {
    const supported = await isSupported();
    return supported ? getAnalytics(app) : null;
  }
  return null;
};

export const initMessaging = async () => {
  if (typeof window !== 'undefined') {
    const { getMessaging, isSupported: isMessagingSupported } = await import('firebase/messaging');
    const supported = await isMessagingSupported();
    return supported ? getMessaging(app) : null;
  }
  return null;
};
