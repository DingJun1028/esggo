'use client';

import React, { createContext, useContext } from 'react';
import { debugService } from './DebugService';
import { DebugConfig } from './types';
import { useDebug } from './useDebug';

interface DebugContextValue {
  enabled: boolean;
  config: DebugConfig;
  setEnabled: (enabled: boolean) => void;
  updateConfig: (config: Partial<DebugConfig>) => void;
  log: ReturnType<typeof useDebug>['log'];
  snapshot: ReturnType<typeof useDebug>['snapshot'];
}

const DebugContext = createContext<DebugContextValue | null>(null);

export function DebugProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config?: Partial<DebugConfig>;
}) {
  const debug = useDebug();

  const setEnabled = (enabled: boolean) => {
    debugService.configure({ enabled });
  };

  const updateConfig = (cfg: Partial<DebugConfig>) => {
    debugService.configure(cfg);
  };

  return (
    <DebugContext.Provider
      value={{
        enabled: true,
        config: { ...debugService['config'] },
        setEnabled,
        updateConfig,
        log: debug.log,
        snapshot: debug.snapshot,
      }}
    >
      {children}
    </DebugContext.Provider>
  );
}

export function useDebugContext() {
  const ctx = useContext(DebugContext);
  if (!ctx) {
    return {
      enabled: false,
      config: {} as DebugConfig,
      setEnabled: () => {},
      updateConfig: () => {},
      log: () => ({} as any),
      snapshot: () => ({} as any),
    };
  }
  return ctx;
}
