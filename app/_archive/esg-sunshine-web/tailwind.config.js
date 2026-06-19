/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sunshine-yellow': '#F4C430',
        'sunshine-gold': '#FFD700',
        'sunshine-amber': '#FFA000',
        'emerald': '#10B981',
        'emerald-light': '#34D399',
        'emerald-dark': '#059669',
        'primary': '#10B981',
        'primary-light': '#6EE7B7',
        'primary-dark': '#047857',
        'secondary': '#F59E0B',
        'secondary-light': '#FCD34D',
        'secondary-dark': '#D97706',
        'accent': '#FFD700',
        'surface': '#FEFFFE',
        'surface-2': '#F8FAF9',
        // Extended color palette
        'blue': '#3B82F6',
        'blue-light': '#60A5FA',
        'blue-dark': '#2563EB',
        'purple': '#9333EA',
        'purple-light': '#A855F7',
        'purple-dark': '#7E22CE',
        'pink': '#EC4899',
        'pink-light': '#F472B6',
        'pink-dark': '#DB2777',
        'indigo': '#6366F1',
        'indigo-light': '#818CF8',
        'indigo-dark': '#4F46E5',
        'red': '#EF4444',
        'red-light': '#F87171',
        'red-dark': '#DC2626',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Outfit', 'Inter', 'sans-serif'],
        'brand': ['Lexend', 'Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.8)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-lg': '0 0 40px rgba(16, 185, 129, 0.4)',
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.1)',
        'strong': '0 8px 30px 0 rgba(0, 0, 0, 0.15)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 15px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}