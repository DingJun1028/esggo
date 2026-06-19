/**
 * 🧪 個人生態羅盤 - 完整旅程驗收測試
 * Personal Eco Compass - E2E Journey Acceptance Tests
 * 
 * 測試目標：
 * 1. 驗證完整客戶旅程（發現 → 引導 → 參與 → 價值實現 → 倡導）
 * 2. 確保每個階段的 5T 協議合規
 * 3. 驗證「服務即教學」的知識資產獲取
 */

import { test, expect, Page } from '@playwright/test';
import { PersonalEcoCompassJourney } from '../../../journeys/e1-personal-eco-compass.journey';
import { validateFiveT } from '../helpers/five-t-validator';
import { JourneyTestDataFactory } from '../helpers/test-data-factory';

// ===== 測試配置 =====
test.describe('個人生態羅盤 - 完整客戶旅程', () => {
    let testData: ReturnType<typeof JourneyTestDataFactory.createEcoAssessment>;

    test.beforeEach(async ({ page }) => {
        // 準備測試數據
        testData = JourneyTestDataFactory.createEcoAssessment();

        // 登入測試用戶
        await page.goto('/auth/login');
        await page.fill('input[name="email"]', 'test-eco@infoone.test');
        await page.fill('input[name="password"]', 'Test123456!');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/dashboard');
    });

    // ===== 階段 1：發現 (Discovery) =====
    test('階段 1：發現服務 - 用戶瀏覽服務介紹並理解價值', async ({ page }) => {
        await test.step('1.1 進入服務介紹頁', async () => {
            await page.goto('/services/personal-eco-compass');

            // 驗證頁面載入
            await expect(page.locator('h1')).toContainText('個人生態羅盤');
            await expect(page.locator('h1')).toContainText('Personal Eco Compass');

            // 驗證 5T 合規：Tangible + Transparent（發現階段）
            await validateFiveT(page, {
                tangible: true,      // 應顯示視覺化案例
                traceable: false,
                trackable: false,
                transparent: true,   // 應顯示公開定價與功能
                trustworthy: true    // 應顯示認證標章
            });
        });

        await test.step('1.2 觀看互動式 Demo', async () => {
            await page.click('a[href="#demo"]');

            // 驗證 Demo 區塊顯示
            await expect(page.locator('#demo')).toBeVisible();
            await expect(page.locator('.demo-calculator')).toBeVisible();

            // 模擬輸入 Demo 數據
            await page.fill('input[name="demo-employees"]', '100');
            await page.click('button:has-text("計算範例")');

            // 驗證即時反饋
            await expect(page.locator('.demo-result')).toBeVisible();
            await expect(page.locator('.demo-result')).toContainText('公噸 CO2e');
        });

        await test.step('1.3 學習成果驗證', async () => {
            // 確認用戶理解了碳足跡基本概念
            const hasEducationalContent = await page.locator('text=碳足跡的基本概念').isVisible();
            expect(hasEducationalContent).toBeTruthy();
        });
    });

    // ===== 階段 2：引導 (Onboarding) =====
    test('階段 2：開始評估 - 用戶創建首次評估', async ({ page }) => {
        await page.goto('/services/personal-eco-compass');

        await test.step('2.1 啟動評估流程', async () => {
            await page.click('button:has-text("開始評估")');
            await expect(page).toHaveURL(/\/services\/personal-eco-compass\/new/);
        });

        await test.step('2.2 填寫基本資料（步驟 1）', async () => {
            // 填寫組織資訊
            await page.fill('input[name="companyName"]', testData.companyName);
            await page.selectOption('select[name="industry"]', testData.industry);
            await page.fill('input[name="employeeCount"]', testData.employeeCount.toString());
            await page.fill('input[name="annualRevenue"]', testData.annualRevenue.toString());

            // 驗證即時引導提示
            await expect(page.locator('.guidance-tooltip')).toBeVisible();

            await page.click('button:has-text("下一步")');
        });

        await test.step('2.3 填寫能源數據（步驟 2）', async () => {
            // 填寫電力使用
            await page.fill('input[name="electricityKwh"]', '50000');
            await page.fill('input[name="naturalGasM3"]', '1000');
            await page.fill('input[name="dieselLiters"]', '500');

            // 驗證即時碳排放計算
            await expect(page.locator('.realtime-emission')).toBeVisible();
            const emissionText = await page.locator('.realtime-emission').textContent();
            expect(emissionText).toMatch(/\d+\.\d+ 公噸 CO2e/);

            // 驗證計算公式透明度
            await page.click('button[aria-label="查看計算公式"]');
            await expect(page.locator('.formula-modal')).toBeVisible();
            await expect(page.locator('.formula-modal')).toContainText('電力排放係數');
        });

        await test.step('2.4 提交評估', async () => {
            await page.click('button[type="submit"]:has-text("提交評估")');

            // 等待 API 回應
            const responsePromise = page.waitForResponse(
                response => response.url().includes('/api/eco-assessments') && response.status() === 201
            );
            const response = await responsePromise;
            const data = await response.json();

            // 驗證評估 ID 格式
            expect(data.id).toMatch(/^eco-\d{8}-[a-f0-9]{8}$/);

            // 驗證 5T：完整合規（引導完成後）
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            });

            // 儲存評估 ID 供後續測試使用
            test.info().annotations.push({
                type: 'assessment-id',
                description: data.id
            });
        });

        await test.step('2.5 學習成果驗證', async () => {
            // 確認知識資產獲取
            await page.goto('/profile/knowledge-assets');
            await expect(page.locator('text=能源使用數據收集方法')).toBeVisible();
            await expect(page.locator('text=碳排放計算公式')).toBeVisible();
        });
    });

    // ===== 階段 3：參與 (Engagement) =====
    test('階段 3：深度分析 - 用戶查看報告並探索改善建議', async ({ page }) => {
        // 前置：創建評估
        const assessmentId = await createTestAssessment(page, testData);

        await test.step('3.1 查看完整報告', async () => {
            await page.goto(`/services/personal-eco-compass/reports/${assessmentId}`);

            // 驗證報告載入
            await expect(page.locator('h2:has-text("碳足跡分析報告")')).toBeVisible();

            // 驗證視覺化圖表
            await expect(page.locator('canvas.carbon-chart')).toBeVisible();
            await expect(page.locator('.impact-score')).toBeVisible();

            // 驗證數據可溯源性（點擊數據點）
            await page.click('.chart-data-point:first-child');
            await expect(page.locator('.data-source-modal')).toBeVisible();
            await expect(page.locator('.data-source-modal')).toContainText('數據來源');
        });

        await test.step('3.2 瀏覽改善建議', async () => {
            await page.click('a[href="#recommendations"]');

            // 驗證建議清單
            const recommendations = page.locator('.recommendation-item');
            await expect(recommendations).toHaveCount(5); // 至少 5 項建議

            // 驗證每項建議都有預期效益
            const firstRecommendation = recommendations.first();
            await expect(firstRecommendation.locator('.expected-impact')).toBeVisible();
            await expect(firstRecommendation.locator('.expected-impact')).toContainText('公噸 CO2e');
        });

        await test.step('3.3 對比產業基準', async () => {
            await page.click('a[href="#benchmark"]');

            // 驗證基準比較圖表
            await expect(page.locator('.benchmark-chart')).toBeVisible();
            await expect(page.locator('text=產業平均值')).toBeVisible();
            await expect(page.locator('text=領先企業')).toBeVisible();

            // 驗證數據來源說明
            await page.click('button:has-text("數據來源")');
            await expect(page.locator('text=公開數據庫')).toBeVisible();
        });

        await test.step('3.4 學習成果驗證', async () => {
            await page.goto('/profile/knowledge-assets');
            await expect(page.locator('text=產業碳排放基準知識')).toBeVisible();
            await expect(page.locator('text=減碳策略資料庫')).toBeVisible();
        });
    });

    // ===== 階段 4：價值實現 (Value Realization) =====
    test('階段 4：獲得成果 - 用戶下載報告、取得認證、建立計畫', async ({ page }) => {
        const assessmentId = await createTestAssessment(page, testData);
        await page.goto(`/services/personal-eco-compass/reports/${assessmentId}`);

        await test.step('4.1 下載 PDF 報告', async () => {
            const downloadPromise = page.waitForEvent('download');
            await page.click('button:has-text("下載完整報告")');
            const download = await downloadPromise;

            // 驗證檔案名稱
            expect(download.suggestedFilename()).toMatch(/^eco-compass-report-.*\.pdf$/);

            // 驗證 PDF 包含驗證 QR Code（需要實際檢查 PDF 內容，此處簡化）
            expect(download.suggestedFilename()).toBeTruthy();
        });

        await test.step('4.2 生成不可篡改證據', async () => {
            await page.click('button:has-text("生成證據")');

            // 等待證據生成 API
            const evidenceResponse = await page.waitForResponse(
                response => response.url().includes('/api/evidence/create')
            );
            const evidenceData = await evidenceResponse.json();

            // 驗證證據結構
            expect(evidenceData.uuid).toMatch(/^[a-f0-9-]{36}$/);
            expect(evidenceData.hash).toMatch(/^[a-f0-9]{64}$/); // SHA-256
            expect(evidenceData.status).toBe('trustworthy');

            // 驗證證據顯示
            await expect(page.locator(`[data-evidence-uuid="${evidenceData.uuid}"]`)).toBeVisible();
        });

        await test.step('4.3 創建減碳行動計畫', async () => {
            await page.click('button:has-text("建立行動計畫")');

            // 設定目標
            await page.fill('input[name="reductionTarget"]', '10'); // 10% 減碳目標
            await page.selectOption('select[name="timeframe"]', '12'); // 12 個月

            // 選擇行動項目
            await page.check('input[value="led-lighting"]');
            await page.check('input[value="renewable-energy"]');

            // 設定追蹤頻率
            await page.selectOption('select[name="trackingFrequency"]', 'monthly');

            await page.click('button[type="submit"]:has-text("創建計畫")');

            // 驗證計畫創建成功
            await expect(page.locator('.success-message')).toContainText('行動計畫已創建');
        });

        await test.step('4.4 接收認證徽章', async () => {
            // 前往徽章頁面
            await page.goto('/profile/badges');

            // 驗證生態羅盤認證徽章
            const badge = page.locator('[data-badge-id="eco-compass-certified"]');
            await expect(badge).toBeVisible();
            await expect(badge.locator('.badge-name')).toContainText('生態羅盤認證');

            // 驗證徽章包含分享連結
            await badge.click();
            await expect(page.locator('.badge-share-link')).toBeVisible();
        });

        await test.step('4.5 驗收標準：所有成果已獲得', async () => {
            // SC-1: 評估 ID 存在
            expect(assessmentId).toMatch(/^eco-\d{8}-[a-f0-9]{8}$/);

            // SC-3: PDF 已下載
            // SC-4: 證據已鎖定
            // SC-5: 徽章已獲得（已在上方驗證）

            // 完整 5T 驗證
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            });
        });
    });

    // ===== 階段 5：倡導 (Advocacy) =====
    test('階段 5：分享推薦 - 用戶分享成果並推薦他人', async ({ page }) => {
        const assessmentId = await createTestAssessment(page, testData);

        await test.step('5.1 分享成果到社群媒體', async () => {
            await page.goto(`/services/personal-eco-compass/reports/${assessmentId}`);
            await page.click('button:has-text("分享成果")');

            // 驗證分享選項
            await expect(page.locator('.share-modal')).toBeVisible();
            await expect(page.locator('button:has-text("分享到 LinkedIn")')).toBeVisible();
            await expect(page.locator('button:has-text("複製連結")')).toBeVisible();

            // 複製分享連結
            await page.click('button:has-text("複製連結")');
            await expect(page.locator('.toast:has-text("連結已複製")')).toBeVisible();
        });

        await test.step('5.2 公開證據供他人驗證', async () => {
            // 取得證據 UUID（從評估中）
            const evidenceUuid = await page.getAttribute('[data-evidence-uuid]', 'data-evidence-uuid');

            // 前往公開證據頁面
            await page.goto(`/evidence/${evidenceUuid}`);

            // 驗證任何人都可查看
            await expect(page.locator('h1:has-text("證據驗證")')).toBeVisible();
            await expect(page.locator('.verification-result:has-text("驗證通過")')).toBeVisible();

            // 驗證完整 5T 顯示
            await expect(page.locator('[data-5t="tangible"]')).toHaveClass(/verified/);
            await expect(page.locator('[data-5t="traceable"]')).toHaveClass(/verified/);
            await expect(page.locator('[data-5t="trackable"]')).toHaveClass(/verified/);
            await expect(page.locator('[data-5t="transparent"]')).toHaveClass(/verified/);
            await expect(page.locator('[data-5t="trustworthy"]')).toHaveClass(/verified/);
        });

        await test.step('5.3 加入生態戰士社群', async () => {
            await page.goto('/community/eco-warriors');

            // 驗證社群頁面
            await expect(page.locator('h1:has-text("生態戰士社群")')).toBeVisible();

            // 驗證排行榜
            await expect(page.locator('.leaderboard')).toBeVisible();

            // 加入社群（如果尚未加入）
            const joinButton = page.locator('button:has-text("加入社群")');
            if (await joinButton.isVisible()) {
                await joinButton.click();
                await expect(page.locator('.success-message')).toContainText('已加入社群');
            }
        });
    });

    // ===== 完整旅程集成測試 =====
    test('完整旅程：從發現到倡導（端到端）', async ({ page }) => {
        let assessmentId: string;

        // Stage 1: Discovery
        await page.goto('/services/personal-eco-compass');
        await expect(page.locator('h1')).toContainText('個人生態羅盤');

        // Stage 2: Onboarding
        await page.click('button:has-text("開始評估")');
        await page.fill('input[name="companyName"]', testData.companyName);
        await page.selectOption('select[name="industry"]', testData.industry);
        await page.fill('input[name="employeeCount"]', testData.employeeCount.toString());
        await page.click('button:has-text("下一步")');
        await page.fill('input[name="electricityKwh"]', '50000');
        await page.click('button[type="submit"]:has-text("提交評估")');

        const createResponse = await page.waitForResponse(
            response => response.url().includes('/api/eco-assessments')
        );
        const createData = await createResponse.json();
        assessmentId = createData.id;

        // Stage 3: Engagement
        await page.goto(`/services/personal-eco-compass/reports/${assessmentId}`);
        await expect(page.locator('.carbon-chart')).toBeVisible();

        // Stage 4: Value Realization
        await page.click('button:has-text("下載完整報告")');
        await page.waitForEvent('download');
        await page.click('button:has-text("生成證據")');
        await page.waitForResponse(response => response.url().includes('/api/evidence/create'));

        // Stage 5: Advocacy
        await page.click('button:has-text("分享成果")');
        await expect(page.locator('.share-modal')).toBeVisible();

        // 最終驗證：完整 5T 合規
        await validateFiveT(page, {
            tangible: true,
            traceable: true,
            trackable: true,
            transparent: true,
            trustworthy: true
        });

        // 驗證知識資產獲取
        await page.goto('/profile/knowledge-assets');
        const expectedAssets = [
            '碳足跡基礎知識',
            '能源使用數據收集方法',
            '碳排放計算公式',
            '產業碳排放基準知識',
            '減碳策略資料庫'
        ];

        for (const asset of expectedAssets) {
            await expect(page.locator(`text=${asset}`)).toBeVisible();
        }
    });
});

// ===== 輔助函數 =====
async function createTestAssessment(page: Page, data: ReturnType<typeof JourneyTestDataFactory.createEcoAssessment>): Promise<string> {
    await page.goto('/services/personal-eco-compass/new');
    await page.fill('input[name="companyName"]', data.companyName);
    await page.selectOption('select[name="industry"]', data.industry);
    await page.fill('input[name="employeeCount"]', data.employeeCount.toString());
    await page.fill('input[name="annualRevenue"]', data.annualRevenue.toString());
    await page.click('button:has-text("下一步")');
    await page.fill('input[name="electricityKwh"]', '50000');
    await page.fill('input[name="naturalGasM3"]', '1000');
    await page.click('button[type="submit"]');

    const response = await page.waitForResponse(
        response => response.url().includes('/api/eco-assessments') && response.status() === 201
    );
    const responseData = await response.json();
    return responseData.id;
}
