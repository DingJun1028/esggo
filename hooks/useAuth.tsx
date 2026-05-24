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
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        
        // Sync with Supabase session if needed
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
           console.log("[Auth Sync] Initializing Supabase session from Firebase context...");
           // In a real prod env, you would use cross-auth exchange here
        }

        // Extract company_id from metadata or local storage
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
           // Mock user object for UI
           setUser({ email: 'dev@esggo.com', uid: parsed.id } as any);
        } else {
           setUser(null);
        }
      }
      setLoading(false);
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
