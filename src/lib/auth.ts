/**
 * Firebase Authentication utilities with best practices.
 * - TypeScript types
 * - Error handling
 * - Auth state persistence
 * - Context provider for React
 */
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { useEffect, useState, useContext, ReactNode } from "react";

/* ---------- Firebase Config ---------- */
// Replace with your actual Firebase config (kept here for reference only)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

/* ---------- Firebase Initialization ---------- */
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/* ---------- Auth Context ---------- */
interface AuthContextProps {
  user: firebase.User | null;
  loading: boolean;
  error: Error | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  signIn: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  sendPasswordReset: (email: string) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  signUp: async () => {},
  signIn: async () => {},
  sendPasswordReset: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * React Context Provider for Firebase Authentication.
 * Handles auth state changes, loading flags, and error propagation.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    setError(null);
    return () => unsubscribe();
  }, []);

  // Sign in with Google (popup)
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      throw new Error(`Google Sign-In failed: ${err.code}: ${err.message}`);
    }
  }

  // Sign out
  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      throw new Error(`Sign out failed: ${err.code}: ${err.message}`);
    }
  }

  // Email/password sign up
  const signUp = async (email: string, password: string) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      throw new Error(`Sign up failed: ${err.code}: ${err.message}`);
    }
  }

  // Email/password sign in
  const signIn = async (email: string, password: string) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      throw new Error(`Sign in failed: ${err.code}: ${err.message}`);
    }
  }

  // Send password reset email
  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      throw new Error(`Password reset failed: ${err.code}: ${err.message}`);
    }
  }

  // Provide context value
  const value: AuthContextProps = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOutUser,
    signUp,
    signIn,
    sendPasswordReset,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* ---------- Auth Hook ---------- */
/**
 * Custom hook for consuming the Auth context.
 * - Automatically unsubscribes on unmount.
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};