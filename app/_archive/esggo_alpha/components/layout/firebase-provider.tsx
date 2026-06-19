'use client';

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  User,
  setPersistence,
  browserLocalPersistence,
  updateProfile
} from 'firebase/auth';
import { doc, getDocFromServer, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, FirebaseStorage, deleteObject } from 'firebase/storage';
import { httpsCallable, Functions } from 'firebase/functions';
import { fetchAndActivate, getValue, RemoteConfig } from 'firebase/remote-config';
import { Analytics } from 'firebase/analytics';
import { FirebasePerformance } from 'firebase/performance';
import { DataConnect } from 'firebase/data-connect';
import { db, auth, storage, functions, remoteConfig, analytics, performance, dataconnect } from '@/lib/firebase';
import { GcpService } from '@/lib/gcp';
import { Shield, LogIn, LogOut, Loader2, WifiOff, AlertCircle, CloudUpload } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isOnline: boolean;
  storage: FirebaseStorage;
  functions: Functions;
  remoteConfig: RemoteConfig | null;
  analytics: Promise<Analytics | null>;
  performance: FirebasePerformance | null;
  uploadFile: (path: string, file: File) => Promise<string>;
  deleteFile: (url: string) => Promise<void>;
  profileData: any;
  callFn: <T = any, R = any>(name: string, data?: T) => Promise<R>;
  gcp: typeof GcpService;
  dataconnect: DataConnect;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useFirebase must be used within FirebaseProvider');
  return context;
};

