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
      // 隔離 .kilo 下的舊 worktree 測試，它們引用已不存在的 @/lib/* 路徑，會污染本分支 CI
      '**/.kilo/**',
      // esggo-omni-center 是獨立子專案（自帶 vitest.config.ts 與 test script，非 workspace 成員），
      // 由它自己的 node_modules 解析依賴；被根 vitest 抓取時 firebase ESM 出口解析失敗。
      // 於其目錄執行 `pnpm install && pnpm test` 驗證。
      'esggo-omni-center/**',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@lib': path.resolve(__dirname, './lib'),
    },
  },
});
