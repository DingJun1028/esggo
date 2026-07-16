import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

function createPlaceholderApp(): FirebaseApp {
  return initializeApp({ apiKey: 'placeholder', projectId: 'placeholder' });
}

export const app: FirebaseApp = (() => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      if (typeof window !== 'undefined') {
        console.warn('[firebase] NEXT_PUBLIC_FIREBASE_API_KEY missing; using placeholder app');
      }
      return createPlaceholderApp();
    }

    const config = {
      apiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    return getApps().length > 0 ? getApp() : initializeApp(config);
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.warn('[firebase] client init skipped:', error);
    }
    return createPlaceholderApp();
  }
})();

export const db: Firestore = getFirestore(app);
