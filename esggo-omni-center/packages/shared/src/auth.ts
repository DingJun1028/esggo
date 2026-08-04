// ═══════════════════════════════════════════════════════════════
// @esggo/shared/auth — Unified Authentication Module
// Single source for Firebase Auth + token verification
// ═══════════════════════════════════════════════════════════════

import { getConfig } from './config';

// ── Types ──────────────────────────────────────────────────────

export interface AuthUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export interface AuthToken {
  uid: string;
  email?: string;
  firebaseToken: string;
}

// ── Firebase Admin (Server-Side) ───────────────────────────────

let adminApp: unknown = null;
let adminAuth: unknown = null;
let adminDb: unknown = null;

/**
 * Get Firebase Admin App (lazy singleton).
 */
export async function getAdminApp(): Promise<unknown> {
  if (adminApp) return adminApp;

  const config = getConfig();
  if (!config.firebase.serviceAccountJson && !config.firebase.projectId) {
    throw new Error('Firebase Admin not configured: missing FIREBASE_SERVICE_ACCOUNT_JSON');
  }

  try {
    const firebaseAdmin = await import('firebase-admin');

    const app = firebaseAdmin.apps.length > 0
      ? firebaseAdmin.apps[0]
      : firebaseAdmin.initializeApp({
          credential: config.firebase.serviceAccountJson
            ? firebaseAdmin.credential.cert(
                JSON.parse(config.firebase.serviceAccountJson)
              )
            : firebaseAdmin.credential.applicationDefault(),
        });

    adminApp = app;
    adminAuth = firebaseAdmin.auth();
    adminDb = firebaseAdmin.firestore();

    return app;
  } catch (err) {
    throw new Error(`Failed to initialize Firebase Admin: ${err}`);
  }
}

/**
 * Get Firebase Auth instance.
 */
export async function getAdminAuth(): Promise<unknown> {
  await getAdminApp();
  return adminAuth;
}

/**
 * Get Firestore database instance.
 */
export async function getAdminDb(): Promise<unknown> {
  await getAdminApp();
  return adminDb;
}

// ── Token Verification ─────────────────────────────────────────

/**
 * Verify a Firebase ID token.
 * Returns the decoded token or null if invalid.
 */
export async function verifyToken(
  idToken: string
): Promise<{ uid: string; email?: string } | null> {
  try {
    const auth = await getAdminAuth() as {
      verifyIdToken: (token: string) => Promise<{ uid: string; email?: string }>;
    };
    const decoded = await auth.verifyIdToken(idToken);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

/**
 * Verify token from Authorization header.
 * Returns user info or null.
 */
export async function verifyAuthHeader(
  authHeader: string | null
): Promise<{ uid: string; email?: string } | null> {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7);
  return verifyToken(token);
}

// ── Firestore Helpers ──────────────────────────────────────────

export interface FirestoreDoc {
  id: string;
  [key: string]: unknown;
}

/**
 * Get a document from Firestore.
 */
export async function getFirestoreDoc(
  collection: string,
  docId: string
): Promise<FirestoreDoc | null> {
  const db = await getAdminDb() as {
    collection: (name: string) => {
      doc: (id: string) => {
        get: () => Promise<{ exists: boolean; data: () => Record<string, unknown> }>;
      };
    };
  };
  const doc = await db.collection(collection).doc(docId).get();
  if (!doc.exists) return null;
  return { id: docId, ...doc.data() };
}

/**
 * Set a document in Firestore.
 */
export async function setFirestoreDoc(
  collection: string,
  docId: string,
  data: Record<string, unknown>
): Promise<void> {
  const db = await getAdminDb() as {
    collection: (name: string) => {
      doc: (id: string) => {
        set: (data: Record<string, unknown>) => Promise<void>;
      };
    };
  };
  await db.collection(collection).doc(docId).set(data, { merge: true });
}

/**
 * Query Firestore collection.
 */
export async function queryFirestore(
  collection: string,
  field: string,
  operator: string,
  value: unknown
): Promise<FirestoreDoc[]> {
  const db = await getAdminDb() as {
    collection: (name: string) => {
      where: (field: string, op: string, value: unknown) => {
        get: () => Promise<{
          docs: Array<{ id: string; data: () => Record<string, unknown> }>;
        }>;
      };
    };
  };
  const snapshot = await db.collection(collection)
    .where(field, operator, value)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// ── Health Check ───────────────────────────────────────────────

/**
 * Check if Firebase Admin is properly configured.
 */
export function checkFirebaseHealth(): {
  configured: boolean;
  projectId?: string;
} {
  const config = getConfig();
  return {
    configured: !!(config.firebase.serviceAccountJson || config.firebase.projectId),
    projectId: config.firebase.projectId,
  };
}
