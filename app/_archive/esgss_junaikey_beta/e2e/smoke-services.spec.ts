import { test, expect } from '@playwright/test';

test.describe('Phase 15: Comprehensive Service Smoke Test', () => {
  test.beforeEach(async ({ page }) => {
    // Debug: Listen to logs
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));

    // 1. Visit App
    console.log('Navigating to home...');
    await page.goto('/', { timeout: 60000 });

    // 2. Auth Flow
    // Check if we are on Login Page
    const loginHeader = page.locator('h2', { hasText: '歡迎回來' });
    const devModeBtn = page.getByText('開發者模式');

    if (await loginHeader.isVisible() || await devModeBtn.isVisible()) {
      console.log('Login screen detected.');
      if (await devModeBtn.isVisible()) {
        console.log('Clicking Dev Mode...');
        await devModeBtn.click();
      } else {
        // Try standard login if Dev Mode is missing (just in case)
        console.log('Standard login fallback...');
        await page.fill('input[type="email"]', 'demo@jun.ai');
        await page.fill('input[type="password"]', 'demo123');
        await page.click('button:has-text("登入")');
      }
    } else {
      console.log('Already logged in or dashboard visible.');
    }

    // Wait for dashboard main container
    await page.waitForSelector('main', { timeout: 30000 });
  });

  const services = [
    // Core Control
    { name: '便當儀表板', urlPart: 'bento_dashboard' },
    { name: '神經實驗室', urlPart: 'agent_training' },
    { name: '奧秘數位分身', urlPart: 'digital_twin' },

    // Governance
    { name: '市場脈動', urlPart: 'market_intelligence' },
    { name: '報告中心', urlPart: 'report_gen_v2' },
    { name: '風險監測', urlPart: 'compliance_risk' },

    // Collaboration
    { name: '永續村莊', urlPart: 'esg_go_game' },
  ];

  for (const service of services) {
    test(`Should load service: ${service.name}`, async ({ page }) => {
      console.log(`Testing service: ${service.name}`);

      // Locate nav item
      const navItem = page.getByRole('button', { name: service.name }).first();

      // Check if visible
      if (!(await navItem.isVisible())) {
        console.log(`Nav item "${service.name}" not visible.`);
      }

      await navItem.click();

      // Verify URL
      await expect(page).toHaveURL(new RegExp(service.urlPart), { timeout: 15000 });
      console.log(`Verified URL for ${service.name}`);
    });
  }
});
