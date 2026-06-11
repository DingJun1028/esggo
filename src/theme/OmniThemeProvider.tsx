import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ThemeMode } from '@/types/omni-component';
import { applyTheme, getSystemTheme } from '../components/theme/omni-theme';
import { usePreferencesStore } from '../../usePreferencesStore'; // Assuming this store exists for persistence

interface OmniThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const OmniThemeContext = createContext<OmniThemeContextType | undefined>(undefined);

interface OmniThemeProviderProps {
  children: React.ReactNode;
}

export const OmniThemeProvider: React.FC<OmniThemeProviderProps> = ({ children }) => {
  const { theme: storedTheme, setTheme: setStoredTheme } = usePreferencesStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
  }));
  const [theme, setInternalTheme] = useState<ThemeMode>(storedTheme || 'system');

  // Apply theme to the DOM and update persistent store
  const updateTheme = useCallback(
    (newTheme: ThemeMode) => {
      setInternalTheme(newTheme);
      setStoredTheme(newTheme);
      applyTheme(newTheme);
    },
    [setStoredTheme]
  );

  // Initial theme application and system theme listener
  useEffect(() => {
    updateTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, updateTheme]);

  const toggleTheme = useCallback(() => {
    setInternalTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      setStoredTheme(newTheme);
      applyTheme(newTheme);
      return newTheme;
    });
  }, [setStoredTheme]);

  const isDarkMode = theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark');

  return (
    <OmniThemeContext.Provider value={{ theme, setTheme: updateTheme, toggleTheme, isDarkMode }}>
      {children}
    </OmniThemeContext.Provider>
  );
};

export const useOmniTheme = (): OmniThemeContextType => {
  const context = useContext(OmniThemeContext);
  if (context === undefined) {
    throw new Error('useOmniTheme must be used within an OmniThemeProvider');
  }
  return context;
};
