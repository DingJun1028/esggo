import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'fake-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'fake-auth-domain',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'fake-storage-bucket',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-ABCDEF'
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize free Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Data Connect (Optional based on generated code)
let dataConnect: any = null;
try {
  const { getDataConnect, connectDataConnectEmulator } = require("firebase/data-connect");
  const { connectorConfig } = require("@dataconnect/generated");
  if (connectorConfig) {
    dataConnect = getDataConnect(connectorConfig);
    
    // Connect to emulator if host is provided
    if (process.env.NEXT_PUBLIC_FIREBASE_DATACONNECT_EMULATOR_HOST) {
      const [host, port] = process.env.NEXT_PUBLIC_FIREBASE_DATACONNECT_EMULATOR_HOST.split(':');
      connectDataConnectEmulator(dataConnect, host, parseInt(port));
      console.log(`Firebase Data Connect: Connected to emulator at ${host}:${port}`);
    }
  }
} catch (e) {
  // Data Connect not yet generated or supported
  console.log("Firebase Data Connect not initialized: Code not yet generated.");
}

export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    try {
      const supported = await isSupported();
      if (supported) {
        return getAnalytics(app);
      }
    } catch (e) {
      console.warn("Firebase Analytics is not supported or failed to initialize", e);
    }
  }
  return null;
};

export const initMessaging = async () => {
  if (typeof window !== "undefined") {
    try {
      const { getMessaging, isSupported: isMessagingSupported } = await import("firebase/messaging");
      const supported = await isMessagingSupported();
      if (supported) {
        return getMessaging(app);
      }
    } catch (e) {
      console.warn("Firebase Messaging is not supported or failed to initialize", e);
    }
  }
  return null;
};

export { app, db, auth, storage, dataConnect };
