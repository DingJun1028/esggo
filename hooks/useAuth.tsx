'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { auth, isDemoMode } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { supabase } from '../lib/supabase';

/**
 * ESG GO | Unified Auth Context
 * Synchronizes Firebase (Legacy/UI) and Supabase (Data/RLS)
 * Monitors Platform System Health
 */

export type SystemStatus = 'online' | 'degraded' | 'offline';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  companyId: string;
  systemStatus: SystemStatus;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  companyId: 'default',
  systemStatus: 'online'
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState('default');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('online');

  useEffect(() => {
    // 1. Monitor Browser Network Connectivity
    const updateOnlineStatus = () => setSystemStatus(navigator.onLine ? 'online' : 'offline');
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // 2. Initial Local Sync
    try {
      const local = localStorage.getItem('omni_user');
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed.company_id) setCompanyId(parsed.company_id);
      }
    } catch (e) {
      console.warn('[Auth] Local parse fail');
    }

    // 3. Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          setUser(fbUser);
          
          // Non-blocking Supabase session check
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
               setSystemStatus('degraded'); // Auth sync required but session not found
            } else {
               setSystemStatus('online');
            }
          }).catch(() => setSystemStatus('degraded'));

          const local = localStorage.getItem('omni_user');
          if (local) {
            const parsed = JSON.parse(local);
            setCompanyId(parsed.company_id || 'default');
          }
        } else {
          // Demo Mode Fallback
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
        console.error('[Auth Critical]', err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    companyId,
    systemStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
