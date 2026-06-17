/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'berkeley-blue': '#003262',
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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      fontSize: {
        'h1': ['32px', { fontWeight: '700', lineHeight: '1.2' }],
        'h2': ['28px', { fontWeight: '600', lineHeight: '1.3' }],
        'h3': ['24px', { fontWeight: '600', lineHeight: '1.4' }],
        'body': ['16px', { fontWeight: '400', lineHeight: '1.6' }],
        'caption': ['14px', { fontWeight: '400', lineHeight: '1.4' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale': 'scale 0.2s ease-in-out',
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
      },
    },
  },
  plugins: [],
}

// Liquid Glass Effect
const liquidGlassPlugin = function({ addUtilities }) {
  addUtilities({
    '.liquid-glass': {
      'backdrop-filter': 'blur(12px)',
      'background': 'rgba(255, 255, 255, 0.1)',
      'border': '1px solid rgba(255, 255, 255, 0.2)',
      'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.1)',
    }
  })
}