import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        berkeley: {
          blue: '#003262',
          gold: '#FDB515',
          light: '#3B7EA1',
        },
      },
    },
  },
  plugins: [],
};
export default config;