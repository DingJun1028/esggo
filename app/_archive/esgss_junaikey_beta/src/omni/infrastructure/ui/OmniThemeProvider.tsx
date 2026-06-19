
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createESGTheme, ThemeMode } from '@/theme';

// 🌀 Omni-Yuantong Theme Type
// Integrating new ESG All-In-One themes with legacy fallback
export type Theme = 'aquaFlow' | 'sunlight' | 'midnight' | 'custom' | 'glass' | 'cyber' | 'sun' | 'moon';

interface OmniThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const OmniThemeContext = createContext<OmniThemeContextType | undefined>(undefined);

export const OmniThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Default to 'aquaFlow' (The new standard)
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('omni-ui-theme');
    return (savedTheme as Theme) || 'aquaFlow';
  });

  // Calculate the effective MUI theme mode
  const muiTheme = useMemo(() => {
    let mode: ThemeMode = 'aquaFlow';

    // Map legacy/other tags to the 3 main MUI modes
    switch (theme) {
      case 'sunlight':
      case 'sun':
        mode = 'sunlight';
        break;
      case 'midnight':
      case 'moon':
      case 'cyber':
        mode = 'midnight';
        break;
      case 'glass':
      case 'aquaFlow':
      default:
        mode = 'aquaFlow';
        break;
    }

    return createESGTheme(mode);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    // Normalize theme for CSS variables (optional, keeping for legacy CSS support)
    const normalizedTheme =
      (theme === 'sunlight' || theme === 'sun') ? 'sun' :
        (theme === 'midnight' || theme === 'moon' || theme === 'cyber') ? 'moon' : 'glass';

    root.setAttribute('data-theme', normalizedTheme);
    localStorage.setItem('omni-ui-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    if (newTheme === theme) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setThemeState(newTheme);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 50);
  };

  const toggleTheme = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setThemeState(prev => {
        if (prev === 'midnight' || prev === 'moon' || prev === 'cyber') return 'aquaFlow';
        return 'midnight'; // Toggle between Default (Aqua) and Dark (Midnight)
      });
      setTimeout(() => setIsTransitioning(false), 300);
    }, 50);
  };

  return (
    <OmniThemeContext.Provider value={{ theme, setTheme, toggleTheme, isTransitioning }}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {isTransitioning && (
          <div
            className="fixed inset-0 z-[9999] pointer-events-none"
            style={{
              background: muiTheme.palette.mode === 'dark' ? '#0A0F19' : '#F8FAFC',
              clipPath: 'circle(0% at center)',
              animation: 'prismatic-scan 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            }}
          />
        )}
        <style>{`
          @keyframes prismatic-scan {
            0% { clip-path: circle(0% at center); }
            100% { clip-path: circle(150% at center); }
          }
        `}</style>
        {children}
      </ThemeProvider>
    </OmniThemeContext.Provider>
  );
};

export const useOmniTheme = () => {
  const context = useContext(OmniThemeContext);
  if (!context) {
    throw new Error('useOmniTheme must be used within an OmniThemeProvider');
  }
  return context;
};
