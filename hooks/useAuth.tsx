'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { auth, isDemoMode } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { supabase } from '../lib/supabase';

/**
 * ESG GO | Unified Auth Context
 * Synchronizes Firebase (Legacy/UI) and Supabase (Data/RLS)
 */

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  companyId: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  companyId: 'default'
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState('default');

  useEffect(() => {
    // Initial sync from localStorage for immediate RLS/SaaS state
    try {
      const local = localStorage.getItem('omni_user');
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed.company_id) setCompanyId(parsed.company_id);
      }
    } catch (e) {
      console.warn('[Auth] Failed to parse initial local user');
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          setUser(fbUser);
          
          // Non-blocking Supabase sync
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
               console.log("[Auth Sync] Supabase session missing, background sync active...");
            }
          }).catch(console.error);

          const local = localStorage.getItem('omni_user');
          if (local) {
            const parsed = JSON.parse(local);
            setCompanyId(parsed.company_id || 'default');
          }
        } else {
          // Fallback for Demo Mode
          const localUser = localStorage.getItem('omni_user');
          if (isDemoMode && localUser) {
             const parsed = JSON.parse(localUser);
             setCompanyId(parsed.company_id || 'default');
             setUser({ email: parsed.email || 'dev@esggo.com', uid: parsed.id || 'dev_user' } as any);
          } else {
             setUser(null);
          }
        }
      } catch (err) {
        console.error('[Auth Critical Error]', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    companyId
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
