/**
 * 🔐 Auth Context
 * --------------------------------------------------
 * Provides global authentication state using Firebase Auth.
 * Syncs with Firestore User Profile via UserService.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { UserService, UserProfile } from '../services/UserService';
import { omniLogger, LogCategory } from '../services/omniLogger';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDeveloper: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isMaintenanceMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Safety timeout: If Firebase doesn't respond in 3s, force loading false
    const safetyTimer = setTimeout(() => {
      if (mounted && loading) {
        console.warn('[AuthContext] Firebase auth timeout - forcing app load');
        setLoading(false);
      }
    }, 3000);

    // Listen for Firebase Auth state changes
    if (!auth) {
      console.warn('[AuthContext] Firebase Auth not initialized - skipping listener');
      setLoading(false);
      return () => { };
    }

    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      clearTimeout(safetyTimer);
      if (!mounted) return;

      setUser(currentUser);

      if (currentUser) {
        try {
          // Sync profile with Firestore
          const userProfile = await UserService.syncUserProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
          });
          if (mounted) setProfile(userProfile);
        } catch (error) {
          omniLogger.error(LogCategory.SYSTEM, 'Failed to sync user profile', { error });
        }
      } else {
        if (mounted) setProfile(null);
      }

      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      omniLogger.info(LogCategory.SYSTEM, '✅ User Logged In via Google');
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Login Failed', { error });
      throw error;
    }
  };

  const loginAsDeveloper = async () => {
    try {
      const devUser = {
        uid: 'dingjun-admin-001',
        email: 'dingjun@esgss.com',
        displayName: 'DingJun (主祭)',
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => { },
        getIdToken: async () => 'dev-token',
        getIdTokenResult: async () => ({
          token: 'dev-token',
          signInProvider: 'developer',
          claims: {},
          authTime: Date.now().toString(),
          issuedAtTime: Date.now().toString(),
          expirationTime: (Date.now() + 3600000).toString(),
        }),
        reload: async () => { },
        toJSON: () => ({}),
        phoneNumber: null,
        photoURL: null,
      } as unknown as User;

      setUser(devUser);

      const userProfile = await UserService.syncUserProfile({
        uid: devUser.uid,
        email: devUser.email,
        displayName: devUser.displayName,
      });
      // Force Omni Avatar Tier for Developer
      userProfile.subscriptionTier = 'OMNI_AVATAR';
      setProfile(userProfile);

      omniLogger.info(LogCategory.SYSTEM, '🔧 User Logged In via Developer Mode');
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Developer Login Failed', { error });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
      omniLogger.info(LogCategory.SYSTEM, '👋 User Logged Out');
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Logout Failed', { error });
    }
  };

  const isAuthenticated = !!user;
  const isMaintenanceMode = false; // Default to false for now, can be connected to config later

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated,
        isMaintenanceMode,
        loginWithGoogle,
        loginAsDeveloper,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
