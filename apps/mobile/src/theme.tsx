import React from 'react';
import { useColorScheme } from 'react-native';
import { THEME, type ThemeMode } from '@esggo/shared';

export interface AppColors {
  bg: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  teal: string;
  gold: string;
}

const ThemeContext = React.createContext<AppColors>(THEME.light);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const mode: ThemeMode = scheme === 'dark' ? 'dark' : 'light';
  const colors = THEME[mode];
  return <ThemeContext.Provider value={colors}>{children}</ThemeContext.Provider>;
}

export function useTheme(): AppColors {
  return React.useContext(ThemeContext);
}
