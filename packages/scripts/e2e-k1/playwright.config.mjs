import { defineConfig } from '@playwright/test';
export default defineConfig({
  // Playwright config for e2e‑k1 tests
  testDir: './e2e-k1',
  timeout: 30_000,
});
