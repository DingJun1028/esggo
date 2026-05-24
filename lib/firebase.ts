import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi_T2RmomrsqhUNxZ98SzT53ZM7qj4MBw",
  authDomain: "esg-sunshine.firebaseapp.com",
  projectId: "esg-sunshine",
  storageBucket: "esg-sunshine.firebasestorage.app",
  messagingSenderId: "950159032447",
  appId: "1:950159032447:web:4168bcdb81a10a3eecff4a",
  measurementId: "G-8D32BP5P40"
};

// Initialize Firebase
// Use getApps() to check if app is already initialized to prevent errors during HMR
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics conditionally (only works in browser)
export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};

// Initialize free Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
