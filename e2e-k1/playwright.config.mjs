import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: process.env.E2E_BASE || 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
  },
  reporter: [['line'], ['json', { outputFile: 'results.json' }]],
});
