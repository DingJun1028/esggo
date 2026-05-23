import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Berkeley Academic Palette
        'berkeley-blue': '#003262',
        'california-gold': '#FDB515',
        'founders-rock': '#3B7EA1',
        'berkeley-dark': '#1A3A5C',
        'sather-gate': '#B9D9EB',
        
        // 5T Protocol Status Colors
        't1-tangible': '#10B981',
        't2-traceable': '#3B7EA1',
        't3-trackable': '#8B5CF6',
        't4-transparent': '#F59E0B',
        't5-trustworthy': '#003262',
        
        // Brand Semantic Colors
        primary: '#003262',
        accent: '#FDB515',
        secondary: '#3B7EA1',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#06B6D4',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'full': '9999px',
      },
      boxShadow: {
        'glass': '0 4px 32px rgba(0, 50, 98, 0.06)',
        'glass-hover': '0 12px 64px rgba(0, 50, 98, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};

export default config;
