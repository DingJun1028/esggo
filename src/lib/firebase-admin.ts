import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  // Try to initialize from env variable (typically in serverless environments)
  // For local development, you might need to set FIREBASE_SERVICE_ACCOUNT_KEY env var
  try {
    const serviceAccountKeyStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKeyStr) {
      const serviceAccount = JSON.parse(serviceAccountKeyStr);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // Fallback to application default credentials
      admin.initializeApp({
          credential: admin.credential.applicationDefault()
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
