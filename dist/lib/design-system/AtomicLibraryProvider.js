/**
 * 🏛️ AtomicLibraryProvider - Universal Governance Context
 * v1.0 | #ThemeManagement #AtomicLibrary
 */
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { atomicManager } from './atomic-core';
import { applyAtomicTheme } from './theme-engine';
const AtomicLibraryContext = createContext(undefined);
export const AtomicLibraryProvider = ({ children }) => {
    const [theme, setThemeState] = useState('best-practice');
    const [mode, setModeState] = useState('system');
    useEffect(() => {
        // Initial apply
        applyAtomicTheme(theme, mode);
        atomicManager.switchTheme(theme, mode);
    }, [theme, mode]);
    const setTheme = (newTheme) => setThemeState(newTheme);
    const setMode = (newMode) => setModeState(newMode);
    return (_jsx(AtomicLibraryContext.Provider, { value: { theme, mode, setTheme, setMode }, children: _jsx("div", { className: "atomic-app-wrapper min-h-screen bg-[var(--at-bg-primary)] text-[var(--at-text-main)] transition-colors duration-300", children: children }) }));
};
export const useAtomicLibrary = () => {
    const context = useContext(AtomicLibraryContext);
    if (!context)
        throw new Error('useAtomicLibrary must be used within AtomicLibraryProvider');
    return context;
};
//# sourceMappingURL=AtomicLibraryProvider.js.map