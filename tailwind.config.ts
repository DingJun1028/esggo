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
        // --- Ultimate Aesthetic | Cyber-Zen Palette ---
        void: {
          stark: '#020617', 
          rich: '#0a0f1e',
        },
        cyan: {
          core: '#06b6d4',
          glow: 'rgba(6, 182, 212, 0.4)',
        },
        emerald: {
          soul: '#10b981',
          glow: 'rgba(16, 185, 129, 0.4)',
        },
        surface: {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
          brand: '#06b6d4',
        },
        't1-traceable': { bg: '#E0F2FE', text: '#0369A1' },
        't2-transparent': { bg: '#DCFCE7', text: '#15803D' },
        't3-tangible': { bg: '#FEF3C7', text: '#B45309' },
        't4-trustworthy': { bg: '#FEE2E2', text: '#B91C1C' },
        't5-trackable': { bg: '#F3E8FF', text: '#7E22CE' },
        'aqua-cyan': {
          DEFAULT: '#00FFFF', highlight: '#00FFFF', midtone: '#00C4D9', shadow: '#008BA3',
        },
        'eternal-gold': {
          DEFAULT: '#FFD700', highlight: '#FFD700', midtone: '#E6BE00', shadow: '#C9A000',
        },
        'verified': '#10b981',
        'lethal': '#FF4D6D',
        'critical-signal': '#FFB703',
        'optimal': '#219EBC',
        // --- ESGGO Brand Core Colors ---
        'berkeley-blue': '#003262',
        'california-gold': '#FDB515',
        'founders-rock': '#3B7EA1',
        'berkeley-dark': '#1A3A5C',
        'sather-gate': '#B9D9EB',
        // --- 5T Protocol Status Colors ---
        't1-tangible-main': '#10B981', 
        't2-traceable-main': '#3B7EA1', 
        't3-trackable-main': '#8B5CF6',
        't4-transparent-main': '#F59E0B', 
        't5-trustworthy-main': '#003262', 
        theme: {
          primary: 'var(--theme-primary)',
          'primary-hover': 'var(--theme-primary-hover)',
          accent: 'var(--theme-accent)',
          base: 'var(--theme-base)',
          surface: 'var(--theme-surface)',
          text: 'var(--theme-text)',
          muted: 'var(--theme-text-muted)',
          border: 'var(--theme-border)',
        },
      },
      spacing: {
        '1': '4px', '2': '8px', '3': '12px', '4': '16px',
        '5': '20px', '6': '24px', '8': '32px', '10': '40px',
        '12': '48px', '16': '64px', '20': '80px',
        'card': '24px', 'section': '48px', 'page': '64px',
      },
      borderRadius: {
        'xs': '2px', 'sm': '4px', 'md': '8px', 'lg': '12px',
        'xl': '16px', '2xl': '20px', 'card': '16px', 'full': '9999px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 50, 98, 0.05)',
        'sm': '0 2px 4px rgba(0, 50, 98, 0.08)',
        'md': '0 4px 8px rgba(0, 50, 98, 0.12)',
        'lg': '0 8px 16px rgba(0, 50, 98, 0.15)',
        'xl': '0 12px 24px rgba(0, 50, 98, 0.20)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'cyan-glow': '0 0 20px rgba(6, 182, 212, 0.15)',
        'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.8', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.5)' },
        }
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
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'], // Primary font with Noto Sans TC as Chinese fallback
        mono: ['JetBrains Mono', 'monospace'], // For Data/Code
      },
    },
  },
  plugins: [],
};

export default config;
