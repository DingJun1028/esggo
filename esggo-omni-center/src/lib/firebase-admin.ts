/**
 * Firebase Admin SDK — Server-only singleton (lazy init)
 *
 * 使用方式：僅限 API Routes / Server Components 呼叫。
 * 不可在 'use client' 元件中 import。
 *
 * firebase-admin v14 API：apps→getApps(), credential.applicationDefault(),
 * firestore 改用 require('firebase-admin/firestore').getFirestore(app)。
 */

import * as firebaseAdmin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import type { App } from 'firebase-admin/app';

// Firebase Admin namespace export can be awkwardly typed; use a narrower cast
const admin = firebaseAdmin as typeof firebaseAdmin & Record<string, unknown>;

let _app: App | null = null;
let _db: ReturnType<typeof import('firebase-admin/firestore').getFirestore> | null = null;

function initAdminApp(): App {
  if (typeof admin.getApps === 'function' && admin.getApps().length > 0) {
    return admin.getApps()[0];
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      return admin.initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
    } catch (e) {
      console.error('[FirebaseAdmin] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', e);
    }
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const appCred = cert(serviceAccountJson ? JSON.parse(serviceAccountJson) : undefined);
  return admin.initializeApp({ credential: appCred, projectId });
}

export function getAdminApp(): App {
  if (_app) return _app;
  _app = initAdminApp();
  return _app;
}

function getDb(): ReturnType<typeof import('firebase-admin/firestore').getFirestore> | null {
  if (_db) return _db;
  try {
    const firestoreNS = require('firebase-admin/firestore');
    _db = firestoreNS.getFirestore
      ? firestoreNS.getFirestore(getAdminApp())
      : firestoreNS.firestore?.(getAdminApp());
  } catch {
    try {
      const firestoreFn = (admin as Record<string, unknown>)['firestore'] as ((app: App) => unknown) | undefined;
      _db = firestoreFn?.(getAdminApp()) as ReturnType<typeof import('firebase-admin/firestore').getFirestore> | null;
    } catch {
      console.warn('[FirebaseAdmin] Firestore unavailable');
    }
  }
  return _db;
}

export const adminDb = {
  collection: (path: string) => getDb()?.collection(path),
  doc: (path: string) => getDb()?.doc(path),
  runTransaction: <T>(fn: (transaction: import('firebase-admin/firestore').Transaction) => Promise<T>) =>
    getDb()?.runTransaction(fn) as Promise<T> | undefined,
  batch: () => getDb()?.batch(),
};
