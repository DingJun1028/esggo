/**
 * 🌀 ThemeContext Compatibility Layer
 * --------------------------------------------------
 * 體現「奧秘圓通 (Omni-Yuantong)」哲學：
 *
 * 舊接口自動流向新實現，無需修改 11 個依賴文件。
 * 實現「無通自通」- 數據一次定義，全域自動對標。
 *
 * This is a compatibility shim that forwards old ThemeContext
 * calls to the new OmniThemeProvider, embodying the principle
 * of "Siloless Data Flow" - zero friction adaptation.
 */

import { useOmniTheme } from '../omni/infrastructure/ui/OmniThemeProvider';

/**
 * Legacy hook for backward compatibility
 * Maps to OmniThemeProvider's interface
 */
export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useOmniTheme();

  return {
    theme,
    style: theme, // Alias for components using { style } destructuring
    mode: theme, // Alias for mode-based components
    setTheme,
    toggleTheme,
    toggleStyle: toggleTheme, // Alias for legacy components using toggleStyle
    toggleMode: toggleTheme, // Alias for mode-based components
  };
};

/**
 * Re-export OmniThemeProvider as ThemeProvider for full compatibility
 */
export { OmniThemeProvider as ThemeProvider } from '../omni/infrastructure/ui/OmniThemeProvider';
