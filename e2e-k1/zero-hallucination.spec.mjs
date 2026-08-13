// e2e-k1/zero-hallucination.spec.mjs
// EdgeResearch exp-k1: freeze metric = 提交 >500% 暴增後，點 Seal 出現琥珀橫幅含「【Dr. Thoth 零幻覺警告】」
import { test, expect } from '@playwright/test';

const BASE = process.env.E2E_BASE || 'http://localhost:3000';

test('K1 零幻覺警告：提交 >500% 暴增 → 出現 Dr.Thoth 警告橫幅', async ({ page }) => {
  await page.goto(`${BASE}/omni/reports/mod-env-carbon-0001/edit`, { waitUntil: 'networkidle' });

  // 填寫欄位（依 placeholder 定位，因 input 無 aria-label）
  const inputs = page.locator('input[type="number"]');
  await inputs.nth(0).fill('1000');   // previousYearUsage
  await inputs.nth(1).fill('10000');  // currentYearUsage (>500% 暴增)
  await inputs.nth(2).fill('0.495');  // gridEmissionFactor

  // 凍結指標：真實 click Seal 鈕
  await page.getByRole('button', { name: /提交永恆刻印/ }).click();

  // 等待主警告橫幅渲染（最多 3s）— 精確匹配底部主橫幅
  const banner = page.getByText(/【Dr\. Thoth 零幻覺警告】數據未通過果因引擎驗算/);
  await expect(banner).toBeVisible({ timeout: 3000 });

  // 輔助測量：欄位錯誤高亮（currentYearUsage 下的琥珀提示）
  const fieldErr = page.getByText(/當期數據 \(10000/);
  await expect(fieldErr).toBeVisible({ timeout: 3000 });

  await page.screenshot({ path: 'runs/exp-k1-zero-hallucination/banner-proof.png' });
  console.log('PASS: 零幻覺警告橫幅出現');
});
