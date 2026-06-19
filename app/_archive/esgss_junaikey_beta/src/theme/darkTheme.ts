// ESGss JunAiKey - Dark Theme Configuration
// Unified Dark Theme Configuration

export const darkTheme = {
  // === Background Colors ===
  background: {
    primary: '#0a0e1a', // Primary Background (Deep Blue-Black)
    secondary: '#0f0f1e', // Secondary Background
    tertiary: '#1a1a2e', // Tertiary Background
    card: 'rgba(15, 23, 42, 0.6)', // Card Background
    cardHover: 'rgba(15, 23, 42, 0.8)', // Card Hover
    glass: 'rgba(255, 255, 255, 0.05)', // Glass Effect
    glassStrong: 'rgba(255, 255, 255, 0.1)', // Strong Glass Effect
  },

  // === Text Colors ===
  text: {
    primary: '#ffffff', // Primary Text (Pure White)
    secondary: 'rgba(255, 255, 255, 0.9)', // Secondary Text
    tertiary: 'rgba(255, 255, 255, 0.7)', // Tertiary Text
    muted: 'rgba(255, 255, 255, 0.5)', // Muted Text
    disabled: 'rgba(255, 255, 255, 0.3)', // Disabled Text
  },

  // === Brand Colors (Rainbow Gradients) ===
  colors: {
    cyan: {
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
    },
    blue: {
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
    },
    purple: {
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
    },
    pink: {
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
    },
    emerald: {
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
    },
  },

  // === Borders ===
  border: {
    subtle: 'rgba(255, 255, 255, 0.05)', // Subtle Border
    default: 'rgba(255, 255, 255, 0.1)', // Default Border
    strong: 'rgba(255, 255, 255, 0.2)', // Strong Border
    emphasis: 'rgba(255, 255, 255, 0.3)', // Emphasis Border
  },

  // === Shadows ===
  shadow: {
    sm: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    md: '0 8px 16px -2px rgba(0, 0, 0, 0.6)',
    lg: '0 16px 32px -4px rgba(0, 0, 0, 0.7)',
    xl: '0 24px 48px -6px rgba(0, 0, 0, 0.8)',
    glow: {
      cyan: '0 0 20px rgba(34, 211, 238, 0.5)',
      blue: '0 0 20px rgba(59, 130, 246, 0.5)',
      purple: '0 0 20px rgba(168, 85, 247, 0.5)',
      pink: '0 0 20px rgba(236, 72, 153, 0.5)',
      emerald: '0 0 20px rgba(16, 185, 129, 0.5)',
    },
  },

  // === Gradients ===
  gradients: {
    primary: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #a855f7 100%)',
    rainbow: 'linear-gradient(90deg, #06b6d4, #3b82f6, #a855f7, #ec4899, #f97316)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    darkGlass: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
    cosmic: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0a0e1a 100%)',
  },

  // === Status Colors ===
  status: {
    success: {
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)',
      text: '#34d399',
    },
    warning: {
      bg: 'rgba(251, 146, 60, 0.1)',
      border: 'rgba(251, 146, 60, 0.3)',
      text: '#fb923c',
    },
    error: {
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: '#f87171',
    },
    info: {
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)',
      text: '#60a5fa',
    },
  },

  // === Blur Effects ===
  blur: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
    '3xl': '48px',
  },

  // === Border Radius ===
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    full: '9999px',
  },

  // === Spacing System ===
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  // === Animation Timings ===
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '1000ms',
  },

  // === Fonts ===
  fonts: {
    sizes: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
      '6xl': '3.75rem', // 60px
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
  },
};

// Tailwind CSS Class Mappings
export const darkThemeClasses = {
  // Backgrounds
  bgPrimary: 'bg-[#0a0e1a]',
  bgSecondary: 'bg-slate-900/60',
  bgCard: 'bg-slate-900/50',
  bgGlass: 'bg-white/5 backdrop-blur-xl',
  bgGlassStrong: 'bg-white/10 backdrop-blur-2xl',

  // Text
  textPrimary: 'text-white',
  textSecondary: 'text-white/90',
  textTertiary: 'text-white/70',
  textMuted: 'text-white/50',
  textDisabled: 'text-white/30',

  // Borders
  borderSubtle: 'border-white/5',
  borderDefault: 'border-white/10',
  borderStrong: 'border-white/20',
  borderEmphasis: 'border-white/30',

  // Shadows
  shadowSm: 'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5)]',
  shadowMd: 'shadow-[0_8px_16px_-2px_rgba(0,0,0,0.6)]',
  shadowLg: 'shadow-[0_16px_32px_-4px_rgba(0,0,0,0.7)]',
  shadowXl: 'shadow-[0_24px_48px_-6px_rgba(0,0,0,0.8)]',

  // Glow Effects
  glowCyan: 'shadow-[0_0_20px_rgba(0,255,255,0.5)]',
  glowBlue: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
  glowPurple: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
  glowPink: 'shadow-[0_0_20px_rgba(236,72,153,0.5)]',

  // Gradient Text
  textGradient:
    'bg-gradient-to-r from-aqua-300 via-blue-300 to-purple-300 bg-clip-text text-transparent',

  // Buttons
  btnPrimary:
    'bg-gradient-to-r from-aqua-500 via-aqua-400 to-purple-500 text-white font-bold rounded-xl px-6 py-3 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all',
  btnSecondary:
    'bg-white/10 border-2 border-white/20 text-white font-semibold rounded-xl px-6 py-3 hover:bg-white/20 transition-all',
  btnGhost: 'text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-4 py-2 transition-all',

  // Cards
  card: 'bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-white/20 transition-all',
  cardGlass: 'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8',
  cardInteractive:
    'bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-aqua-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all cursor-pointer',

  // Inputs
  input:
    'bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-aqua-500/50 focus:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all',

  // Tags
  tag: 'px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-semibold backdrop-blur-sm',
  tagActive:
    'px-3 py-1.5 rounded-full bg-aqua-500/20 border border-aqua-500/30 text-aqua-300 text-sm font-bold backdrop-blur-sm',
};

export default darkTheme;
