/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './index.tsx', './**/*.tsx'],
  theme: {
    extend: {
      colors: {
        // Base System
        void: 'var(--color-bg)',
        panel: 'var(--color-panel)',
        border: 'var(--color-border)',

        // Brand Palette (Map to CSS Variables)
        brand: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)',
          danger: 'var(--color-danger)',
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          info: 'var(--color-info)',
        },

        // Text
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',

        // Legacy Compat (Cyber) - Mapped to new variables for consistency
        cyber: {
          gold: 'var(--color-accent)',
          emerald: 'var(--color-primary)',
          alert: 'var(--color-danger)',
          glass: 'rgba(10, 10, 15, 0.7)',
        },

        // 🌊 Water Logic (Phase 36)
        infoOne: {
          accent: '#00FFFF',      // Aqua Primary (Updated to #00FFFF)
          gold: '#FFD700',        // Sovereign Gold
          emerald: '#52C41A',     // Success Green
          bg: 'var(--color-bg)',  // Deep Space
        },
        // 💧 Aqua & 5T System (Sovereign Revision)
        aqua: {
          DEFAULT: '#00FFFF',
          primary: '#00FFFF',
          lighter: '#E0FFFF',
          darker: '#00CCCC',
          50: '#F0FFFF',
          100: '#E0FFFF',
          300: '#7FFFFF',
          500: '#00FFFF',        /* BRAND PRIMARY */
          700: '#00CCCC',
          900: '#008888',
          400: '#0DF2DF', // Added for SacredContract compatibility
          glow: 'rgba(0, 255, 255, 0.5)',
        },
        t5: {
          tangible: '#00FFFF',   /* Aqua (#00FFFF) */
          traceable: '#52C41A',  /* Emerald */
          trackable: '#00CCCC',  /* Deep Aqua */
          transparent: '#CBF3F0',/* Ice */
          trustworthy: '#FFD700',/* Gold */
        },
        verified: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        draft: '#6b7280',
        glass: {
          light: 'rgba(255, 255, 255, 0.08)',
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          dark: 'rgba(0, 0, 0, 0.2)',
        },
      },
      animation: {
        'enter': 'page-enter 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { top: '0%', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
      },
      spacing: {
        'card': '1.5rem',
        'section': '3rem',
        'page': '4rem',
      },
      borderRadius: {
        'card': '1rem',
        'button': '0.5rem',
        'input': '0.75rem',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'Noto Sans TC', 'sans-serif'],
        display: ['Lexend', 'Outfit', 'Noto Sans TC', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
