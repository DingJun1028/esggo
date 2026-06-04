/**
 * 🏛️ AtomicLibraryProvider - Universal Governance Context
 * v1.0 | #ThemeManagement #AtomicLibrary
 */
import React from 'react';
import { UniversalThemeId, ModeLayer } from './atomic-core';
interface AtomicLibraryContextProps {
    theme: UniversalThemeId;
    mode: ModeLayer;
    setTheme: (theme: UniversalThemeId) => void;
    setMode: (mode: ModeLayer) => void;
}
export declare const AtomicLibraryProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAtomicLibrary: () => AtomicLibraryContextProps;
export {};
//# sourceMappingURL=AtomicLibraryProvider.d.ts.map