import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Temporary: map runtime errors back to recovered source while the
    // module-scope alias defects are being closed. Revert to false once the
    // bundle renders clean (a 380 kB sourcemap has no business in prod).
    sourcemap: true,
  },
  server: {
    port: 5174,
    strictPort: true,
  },
});
