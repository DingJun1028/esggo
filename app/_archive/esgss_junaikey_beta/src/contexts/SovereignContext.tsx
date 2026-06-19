import React, { createContext, useContext, useEffect, useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { omniMindService } from '@/services/OmniMindService';

interface SovereignContextType {
  isReady: boolean;
  identity: string;
  sovereignHash: string;
  resonanceLevel: number;
  entropyLevel: number;
  recordImpact: (impact: {
    type: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
    description: string;
    metric: string;
  }) => void;
}

const SovereignContext = createContext<SovereignContextType | undefined>(undefined);

export const SovereignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [identity] = useState('Omni-Sovereign-Entity-v8.2.0');
  const [sovereignHash, setSovereignHash] = useState('');
  const [resonanceLevel, setResonanceLevel] = useState(0);
  const [entropyLevel, setEntropyLevel] = useState(0);

  useEffect(() => {
    // Sync with OmniMindService
    const syncSystem = () => {
      const status = omniMindService.getEquilibriumStatus();
      if (status) {
        setResonanceLevel(status.globalResonanceParity * 100);
        setEntropyLevel(status.nebulaEntropy * 100);
        setSovereignHash(status.singularityHash);
        setIsReady(true);
      } else {
        // Initialize if not ready
        omniMindService.attainEquilibrium().then(newStatus => {
          setResonanceLevel(newStatus.globalResonanceParity * 100);
          setEntropyLevel(newStatus.nebulaEntropy * 100);
          setSovereignHash(newStatus.singularityHash);
          setIsReady(true);
        });
      }
    };

    syncSystem();
    const interval = setInterval(syncSystem, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SovereignContext.Provider
      value={{
        isReady,
        identity,
        sovereignHash,
        resonanceLevel,
        entropyLevel,
        recordImpact: impact => {
          omniLogger.info(LogCategory.SYSTEM, '[SovereignContext] Info', { data: `[Impact Recorded] ${impact.type}: ${impact.description} (${impact.metric})` });
        },
      }}
    >
      {children}
    </SovereignContext.Provider>
  );
};

export const useSovereignSystem = () => {
  const context = useContext(SovereignContext);
  if (context === undefined) {
    throw new Error('useSovereignSystem must be used within a SovereignProvider');
  }
  return context;
};

export const useSovereign = useSovereignSystem;
