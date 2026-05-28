/**
 * 🎨 Theme Engine V2 - Multi-Theme & Layered Mode
 * v2.0 | #BenevolentClassic #BerkeleyAcademy #ExtremeMinimalist #BestPractice
 */

import { UniversalThemeId, ModeLayer } from './atomic-core';

export interface AtomicThemeVars {
  '--at-bg-primary': string;
  '--at-bg-card': string;
  '--at-bg-glass': string;
  '--at-text-main': string;
  '--at-text-sub': string;
  '--at-accent': string;
  '--at-accent-glow': string;
  '--at-border': string;
  '--at-shadow': string;
  '--at-glass-blur': string;
  '--at-glass-opacity': string;
}

export const UNIVERSAL_THEMES: Record<UniversalThemeId, Record<Exclude<ModeLayer, 'system'>, AtomicThemeVars>> = {
  'benevolent-classic': {
    light: {
      '--at-bg-primary': '#f0f9f6',
      '--at-bg-card': '#ffffff',
      '--at-bg-glass': 'rgba(255, 255, 255, 0.7)',
      '--at-text-main': '#1a3d2e',
      '--at-text-sub': '#4a7c66',
      '--at-accent': '#10b981',
      '--at-accent-glow': 'rgba(16, 185, 129, 0.3)',
      '--at-border': 'rgba(16, 185, 129, 0.15)',
      '--at-shadow': '0 8px 32px rgba(16, 185, 129, 0.05)',
      '--at-glass-blur': '12px',
      '--at-glass-opacity': '0.7',
    },
    dark: {
      '--at-bg-primary': '#061a12',
      '--at-bg-card': '#0a221a',
      '--at-bg-glass': 'rgba(10, 34, 26, 0.8)',
      '--at-text-main': '#e6f4ef',
      '--at-text-sub': '#8db8a9',
      '--at-accent': '#10b981',
      '--at-accent-glow': 'rgba(16, 185, 129, 0.5)',
      '--at-border': 'rgba(16, 185, 129, 0.2)',
      '--at-shadow': '0 8px 32px rgba(0,0,0,0.5)',
      '--at-glass-blur': '16px',
      '--at-glass-opacity': '0.6',
    }
  },
  'berkeley-academy': {
    light: {
      '--at-bg-primary': '#f8fafc',
      '--at-bg-card': '#ffffff',
      '--at-bg-glass': 'rgba(255, 255, 255, 0.8)',
      '--at-text-main': '#003262',
      '--at-text-sub': '#3b7ea1',
      '--at-accent': '#003262',
      '--at-accent-glow': 'rgba(0, 50, 98, 0.2)',
      '--at-border': 'rgba(0, 50, 98, 0.1)',
      '--at-shadow': '0 4px 20px rgba(0, 50, 98, 0.08)',
      '--at-glass-blur': '8px',
      '--at-glass-opacity': '0.85',
    },
    dark: {
      '--at-bg-primary': '#001021',
      '--at-bg-card': '#001f3f',
      '--at-bg-glass': 'rgba(0, 31, 63, 0.85)',
      '--at-text-main': '#f8fafc',
      '--at-text-sub': '#a8bdd4',
      '--at-accent': '#FDB515',
      '--at-accent-glow': 'rgba(253, 181, 21, 0.4)',
      '--at-border': 'rgba(253, 181, 21, 0.2)',
      '--at-shadow': '0 8px 32px rgba(0,0,0,0.6)',
      '--at-glass-blur': '14px',
      '--at-glass-opacity': '0.6',
    }
  },
  'extreme-minimalist': {
    light: {
      '--at-bg-primary': '#ffffff',
      '--at-bg-card': '#ffffff',
      '--at-bg-glass': 'rgba(255, 255, 255, 0.95)',
      '--at-text-main': '#000000',
      '--at-text-sub': '#666666',
      '--at-accent': '#000000',
      '--at-accent-glow': 'rgba(0, 0, 0, 0.1)',
      '--at-border': '#eeeeee',
      '--at-shadow': 'none',
      '--at-glass-blur': '0px',
      '--at-glass-opacity': '1',
    },
    dark: {
      '--at-bg-primary': '#000000',
      '--at-bg-card': '#000000',
      '--at-bg-glass': 'rgba(0, 0, 0, 0.95)',
      '--at-text-main': '#ffffff',
      '--at-text-sub': '#999999',
      '--at-accent': '#ffffff',
      '--at-accent-glow': 'rgba(255, 255, 255, 0.2)',
      '--at-border': '#222222',
      '--at-shadow': 'none',
      '--at-glass-blur': '0px',
      '--at-glass-opacity': '1',
    }
  },
  'best-practice': {
    light: {
      '--at-bg-primary': '#f1f5f9',
      '--at-bg-card': '#ffffff',
      '--at-bg-glass': 'rgba(255, 255, 255, 0.8)',
      '--at-text-main': '#0f172a',
      '--at-text-sub': '#64748b',
      '--at-accent': '#0ea5e9',
      '--at-accent-glow': 'rgba(14, 165, 233, 0.3)',
      '--at-border': 'rgba(203, 213, 225, 0.6)',
      '--at-shadow': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      '--at-glass-blur': '10px',
      '--at-glass-opacity': '0.8',
    },
    dark: {
      '--at-bg-primary': '#020617',
      '--at-bg-card': '#0f172a',
      '--at-bg-glass': 'rgba(15, 23, 42, 0.8)',
      '--at-text-main': '#f8fafc',
      '--at-text-sub': '#94a3b8',
      '--at-accent': '#38bdf8',
      '--at-accent-glow': 'rgba(56, 189, 248, 0.4)',
      '--at-border': 'rgba(30, 41, 59, 0.8)',
      '--at-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      '--at-glass-blur': '20px',
      '--at-glass-opacity': '0.7',
    }
  }
};

/**
 * Apply the selected theme and mode to the document
 */
export function applyAtomicTheme(themeId: UniversalThemeId, mode: ModeLayer) {
  let activeMode: Exclude<ModeLayer, 'system'> = 'light';
  
  if (mode === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      activeMode = 'dark';
    }
  } else {
    activeMode = mode;
  }

  const themeVars = UNIVERSAL_THEMES[themeId][activeMode];
  const root = document.documentElement;

  Object.entries(themeVars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });

  root.setAttribute('data-at-theme', themeId);
  root.setAttribute('data-at-mode', activeMode);
  
  console.log(`[ThemeEngine] Applied ${themeId} in ${activeMode} mode.`);
}
