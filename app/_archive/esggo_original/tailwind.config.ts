import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- Design Token System v10.0 | Primitive Layers ---
        blue: {
          50: '#F0F7FF', 100: '#E0EFFF', 200: '#B8D9FF', 300: '#8ABFFF', 
          400: '#579DFF', 500: '#007AFF', 600: '#0062E0', 700: '#004BB3', 
          800: '#00378F', 900: '#002666',
        },
        gold: {
          50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D',
          400: '#FBBF24', 500: '#F59E0B', 600: '#D97706', 700: '#B45309',
          800: '#92400E', 900: '#78350F',
        },
        // [Other primitive colors can be added here as needed]

        // --- Semantic Tokens | Action & Status ---
        surface: {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
          brand: 'var(--aqua-cyan-midtone)',
        },
        action: {
          hover: 'rgba(0, 122, 255, 0.05)',
          active: 'rgba(0, 122, 255, 0.1)',
          disabled: '#CBD5E1',
        },

        // --- 5T Protocol v10.0 | BG + Text Mapping ---
        't1-traceable': { bg: '#E0F2FE', text: '#0369A1' },
        't2-transparent': { bg: '#DCFCE7', text: '#15803D' },
        't3-tangible': { bg: '#FEF3C7', text: '#B45309' },
        't4-trustworthy': { bg: '#FEE2E2', text: '#B91C1C' },
        't5-trackable': { bg: '#F3E8FF', text: '#7E22CE' },

        // ── ESG SUNSHINE | Atomic Light Label Edition ────────────────
        'aqua-cyan': {
          DEFAULT: '#00FFFF',
          highlight: '#00FFFF',
          midtone: '#00C4D9',
          shadow: '#008BA3',
        },
        'eternal-gold': {
          DEFAULT: '#FFD700',
          highlight: '#FFD700',
          midtone: '#E6BE00',
          shadow: '#C9A000',
        },
        
        // Semantic Signals (Solid)
        'verified': '#10b981',
        'lethal': '#FF4D6D',
        'critical-signal': '#FFB703',
        'optimal': '#219EBC',

        // Legacy Support
        'berkeley-blue': '#003262',
        'california-gold': '#FDB515',
      },
      spacing: {
        '1': '4px', '2': '8px', '3': '12px', '4': '16px',
        '5': '20px', '6': '24px', '8': '32px', '10': '40px',
        '12': '48px', '16': '64px', '20': '80px',
        'card': '24px', 'section': '48px', 'page': '64px',
      },
      borderRadius: {
        'xs': '2px', 'sm': '4px', 'md': '8px', 'lg': '12px',
        'xl': '16px', '2xl': '24px', 'card': '16px', 'full': '9999px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 50, 98, 0.05)',
        'sm': '0 2px 4px rgba(0, 50, 98, 0.08)',
        'md': '0 4px 8px rgba(0, 50, 98, 0.12)',
        'lg': '0 8px 16px rgba(0, 50, 98, 0.15)',
        'xl': '0 12px 24px rgba(0, 50, 98, 0.20)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      zIndex: {
        'below': '-1',
        'base': '0',
        'content': '10',
        'dropdown': '100',
        'sticky': '200',
        'modal': '400',
        'toast': '500',
      },
      transitionDuration: {
        'instant': '50ms',
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
        'slower': '800ms',
      },
      transitionTimingFunction: {
        'ease-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }
    },
  },
  plugins: [],
};

export default config;
