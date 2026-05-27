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
        // 主色調（深綠永續色）
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',  // 主要按鈕
          600: '#16a34a',
          900: '#14532d',
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
        
        // ── Ultimate Minimalist Palette (Zero Glow) ────────────────
        'cyan-core': '#06B6D4',
        'emerald-soul': '#10B981',
        'void-stark': '#020617',
        'teal-mech': {
          start: '#009E9D',
          end: '#00C2A8',
        },
        'eternal-gold': '#D4AF37',
        
        // Semantic Signals (Solid)
        'lethal': '#FF4D6D',
        'critical-signal': '#FFB703',
        'optimal': '#219EBC',

        // Berkeley Legacy (Re-anchored)
        'berkeley-blue': '#003262',
        'california-gold': '#FDB515',
        
        // Protocol Mappings v2.1
        't1-traceable': '#06B6D4',
        't2-transparent': '#10B981',
        't3-tangible': '#219EBC',
        't4-trackable': '#FFB703',
        't5-trustworthy': '#003262',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      spacing: {
        'card': '1.5rem',      // 24px 卡片內距
        'section': '3rem',     // 48px 區塊間距
        'page': '4rem',        // 64px 頁面邊距
      },
      borderRadius: {
        'card': '1rem',        // 16px 卡片圓角
        'button': '0.5rem',    // 8px 按鈕圓角
        'input': '0.75rem',    // 12px 輸入框圓角
        'mech': '6px',
        'full': '9999px',
      },
      boxShadow: {
        'mech-base': '0 2px 8px rgba(0, 0, 0, 0.03)',
        'mech-active': '0 4px 12px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '12px',
        lg: '24px',
        xl: '40px',
      },
      transitionDuration: {
        'mech': '150ms',
      },
      transitionTimingFunction: {
        'mech': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
};

export default config;
