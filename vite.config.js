import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    minify: 'esbuild',
    cacheDir: 'node_modules/.vite',
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'lucide': ['lucide-react'],
          'react': ['react', 'react-dom'],
          'tailwindcss': ['tailwindcss'],
        },
      },
    },
  },
});
