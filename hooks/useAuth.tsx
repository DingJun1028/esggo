'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { createBrowserClient } from '@supabase/ssr';

/**
 * ESG GO | Unified Auth Context
 * Fully Migrated to Supabase (Data/RLS/Auth)
 * Monitors Platform System Health
 */

export type SystemStatus = 'online' | 'degraded' | 'offline';

export interface User {
  id: string;
  email?: string;
  [key: string]: any;
}

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

  // Using @supabase/ssr for browser client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
  
  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    // 1. Monitor Browser Network Connectivity
    const updateOnlineStatus = () => setSystemStatus(navigator.onLine ? 'online' : 'offline');
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // 2. Initial Local Sync & Demo Data Fallback
    try {
      const local = localStorage.getItem('omni_user');
      if (local && local !== 'undefined') {
        const parsed = JSON.parse(local);
        if (parsed?.company_id) setCompanyId(parsed.company_id);
      }
    } catch (e) {
      console.warn('[Auth] Local parse fail, cleared');
      localStorage.removeItem('omni_user');
    }

    // 3. Supabase Auth Session listener
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('[Supabase Auth] Session fetch error', error.message);
          setSystemStatus('degraded');
        }

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            ...session.user.user_metadata
          });
          setSystemStatus('online');
        } else {
          // Demo fallback logic if no user session
          const localUser = localStorage.getItem('omni_user');
          if (localUser && localUser !== 'undefined') {
             const parsed = JSON.parse(localUser);
             setCompanyId(parsed?.company_id || 'default');
             setUser({ email: parsed?.email || 'dev@esggo.com', id: parsed?.id || 'dev_user' });
          } else {
             setUser(null);
          }
        }
      } catch (err) {
        console.error('[Auth Init] Failed', err);
        setSystemStatus('degraded');
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            ...session.user.user_metadata
          });
          setSystemStatus('online');
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [supabase.auth]);

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
