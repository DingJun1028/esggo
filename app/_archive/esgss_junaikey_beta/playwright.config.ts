import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 測試配置
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  /* 並行執行測試 */
  fullyParallel: true,

  /* 失敗重試次數 */
  retries: process.env.CI ? 2 : 0,

  /* 並行 worker 數量 */
  workers: process.env.CI ? 1 : undefined,

  /* 報告器 */
  reporter: 'html',

  /* 共享設置 */
  use: {
    /* 基礎 URL */
    baseURL: 'http://localhost:3000',

    /* 失敗時截圖 */
    screenshot: 'only-on-failure',

    /* 失敗時錄製視頻 */
    video: 'retain-on-failure',

    /* 追蹤 */
    trace: 'on-first-retry',
  },

  /* 測試項目配置 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* 移動端測試 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* 啟動 dev server */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
