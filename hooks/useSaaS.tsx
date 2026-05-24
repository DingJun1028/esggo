'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from './useAuth';

/**
 * ESG GO | SaaS Management Hook
 * Handles subscription tiers, usage limits, and enterprise features.
 */

export type SaaSPlan = 'free' | 'professional' | 'enterprise';

interface SaaSContextType {
  plan: SaaSPlan;
  usage: {
    aiWords: number;
    aiLimit: number;
    sealedDocs: number;
    vaultLimit: number;
  };
  isExpiringSoon: boolean;
  upgradePlan: () => void;
}

const SaaSContext = createContext<SaaSContextType>({
  plan: 'free',
  usage: { aiWords: 0, aiLimit: 10000, sealedDocs: 0, vaultLimit: 50 },
  isExpiringSoon: false,
  upgradePlan: () => {}
});

export function SaaSProvider({ children }: { children: React.ReactNode }) {
  const { companyId } = useAuth();
  const [plan, setPlan] = useState<SaaSPlan>('free');
  const [usage, setUsage] = useState({
    aiWords: 12500,
    aiLimit: 50000,
    sealedDocs: 8,
    vaultLimit: 100
  });

  useEffect(() => {
    // In production, fetch subscription data from Supabase/Stripe
    if (companyId === 'default') {
      setPlan('professional');
    }
  }, [companyId]);

  const upgradePlan = () => {
    window.location.href = '/publish'; // Redirect to a billing/upgrade page
  };

  return (
    <SaaSContext.Provider value={{ plan, usage, isExpiringSoon: false, upgradePlan }}>
      {children}
    </SaaSContext.Provider>
  );
}

export const useSaaS = () => useContext(SaaSContext);
