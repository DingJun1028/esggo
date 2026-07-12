import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      // 腳本式驗證（頂層 console.log + assert + process.exit），非 vitest 套件，不應被抓取執行
      '**/__test__/**',
      'apps/gateway/sync/__test__/**',
      'apps/gateway/sync/dist/__test__/**',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
