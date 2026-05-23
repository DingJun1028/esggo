import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDi_T2RmomrsqhUNxZ98SzT53ZM7qj4MBw",
  authDomain: "esg-sunshine.firebaseapp.com",
  projectId: "esg-sunshine",
  storageBucket: "esg-sunshine.firebasestorage.app",
  messagingSenderId: "950159032447",
  appId: "1:950159032447:web:4de385b8d181ad4aecff4a",
  measurementId: "G-TYQTK80K6S"
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

export { app };
