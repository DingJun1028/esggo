/**
 * Firebase Admin SDK — Server-only singleton
 *
 * 使用方式：僅限 API Routes / Server Components 呼叫。
 * 不可在 'use client' 元件中 import。 */

import * as firebaseAdmin from 'firebase-admin';
const admin = firebaseAdmin as any;

function getAdminApp(): any {
  if (typeof admin.getApps === 'function' && admin.getApps().length > 0) {
    return admin.getApps()[0];
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      return admin.initializeApp({
        credential: admin.credential?.cert?.(serviceAccount) ?? admin.applicationDefault(),
        projectId: serviceAccount.project_id,
      });
    } catch (e) {
      console.error('[FirebaseAdmin] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', e);
    }
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const appCred = typeof admin.applicationDefault === 'function'
    ? admin.applicationDefault()
    : admin.credential?.createApplicationDefault?.();
  return admin.initializeApp({ credential: appCred, projectId });
}

export const adminApp = getAdminApp();

/**
 * firebase-admin v14 改了導出結構：
 * - admin.firestore(app) → 改用 require('firebase-admin/firestore').getFirestore(app)
 * 使用 lazy init 避免 build 時期崩潰。
 */
let _db: any = null;

function getDb(): any {
  if (_db) return _db;
  try {
    const firestoreNS = require('firebase-admin/firestore');
    _db = firestoreNS.getFirestore
      ? firestoreNS.getFirestore(adminApp)
      : firestoreNS.firestore?.(adminApp);
  } catch {
    // fallback: firebase-admin/firestore 不存在，直接用 admin 頂級
    try {
      _db = (admin as any).firestore?.(adminApp);
    } catch {
      console.warn('[FirebaseAdmin] Firestore unavailable');
    }
  }
  return _db;
}

export const adminDb = {
  collection: (path: string) => getDb()?.collection(path),
  doc: (path: string) => getDb()?.doc(path),
  runTransaction: (fn: any) => getDb()?.runTransaction(fn),
  batch: () => getDb()?.batch(),
};
 const asyncTasksCol = {
  doc: (id: string) => adminDb.collection('async_tasks').doc(id),
  get: (id: string) => adminDb.collection('async_tasks').doc(id).get(),
  set: (id: string, data: any) => adminDb.collection('async_tasks').doc(id).set(data),
  add: (data: any) => adminDb.collection('async_tasks').add(data),
};
