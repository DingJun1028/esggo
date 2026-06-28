import { getApps, initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    const serviceAccountKeyStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKeyStr) {
      const serviceAccount = JSON.parse(serviceAccountKeyStr);
      initializeApp({
        credential: cert(serviceAccount)
      });
    } else {
      initializeApp({
        credential: applicationDefault()
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
