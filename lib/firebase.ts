'use client';

import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export { app };

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const db = require('firebase/firestore').getFirestore(app);
export const auth = getAuth(app);
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const storage = require('firebase/storage').getStorage(app);
export const dataConnect = null;

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