export const useAuth = () => {
  const { user, profileData, loading, login, logout, isOnline } = useFirebase();
  return { user, profileData, loading, login, logout, isOnline };
};

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // 1. Service Worker Cleanup (Fix for rogue sw.js crashes)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          console.log('Firebase: Purging Service Worker:', registration.active?.scriptURL);
          registration.unregister().then(success => {
            if (success) console.log('Firebase: SW Unregistered successfully');
          });
        }
      });
    }
  }, []);

  // 2. Auth Lifecycle Management
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      console.log('Firebase: Initializing Auth System...');
      try {
        await setPersistence(auth, browserLocalPersistence);

        console.log('Firebase: Checking for existing redirect result...');
        const result = await getRedirectResult(auth);

        if (result?.user && isMounted) {
          console.log('Firebase: Successfully recovered user from redirect:', result.user.email);
          setUser(result.user);
          setLoading(false);
          return;
        }
      } catch (error: any) {
        console.error('Firebase: Auth recovery failed:', error);
        if (isMounted) {
          if (error.code === 'auth/unauthorized-domain') {
            setAuthError(`網域未授權: ${window.location.hostname}`);
          } else {
            setAuthError(`登入狀態異常: ${error.message}`);
          }
        }
      }

      // If we reach here, no redirect result was found or it failed
      // onAuthStateChanged will handle the rest
    };

    initAuth();

    /**
     * ZXP-Auth Sync: Ensures every logged-in user has a profile document in Firestore
     * This is critical for personalized data management and audit trails.
     */
    const syncUserProfile = async (firebaseUser: User) => {
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          lastLogin: serverTimestamp(),
          role: 'ADMIN_PREVIEW' // Default role for Alpha
        }, { merge: true });
        console.log('Firebase: User profile synced to Firestore');
      } catch (error) {
        console.error('Firebase: Failed to sync user profile:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth,
      (user) => {
        if (!isMounted) return;
        console.log('Firebase: Auth state update:', user?.email || 'Guest');
        setUser(user);
        setLoading(false);

        if (user) {
          syncUserProfile(user);
          // Listen to profile data from Firestore
          const profileDoc = doc(db, 'users', user.uid);
          const unsubProfile = onSnapshot(profileDoc,
            (snapshot) => {
              if (snapshot.exists()) {
                setProfileData(snapshot.data());
              }
            },
            (err) => {
              console.error('Firebase: Profile listener failed:', err);
              // Don't crash the context
            }
          );

          // Simple connection ping
          getDocFromServer(doc(db, '_connection_test', 'status'))
            .then(() => setIsOnline(true))
            .catch(() => setIsOnline(false));

          return () => unsubProfile();
        } else {
          setProfileData(null);
        }
      },
      (error) => {
        console.error('Firebase: Monitor error:', error);
        if (isMounted) {
          setAuthError('帳號同步發生錯誤，請重新整理頁面。');
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = useCallback(async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    // Set custom parameter to hint account selection
    provider.setCustomParameters({
      prompt: 'select_account',
      auth_type: 'reauthenticate'
    });

    try {
      console.log('Firebase: Attempting popup login...');
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        console.log('Firebase: Popup login success', result.user.email);
        setUser(result.user);
      }
    } catch (error: any) {
      console.warn('Firebase: Login interaction failed/blocked', error.code, error.message);

      if (error.code === 'auth/popup-blocked') {
        setAuthError('彈出視窗被攔截，請允許此網站開啟彈出視窗，或點擊下方按鈕重試：');
      } else if (error.code === 'auth/unauthorized-domain') {
        setAuthError(`驗證失敗：目前網域 (${window.location.hostname}) 未獲授權。`);
      } else if (error.code === 'auth/popup-closed-by-user') {
        // User closed the window, keep quiet or show minor hint
      } else {
        // Fallback to redirect if popup is not suitable
        console.log('Firebase: Attempting redirect fallback...');
        setAuthError('正在跳轉至 Google 驗證頁面...');
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          console.error('Firebase: Redirect login error', redirectError);
          setAuthError(`無法登入 (${redirectError.code})，請嘗試重新整理。`);
        }
      }
    }
  }, []);


  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const uploadFile = useCallback(async (path: string, file: File): Promise<string> => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  }, []);

  const deleteFile = useCallback(async (url: string): Promise<void> => {
    if (!url || !url.startsWith('http')) return; // Basic check for valid URL
    try {
      // In a real app, you might want to derive the path from the URL
      // but for simple cases, ref(storage, url) often works if it's a download URL.
      // However, it's safer to pass the PATH. For now we use the URL.
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
      console.log('Firebase: File deleted successfully');
    } catch (error) {
      console.warn('Firebase: Failed to delete file or file not found:', error);
    }
  }, [storage]);

  const callFn = useCallback(async <T = any, R = any>(name: string, data?: T): Promise<R> => {
    const fn = httpsCallable<T, R>(functions, name);
    const result = await fn(data);
    return result.data;
  }, [functions]);

  useEffect(() => {
    if (remoteConfig) {
      fetchAndActivate(remoteConfig).catch(err => console.warn('Remote Config failed:', err));
    }
  }, []);

  const contextValue = useMemo(() => ({
    user,
    profileData,
    loading,
    login,
    logout,
    isOnline,
    storage,
    functions,
    remoteConfig,
    analytics,
    performance,
    uploadFile,
    deleteFile,
    callFn,
    gcp: GcpService,
    dataconnect
  }), [user, profileData, loading, isOnline, login, logout, uploadFile, deleteFile, callFn]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#009E9D] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/esg-light/1920/1080')] opacity-[0.03] mix-blend-overlay" />
        <GlassCard className="max-w-md w-full p-10 space-y-8 bg-white/80 border-slate-200 backdrop-blur-xl relative z-10 shadow-2xl shadow-slate-200/50">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[#009E9D]/10 rounded-2xl flex items-center justify-center text-[#009E9D] shadow-inner">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                ESG GO
              </h1>
              <p className="text-[10px] font-black text-[#009E9D] tracking-[0.3em] uppercase">
                Infoone V8.1.0 // Trust Engine
              </p>
            </div>

            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 shadow-inner">
              <p className="text-[10px] font-bold text-[#009E9D] uppercase tracking-widest mb-3">
                Security Standard
              </p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                系統已啟用 <span className="font-bold text-slate-700">5T 誠信協議</span> 與 <span className="font-bold text-slate-700">ZKP 零知識證明</span>。請登入以存取您的組織數據及合規報告。
              </p>
            </div>

            {/* Auth Error Display */}
            {authError && (
              <div className="p-4 bg-red-50/80 border border-red-200 rounded-2xl flex flex-col gap-2 animate-shake backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-sm text-red-600 font-semibold">{authError}</p>
                </div>
                <p className="text-[10px] text-red-400 pl-8 leading-tight">
                  請檢查 Firebase 的「授權網域」是否包含 {window.location.hostname}。
                </p>
              </div>
            )}

            {/* Login Buttons */}
            <div className="space-y-4">
              <button
                onClick={login}
                disabled={loading}
                className="w-full h-14 bg-[#0F172A] hover:bg-black text-white rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 font-bold shadow-xl shadow-slate-200/50 active:scale-95 disabled:opacity-50 disabled:active:scale-100 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white/50" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span className="text-lg">使用 Google 帳號登入</span>
                  </>
                )}
              </button>

              <div className="pt-6 border-t border-slate-100 text-center space-y-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
                  Developer Skip Mode
                </p>
                <button
                  onClick={() => setUser({ email: 'dev@esg-go.com', displayName: 'Developer' } as any)}
                  className="w-full h-10 border-2 border-dashed border-slate-200 text-slate-400 hover:text-[#009E9D] hover:border-[#009E9D] hover:bg-[#009E9D]/5 rounded-xl text-[10px] font-bold tracking-widest transition-all uppercase"
                >
                  跳過認證 (開發者模式)
                </button>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
                  Powered by Gnosis Core Engine<br />
                  Secure // Traceable // Transparent
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
      {!isOnline && user && (
        <div className="fixed bottom-24 right-4 z-[200] animate-in fade-in slide-in-from-right-4">
          <GlassCard className="px-4 py-2 bg-rose-50 border-rose-200 flex items-center gap-2 shadow-lg">
            <WifiOff className="w-4 h-4 text-rose-500" />
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
              離線模式 (Firestore Unreachable)
            </span>
          </GlassCard>
        </div>
      )}
    </FirebaseContext.Provider>
  );
}
