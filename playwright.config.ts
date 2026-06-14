import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/vrt',
  snapshotDir: './tests/vrt/__snapshots__',
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html']],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'visual',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
