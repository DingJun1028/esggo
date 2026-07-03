'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface AgnesApiContextType {
  isReady: boolean;
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  connect: () => Promise<void>;
  disconnect: () => void;
  processMessage: (message: string) => Promise<string | null>;
}

const AgnesApiContext = createContext<AgnesApiContextType>({
  isReady: false,
  apiKey: null,
  setApiKey: () => {},
  status: 'disconnected',
  connect: async () => {},
  disconnect: () => {},
  processMessage: async () => null,
});

export function AgnesProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return process.env.NEXT_PUBLIC_AGNES_API_KEY || null;
    }
    return null;
  });
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_AGNES_API_KEY) {
      return 'connected';
    }
    return 'disconnected';
  });
  const [isReady, setIsReady] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!process.env.NEXT_PUBLIC_AGNES_API_KEY;
    }
    return false;
  });

  const connect = async () => {
    setStatus('connecting');
    try {
      // Simulate connection check
      await new Promise(resolve => setTimeout(resolve, 500));
      setStatus('connected');
      setIsReady(true);
    } catch (e) {
      setStatus('error');
      setIsReady(false);
    }
  };

  const disconnect = () => {
    setStatus('disconnected');
    setIsReady(false);
  };

  // Delegate processing to the backend route to avoid exposing secrets
  const processMessage = async (message: string): Promise<string | null> => {
    if (!isReady) return null;
    try {
      const res = await fetch('/api/agnes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: message }),
      });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      return data.data?.output || null;
    } catch (e) {
      console.error('[AGNES_API] Process Error:', e);
      return null;
    }
  };

  const value: AgnesApiContextType = {
    isReady,
    apiKey,
    setApiKey,
    status,
    connect,
    disconnect,
    processMessage,
  };

  return (
    <AgnesApiContext.Provider value={value}>
      {children}
    </AgnesApiContext.Provider>
  );
}

export function useAgnesApi(): AgnesApiContextType {
  return useContext(AgnesApiContext);
}