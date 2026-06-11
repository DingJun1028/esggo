import * as admin from 'firebase-admin';

/**
 * Initialize Firebase Admin SDK for server-side operations.
 * Requires FIREBASE_SERVICE_ACCOUNT_KEY environment variable.
 */
export const firebaseAdmin = (() => {
  try {
    if (admin.apps.length > 0) return admin.app();

    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountVar) {
      // Handle both JSON string and base64 encoded JSON
      let serviceAccount;
      try {
        serviceAccount = JSON.parse(serviceAccountVar);
      } catch {
        serviceAccount = JSON.parse(Buffer.from(serviceAccountVar, 'base64').toString());
      }

      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
  }
  return null;
})();

export const adminDb = firebaseAdmin ? firebaseAdmin.firestore() : null;
export const adminAuth = firebaseAdmin ? firebaseAdmin.auth() : null;
export const adminStorage = firebaseAdmin ? firebaseAdmin.storage() : null;

export default firebaseAdmin;
