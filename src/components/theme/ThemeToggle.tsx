'use client';

import { useOmniTheme } from './OmniThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';
import { ThemeMode } from '@/types/omni-component';

export function ThemeToggle() {
  const { theme, setTheme } = useOmniTheme();

  return (
    <div className="flex items-center gap-2 p-1 bg-theme-surface-glass rounded-lg border border-theme-border">
      {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
        <button
          key={mode}
          onClick={() => setTheme(mode)}
          className={`
            p-2 rounded-md transition-all duration-150
            ${theme === mode 
              ? 'bg-theme-primary text-theme-accent' 
              : 'text-theme-text-secondary hover:bg-theme-bg-tertiary'
            }
          `}
          aria-label={`Switch to ${mode} theme`}
        >
          {mode === 'light' && <Sun className="w-4 h-4" />}
          {mode === 'dark' && <Moon className="w-4 h-4" />}
          {mode === 'system' && <Monitor className="w-4 h-4" />}
        </button>
      ))}
    </div>
  );
}