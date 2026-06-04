import React from 'react';
import { AppMode, AppFlavor } from '../lib/theme-store';
interface ThemeContextType {
    mode: AppMode;
    flavor: AppFlavor;
    setMode: (mode: AppMode) => void;
    setFlavor: (flavor: AppFlavor) => void;
    resolvedTheme: 'light' | 'dark';
}
export declare function ThemeProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useTheme(): ThemeContextType;
export {};
//# sourceMappingURL=ThemeContext.d.ts.map