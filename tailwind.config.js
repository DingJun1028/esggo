/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'berkeley-blue': '#003262',
        'berkeley-dark': '#002147',
        'california-gold': '#FDB515',
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'neutral-50': '#FAFAFA',
        'neutral-100': '#F5F5F5',
        'neutral-200': '#E5E5E5',
        'neutral-300': '#D4D4D4',
        'neutral-800': '#262626',
        'neutral-900': '#171717',
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
        void: {
          stark: '#0f172a',
          rich: '#1e293b',
        },
        cyan: {
          core: '#06b6d4',
        },
        emerald: {
          soul: '#10b981',
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
        't1-tangible-main': '#10B981',
        't2-traceable-main': '#3B7EA1',
        't3-trackable-main': '#8B5CF6',
        't4-transparent-main': '#F59E0B',
        't5-trustworthy-main': '#003262',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'h1': ['32px', { fontWeight: '700', lineHeight: '1.2' }],
        'h2': ['28px', { fontWeight: '600', lineHeight: '1.3' }],
        'h3': ['24px', { fontWeight: '600', lineHeight: '1.4' }],
        'body': ['16px', { fontWeight: '400', lineHeight: '1.6' }],
        'caption': ['14px', { fontWeight: '400', lineHeight: '1.4' }],
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
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale': 'scale 0.2s ease-in-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.8', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.5)' },
        },
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
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.liquid-glass': {
          'backdrop-filter': 'blur(12px)',
          'background': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      });
    },
  ],
};