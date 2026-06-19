/**
 * 🧮 碳足跡計算器 - E2E 驗收測試
 * Carbon Calculator - End-to-End Acceptance Tests
 * 
 * 測試涵蓋：
 * - 完整客戶旅程 5 個階段
 * - GHG Protocol Scope 1/2/3 計算驗證
 * - ISO 14064 報告生成
 * - SBTi 減碳目標設定
 * - 5T 協議全面合規
 */

import { test, expect } from '@playwright/test';
import { validateFiveT, validateKnowledgeAssets } from '../../helpers/five-t-validator';
import { JourneyTestDataFactory } from '../../helpers/test-data-factory';

test.describe('碳足跡計算器 - 完整客戶旅程', () => {
    let testUser: ReturnType<typeof JourneyTestDataFactory.createUser>;
    let calculationId: string;

    test.beforeEach(async ({ page }) => {
        testUser = JourneyTestDataFactory.createUser('corporate');

        // 登入系統
        await page.goto('/login');
        await page.fill('input[name="email"]', testUser.email);
        await page.fill('input[name="password"]', testUser.password);
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');
    });

    // ===== 階段 1：發現 =====
    test('階段1：了解碳計算 - 探索功能與標準', async ({ page }) => {
        await test.step('導航至碳計算器頁面', async () => {
            await page.goto('/services/carbon-calculator');
            await expect(page.locator('h1:has-text("碳足跡計算器")')).toBeVisible();
        });

        await test.step('查看 GHG Protocol 標準說明', async () => {
            const ghgSection = page.locator('.ghg-protocol-intro');
            await expect(ghgSection).toBeVisible();
            await expect(ghgSection).toContainText('Scope 1');
            await expect(ghgSection).toContainText('Scope 2');
            await expect(ghgSection).toContainText('Scope 3');
        });

        await test.step('瀏覽排放係數資料庫', async () => {
            await page.click('a[href="#emission-factors"]');

            const factorsTable = page.locator('.emission-factors-table');
            await expect(factorsTable).toBeVisible();

            // 驗證係數來源標註（Traceable）
            const sourceAttribution = await page.locator('[data-source-id]').count();
            expect(sourceAttribution).toBeGreaterThan(0);
        });

        await test.step('5T 驗證：發現階段', async () => {
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: false,
                transparent: true,
                trustworthy: true
            });
        });
    });

    // ===== 階段 2：引導 =====
    test('階段2：開始計算 - 首次碳排放計算', async ({ page }) => {
        const carbonData = JourneyTestDataFactory.createCarbonCalculation();

        await test.step('導航至新增計算頁面', async () => {
            await page.goto('/services/carbon-calculator/new');
            await expect(page.locator('h2:has-text("新增碳排放計算")')).toBeVisible();
        });

        await test.step('選擇活動類型', async () => {
            await page.selectOption('select[name="activityType"]', carbonData.activityType);

            // 等待對應表單載入
            await page.waitForSelector('.activity-input-form', { state: 'visible' });
        });

        await test.step('輸入活動數據', async () => {
            await page.fill('input[name="quantity"]', carbonData.quantity.toString());
            await page.selectOption('select[name="unit"]', carbonData.unit);
            await page.selectOption('select[name="period"]', carbonData.period);

            // 驗證即時預估顯示（Tangible）
            const estimateDisplay = page.locator('.emission-estimate');
            await expect(estimateDisplay).toBeVisible();
            await expect(estimateDisplay).toContainText(/\d+(\.\d+)?\s*公噸/);
        });

        await test.step('提交計算請求', async () => {
            await page.click('button:has-text("計算碳排放")');

            // 等待 API 返回
            const response = await page.waitForResponse(
                resp => resp.url().includes('/api/carbon-calculations') && resp.request().method() === 'POST'
            );

            const result = await response.json();
            expect(result.status).toBe('success');
            expect(result.data).toHaveProperty('calculationId');
            expect(result.data).toHaveProperty('totalEmission');
            expect(result.data).toHaveProperty('breakdown');

            calculationId = result.data.calculationId;

            // 驗證 Hash Lock（Trustworthy）
            expect(result.data).toHaveProperty('hash');
            expect(result.data.hash).toMatch(/^[a-f0-9]{64}$/);
        });

        await test.step('驗證計算結果頁面跳轉', async () => {
            await page.waitForURL(`/services/carbon-calculator/results/${calculationId}`);
            await expect(page.locator('.calculation-result-header')).toBeVisible();
        });

        await test.step('5T 驗證：引導階段', async () => {
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            });
        });
    });

    // ===== 階段 3：參與 =====
    test('階段3：深度分析 - 排放結構與情境比較', async ({ page }) => {
        // 先創建一個計算結果
        const calculationId = JourneyTestDataFactory.generateAssessmentId('carbon');

        await test.step('查看 Scope 分類圖表', async () => {
            await page.goto(`/services/carbon-calculator/results/${calculationId}`);

            // 驗證 Scope 1/2/3 分類（Tangible 視覺化）
            const scopeChart = page.locator('.scope-breakdown-chart, canvas');
            await expect(scopeChart).toBeVisible();

            // 驗證數據標籤
            await expect(page.locator('text=/Scope 1/')).toBeVisible();
            await expect(page.locator('text=/Scope 2/')).toBeVisible();
            await expect(page.locator('text=/Scope 3/')).toBeVisible();
        });

        await test.step('使用情境比較功能', async () => {
            await page.click('button:has-text("比較情境")');

            // 選擇多個計算進行比較
            await page.click('.calculation-selector >> nth=0');
            await page.click('.calculation-selector >> nth=1');

            await page.click('button:has-text("開始比較")');

            // 驗證並排顯示
            const comparisonView = page.locator('.comparison-view');
            await expect(comparisonView).toBeVisible();

            // 驗證差異百分比顯示
            await expect(page.locator('text=/%/')).toBeVisible();
        });

        await test.step('5T 驗證：參與階段', async () => {
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            });
        });
    });

    // ===== 階段 4：價值實現 =====
    test('階段4：獲得成果 - ISO 14064 報告與 SBTi 目標', async ({ page }) => {
        const calculationId = JourneyTestDataFactory.generateAssessmentId('carbon');

        await test.step('下載 ISO 14064 報告', async () => {
            await page.goto(`/services/carbon-calculator/results/${calculationId}`);

            const downloadPromise = page.waitForEvent('download');
            await page.click('button:has-text("下載報告")');

            const download = await downloadPromise;
            expect(download.suggestedFilename()).toMatch(/ISO_14064.*\.pdf$/);
        });

        await test.step('設定 SBTi 減碳目標', async () => {
            await page.click('a:has-text("設定減碳目標")');
            await page.waitForURL('/services/carbon-calculator/reduction-plan');

            // 選擇 1.5°C 情境
            await page.click('input[value="1.5C"]');

            // 設定目標年份
            await page.fill('input[name="targetYear"]', '2030');

            await page.click('button:has-text("生成減碳路徑")');

            // 驗證路徑圖生成
            const roadmap = page.locator('.reduction-roadmap');
            await expect(roadmap).toBeVisible();

            // 驗證符合 SBTi 標準
            await expect(page.locator('text=/SBTi 認證/i')).toBeVisible();
        });

        await test.step('驗證知識資產獲得', async () => {
            await validateKnowledgeAssets(page, [
                '碳計算專家徽章',
                '碳排放結構分析報告'
            ]);
        });

        await test.step('5T 驗證：價值實現階段', async () => {
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            });
        });
    });

    // ===== 階段 5：倡導 =====
    test('階段5：分享推廣 - 成為碳中和倡導者', async ({ page }) => {
        await test.step('生成分享卡片', async () => {
            await page.goto('/services/carbon-calculator/share');

            // 填寫承諾內容
            await page.fill('textarea[name="commitment"]', '承諾2030年達成碳中和');

            await page.click('button:has-text("生成卡片")');

            // 驗證卡片預覽
            const shareCard = page.locator('.share-card-preview');
            await expect(shareCard).toBeVisible();

            // 驗證包含5T標記
            await expect(shareCard.locator('[data-5t-verified]')).toBeVisible();
        });

        await test.step('下載社群媒體素材', async () => {
            const downloadPromise = page.waitForEvent('download');
            await page.click('button:has-text("下載圖片")');

            const download = await downloadPromise;
            expect(download.suggestedFilename()).toMatch(/carbon_commitment.*\.(png|jpg)$/);
        });
    });

    // ===== 端到端整合測試 =====
    test('端到端：完整旅程整合驗證', async ({ page }) => {
        await test.step('從發現到倡導的完整流程', async () => {
            // 1. 發現
            await page.goto('/services/carbon-calculator');
            await page.click('button:has-text("開始計算")');

            // 2. 引導
            const carbonData = JourneyTestDataFactory.createCarbonCalculation();
            await page.selectOption('select[name="activityType"]', carbonData.activityType);
            await page.fill('input[name="quantity"]', carbonData.quantity.toString());
            await page.click('button:has-text("計算碳排放")');

            // 3. 參與
            await page.waitForSelector('.calculation-result-header');
            await page.click('button:has-text("查看詳細分析")');

            // 4. 價值實現
            await page.click('button:has-text("設定減碳目標")');
            await page.fill('input[name="targetYear"]', '2030');
            await page.click('button:has-text("生成減碳路徑")');

            // 5. 倡導
            await page.click('button:has-text("分享成果")');
            await expect(page.locator('.share-card-preview')).toBeVisible();
        });

        await test.step('驗證學習進度記錄', async () => {
            await page.goto('/profile/learning-progress');

            const carbonProgress = page.locator('[data-service="carbon-calculator"] .progress-value');
            const progressText = await carbonProgress.textContent();
            const progressValue = parseInt(progressText || '0', 10);

            expect(progressValue).toBeGreaterThanOrEqual(80);
        });
    });
});
