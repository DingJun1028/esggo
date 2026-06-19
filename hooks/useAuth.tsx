'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { createBrowserClient } from '@supabase/ssr';

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
  systemStatus: 'online',
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState('default');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('online');

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
    const hasSupabase = !!(supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder'));

    // Always try localStorage first (works in browser)
    let localUser: any = null;
    try {
      const local = localStorage.getItem('omni_user');
      if (local && local !== 'undefined') {
        localUser = JSON.parse(local);
      }
    } catch {
      // ignore
    }

    if (!hasSupabase) {
      // Demo mode — use localStorage or default
      if (localUser) {
        setUser({
          id: localUser.id || 'dev_user',
          email: localUser.email || 'demo@esggo.com',
          role: localUser.role || 'superadmin',
          ...localUser,
        });
        setCompanyId(localUser.company_id || 'esg-sunshine');
      } else {
        setUser({ id: 'demo_user', email: 'demo@esggo.com', role: 'superadmin' });
        setCompanyId('esg-sunshine');
      }
      setSystemStatus('online');
      setLoading(false);
      return;
    }

    // Supabase mode
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('[Supabase Auth] Session error', error.message);
          setSystemStatus('degraded');
        }

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: session.user.user_metadata?.role || 'superadmin',
            ...session.user.user_metadata,
          });
          setSystemStatus('online');
        } else if (localUser) {
          setUser({
            id: localUser.id || 'dev_user',
            email: localUser.email || 'demo@esggo.com',
            role: localUser.role || 'superadmin',
            ...localUser,
          });
          setCompanyId(localUser.company_id || 'esg-sunshine');
        } else {
          setUser({ id: 'demo_user', email: 'demo@esggo.com', role: 'superadmin' });
          setCompanyId('esg-sunshine');
        }
      } catch (err) {
        console.error('[Auth Init] Failed', err);
        setSystemStatus('degraded');
        if (localUser) {
          setUser({ id: localUser.id || 'dev_user', email: localUser.email || 'demo@esggo.com', ...localUser });
        }
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: session.user.user_metadata?.role || 'superadmin',
          ...session.user.user_metadata,
        });
        setSystemStatus('online');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    companyId,
    systemStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
