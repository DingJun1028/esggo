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
        
        // InfoOne v8.1.0 Colors
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',  // 主要按鈕
          600: '#16a34a',
          900: '#14532d',
          DEFAULT: '#003262', // Preserve berkeley-blue as default primary for compatibility if needed, or set to 500
        },
        // 中性色（液態玻璃背景）
        glass: {
          light: 'rgba(255, 255, 255, 0.08)',
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          dark: 'rgba(0, 0, 0, 0.05)',
        },
        // 狀態色
        verified: '#10b981',    // 綠色 - 已驗證
        warning: '#f59e0b',     // 橙色 - 警告
        error: '#ef4444',       // 紅色 - 錯誤
        draft: '#6b7280',       // 灰色 - 草稿

        // Brand Semantic Colors (legacy fallbacks)
        accent: '#FDB515',
        secondary: '#3B7EA1',
        success: '#22C55E',
        danger: '#EF4444',
        info: '#06B6D4',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        'card': '1.5rem',      // 24px 卡片內距
        'section': '3rem',     // 48px 區塊間距
        'page': '4rem',        // 64px 頁面邊距
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'full': '9999px',
        'card': '1rem',        // 16px 卡片圓角
        'button': '0.5rem',    // 8px 按鈕圓角
        'input': '0.75rem',    // 12px 輸入框圓角
      },
      boxShadow: {
        'glass': '0 4px 32px rgba(0, 50, 98, 0.06)',
        'glass-hover': '0 12px 64px rgba(0, 50, 98, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        DEFAULT: '12px',
        'lg': '24px',
      }
    },
  },
  plugins: [],
};

export default config;
