/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        borderColor: 'var(--border-color)',
        accentTeal: 'var(--accent-teal)',
        accentGold: 'var(--accent-gold)',
        accentBlue: 'var(--accent-blue)',
        accentPurple: 'var(--accent-purple)',
        accentCyan: 'var(--accent-cyan)',
        accentGreen: 'var(--accent-green)',
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#009EB0',
          600: '#008596',
          700: '#006b7b',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#D4AF37',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
