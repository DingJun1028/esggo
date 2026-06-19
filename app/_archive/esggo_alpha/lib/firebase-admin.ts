import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// This singleton pattern prevents multiple initializations during hot reloads in development
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Replace escaped newlines in the private key if provided via env var
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
        console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
        console.error('Firebase Admin initialization error:', error);
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const messaging = admin.messaging();
export const storage = admin.storage();
export const FieldValue = admin.firestore.FieldValue;
export { db as adminDb }; // For compatibility with existing code
