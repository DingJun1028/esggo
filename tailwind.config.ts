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
        'berkeley-blue': '#003262',
        'california-gold': '#FDB515',
        'founders-rock': '#3B7EA1',
        'medalist': '#C4820A',
        'bay-fog': '#DDD5C8',
        'rose-garden': '#EE1F60',
        'sather-gate': '#B9D3B6',
        'pacific': '#46535E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;