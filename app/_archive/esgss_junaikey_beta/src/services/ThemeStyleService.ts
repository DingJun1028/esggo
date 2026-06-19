/**
 * 🎨 ThemeStyleService: Dynamic UI Orchestrator
 * --------------------------------------------------
 * Manages semantic design tokens and real-time theme shifts.
 * Supports "Aura" effects for Phase 21 Sentient UI.
 */

import { createUILogger } from '../utils/logger.js';
import { generateAutoPalette } from '../utils/paletteGenerator.js';

const logger = createUILogger('ThemeStyleService');

export type ThemeMode = 'TACTICAL' | 'ETHEREAL' | 'INDUSTRIAL' | 'SENTIENT' | 'DEFAULT';
export type TimeMode = 'SUN' | 'MOON';

export interface ThemePalette {
  primary: string;
  secondary: string;
  glow: string;
  background: string;
  surface: string;
  aura: string;
}

const THEME_BASES: Record<ThemeMode, string> = {
  TACTICAL: '#63a6b0', // Aqua Cyan (上善若水)
  ETHEREAL: '#a855f7', // Purple
  INDUSTRIAL: '#f59e0b', // Amber
  SENTIENT: '#ffffff', // White
  DEFAULT: '#63a6b0',  // Aqua Cyan
};

class ThemeStyleService {
  private currentMode: ThemeMode = 'DEFAULT';
  private currentTime: TimeMode = 'MOON';

  constructor() {
    // Attempt to load from persistence
    const savedMode = localStorage.getItem('omni-theme-mode') as ThemeMode;
    const savedTime = localStorage.getItem('omni-time-mode') as TimeMode;
    if (savedMode) this.currentMode = savedMode;
    if (savedTime) this.currentTime = savedTime;
  }

  public applyTheme(mode: ThemeMode, time?: TimeMode) {
    if (mode) this.currentMode = mode;
    if (time) this.currentTime = time;

    const baseColor = THEME_BASES[this.currentMode];
    const palette = generateAutoPalette(baseColor, this.currentTime === 'MOON');

    // Inject CSS variables into :root
    const root = document.documentElement;
    root.style.setProperty('--omni-primary', palette.primary);
    root.style.setProperty('--omni-secondary', palette.secondary);
    root.style.setProperty('--omni-glow', palette.glow);
    root.style.setProperty('--omni-bg', palette.background);
    root.style.setProperty('--omni-surface', palette.surface);
    root.style.setProperty('--omni-aura', palette.aura);

    // Time specific overlay variables
    root.style.setProperty('--omni-time-brightness', this.currentTime === 'SUN' ? '1.1' : '0.8');
    root.style.setProperty('--omni-time-contrast', this.currentTime === 'SUN' ? '1.05' : '0.9');

    localStorage.setItem('omni-theme-mode', this.currentMode);
    localStorage.setItem('omni-time-mode', this.currentTime);

    logger.info(`🎨 Shifted to ${this.currentMode} (${this.currentTime}) atmosphere.`, { color: baseColor });
  }

  public toggleTimeMode() {
    const nextTime = this.currentTime === 'SUN' ? 'MOON' : 'SUN';
    this.applyTheme(this.currentMode, nextTime);
  }

  public getCurrentTheme(): ThemePalette {
    return generateAutoPalette(THEME_BASES[this.currentMode], this.currentTime === 'MOON');
  }

  public getTimeMode(): TimeMode {
    return this.currentTime;
  }

  public getThemeByAgentType(type: string): ThemeMode {
    switch (type.toUpperCase()) {
      case 'GOVERNANCE': return 'TACTICAL';
      case 'ARTISTIC':
      case 'MYSTICAL': return 'ETHEREAL';
      case 'INDUSTRIAL':
      case 'TECHNICAL': return 'INDUSTRIAL';
      case 'SENTIENT':
      case 'SOVEREIGN': return 'SENTIENT';
      default: return 'DEFAULT';
    }
  }
}

export const themeStyleService = new ThemeStyleService();
