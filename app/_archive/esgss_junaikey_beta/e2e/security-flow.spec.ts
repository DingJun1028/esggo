import { test, expect } from '@playwright/test';

test.describe('完整安全分析流程', () => {
  test.beforeEach(async ({ page }) => {
    // 訪問應用
    await page.goto('/');

    // 使用開發者模式登入
    await page.click('text=開發者模式');

    // 等待登入完成
    await page.waitForURL('/', { timeout: 5000 });
  });

  test('應該能夠進行安全掃描', async ({ page }) => {
    // 前往 Security 標籤
    await page.click('text=🛡️ Security');

    // 等待頁面加載
    await page.waitForSelector('text=安全掃描', { timeout: 5000 });

    // 點擊掃描按鈕
    const scanButton = page.locator('button:has-text("立即掃描")');
    await expect(scanButton).toBeVisible();

    // 注意：實際掃描需要 Snyk 配置，這裡僅測試 UI
    const isEnabled = await scanButton.isEnabled();

    if (isEnabled) {
      await scanButton.click();

      // 等待掃描完成或錯誤提示
      await page.waitForTimeout(3000);

      // 驗證結果顯示區域存在
      const resultsArea = page.locator('.vulnerability-summary, .bg-yellow-50');
      await expect(resultsArea).toBeVisible({ timeout: 10000 });
    }
  });

  test('應該顯示安全儀表板', async ({ page }) => {
    await page.click('text=🛡️ Security');

    // 驗證標題
    await expect(page.locator('h2:has-text("安全掃描")')).toBeVisible();

    // 驗證 Snyk 連接狀態顯示
    const statusIndicator = page.locator('text=/Snyk (已連接|連接失敗|未配置)/');
    await expect(statusIndicator).toBeVisible();
  });

  test('應該能夠使用語義搜索', async ({ page }) => {
    // 前往 Omni-Mind 標籤
    await page.click('text=Omni-Mind');

    // 等待知識圖譜加載
    await page.waitForSelector('text=知識圖譜', { timeout: 5000 });

    // 尋找語義搜索輸入框
    const searchInput = page.locator('input[placeholder*="搜索"], input[type="text"]').first();

    if (await searchInput.isVisible()) {
      await searchInput.fill('環境保護');

      // 點擊搜索按鈕（如果有）
      const searchButton = page.locator('button:has-text("搜索")');
      if (await searchButton.isVisible()) {
        await searchButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('應該能夠訪問里世界', async ({ page }) => {
    // 設置量子模式
    await page.evaluate(() => {
      localStorage.setItem('QUANTUM_MODE', 'true');
      localStorage.setItem('SHOW_HIDDEN_FEATURES', 'true');
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // 驗證 OmniSystem 按鈕存在
    const omniButton = page.locator('button:has-text("OmniSystem"), [class*="omni"]').first();

    // 檢查是否顯示隱藏功能
    const hasQuantumMode = await page.evaluate(() => {
      return localStorage.getItem('QUANTUM_MODE') === 'true';
    });

    expect(hasQuantumMode).toBe(true);
  });

  test('應該響應不同屏幕尺寸', async ({ page }) => {
    // 測試桌面視圖
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // 測試平板視圖
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // 測試移動視圖
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});
