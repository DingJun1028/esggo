/**
 * 🏛️ AtomicLibraryProvider - Omni Governance Context
 * v1.0 | #ThemeManagement #AtomicLibrary
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { OmniThemeId, ModeLayer, atomicManager } from './atomic-core';
import { applyAtomicTheme } from './theme-engine';

interface AtomicLibraryContextProps {
  theme: OmniThemeId;
  mode: ModeLayer;
  setTheme: (theme: OmniThemeId) => void;
  setMode: (mode: ModeLayer) => void;
}

const AtomicLibraryContext = createContext<AtomicLibraryContextProps | undefined>(undefined);

export const AtomicLibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<OmniThemeId>('best-practice');
  const [mode, setModeState] = useState<ModeLayer>('system');

  useEffect(() => {
    // Initial apply
    applyAtomicTheme(theme, mode);
    atomicManager.switchTheme(theme, mode);
  }, [theme, mode]);

  const setTheme = (newTheme: OmniThemeId) => setThemeState(newTheme);
  const setMode = (newMode: ModeLayer) => setModeState(newMode);

  return (
    <AtomicLibraryContext.Provider value={{ theme, mode, setTheme, setMode }}>
      <div className="atomic-app-wrapper min-h-screen bg-[var(--at-bg-primary)] text-[var(--at-text-main)] transition-colors duration-300">
        {children}
      </div>
    </AtomicLibraryContext.Provider>
  );
};

export const useAtomicLibrary = () => {
  const context = useContext(AtomicLibraryContext);
  if (!context) throw new Error('useAtomicLibrary must be used within AtomicLibraryProvider');
  return context;
};
