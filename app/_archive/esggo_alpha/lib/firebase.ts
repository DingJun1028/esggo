import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';
import { getRemoteConfig, RemoteConfig } from 'firebase/remote-config';
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from 'firebase/analytics';
import { getPerformance, FirebasePerformance } from 'firebase/performance';
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { ENV } from './config/env';
import firebaseConfig from '../firebase-applet-config.json';

// Trusted Types bypass
if (typeof window !== "undefined") {
  const win = window as any;
  if (win.trustedTypes && win.trustedTypes.createPolicy) {
    try {
      if (!win.trustedTypes.defaultPolicy) {
        win.trustedTypes.createPolicy('default', {
          createHTML: (string: string) => string,
          createScriptURL: (string: string) => string,
          createScript: (string: string) => string,
        });
      }
    } catch (e) {
      console.warn("Trusted Types policy creation failed", e);
    }
  }
}

let app: FirebaseApp;
const apps = getApps();

if (apps.length > 0) {
  app = getApp();
} else {
  const dynamicConfig = { ...firebaseConfig };
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && !host.includes('firebaseapp.com') && !host.includes('web.app')) {
      dynamicConfig.authDomain = host;
    }
  }
  app = initializeApp(dynamicConfig);
}

// Singleton instances with lazy initialization or immediate if stable
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);
export const functions: Functions = getFunctions(app);

// Firestore with persistence on client
let dbInstance: Firestore;
const databaseId = ENV.FIRESTORE_DATABASE_ID;

if (typeof window !== 'undefined') {
  try {
    dbInstance = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    }, databaseId);
  } catch {
    // If already initialized, fallback to getFirestore
    dbInstance = getFirestore(app, databaseId);
  }
} else {
  dbInstance = getFirestore(app, databaseId);
}

export const db = dbInstance;

export const remoteConfig: RemoteConfig | null = typeof window !== 'undefined' ? getRemoteConfig(app) : null;

export const analytics: Promise<Analytics | null> = typeof window !== 'undefined' ?
  isAnalyticsSupported().then(supported => supported ? getAnalytics(app) : null) :
  Promise.resolve(null);

export const performance: FirebasePerformance | null = typeof window !== 'undefined' ? getPerformance(app) : null;

export const dataconnect: DataConnect = getDataConnect(app, connectorConfig);

export default app;
