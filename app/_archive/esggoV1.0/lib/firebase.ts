// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getRemoteConfig, fetchAndActivate } from "firebase/remote-config";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi_T2RmomrsqhUNxZ98SzT53ZM7qj4MBw",
  authDomain: "esggo--esg-sunshine.asia-east1.hosted.app",
  projectId: "esg-sunshine",
  storageBucket: "esg-sunshine.firebasestorage.app",
  messagingSenderId: "950159032447",
  appId: "1:950159032447:web:baada36f4b2c3ad3ecff4a"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const remoteConfig = typeof window !== "undefined" ? getRemoteConfig(app) : null;

if (remoteConfig) {
  remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
  remoteConfig.defaultConfig = {
    "gemini_model_flash": "gemini-1.5-flash",
    "gemini_model_pro": "gemini-1.5-pro",
    "gemini_model_lite": "gemini-1.5-flash"
  };
}

// Initialize Analytics conditionally (only in browser)
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
};

// Initialize App Check (only in browser)
if (typeof window !== "undefined") {
  // Use debug token in development to bypass reCAPTCHA Enterprise
  if (process.env.NODE_ENV === 'development') {
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    console.log("🛠️ Firebase App Check Debug Token Enabled");
  }

  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider('6Ldek6osAAAAAOrXT4VChbhORIC_5zUjCaEyHBrt'),
      isTokenAutoRefreshEnabled: true
    });
  } catch (err) {
    console.warn("App Check failed to initialize (continuing without it):", err);
  }
}

import { getFunctions } from "firebase/functions";
const functions = getFunctions(app);

export { app, auth, db, storage, functions, remoteConfig };
