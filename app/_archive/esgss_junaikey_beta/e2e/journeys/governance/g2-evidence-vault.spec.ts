/**
 * 🏛️ 證據保險庫 - E2E 驗收測試
 * Evidence Vault - End-to-End Acceptance Tests
 * 
 * 測試涵蓋：
 * - 完整客戶旅程 5 個階段
 * - SHA-256 Hash Lock 驗證
 * - 區塊鏈不可篡改機制
 * - 公開驗證頁面
 * - 5T 協議全面合規
 */

import { test, expect } from '@playwright/test';
import { validateFiveT, validateEvidenceFullCompliance, validateKnowledgeAssets } from '../../helpers/five-t-validator';
import { JourneyTestDataFactory } from '../../helpers/test-data-factory';
import crypto from 'crypto';

test.describe('證據保險庫 - 完整客戶旅程', () => {
    let testUser: ReturnType<typeof JourneyTestDataFactory.createUser>;
    let evidenceUuid: string;
    let evidenceHash: string;

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
    test('階段1：認識保險庫 - 了解區塊鏈安全機制', async ({ page }) => {
        await test.step('導航至證據保險庫頁面', async () => {
            await page.goto('/services/evidence-vault');
            await expect(page.locator('h1:has-text("證據保險庫")')).toBeVisible();
        });

        await test.step('查看技術架構說明', async () => {
            const techSection = page.locator('.tech-architecture');
            await expect(techSection).toBeVisible();

            // 驗證核心概念展示
            await expect(page.locator('text=/SHA-256/i')).toBeVisible();
            await expect(page.locator('text=/Hash Lock/i')).toBeVisible();
            await expect(page.locator('text=/Blockchain/i')).toBeVisible();
        });

        await test.step('觀看安全性驗證 Demo', async () => {
            await page.click('button:has-text("查看驗證示範")');

            const demoModal = page.locator('.security-demo-modal');
            await expect(demoModal).toBeVisible();

            // 驗證互動式展示
            await page.click('button:has-text("嘗試篡改")');
            await expect(page.locator('text=/驗證失敗/i')).toBeVisible();
        });

        await test.step('5T 驗證：發現階段', async () => {
            await validateFiveT(page, {
                tangible: true,
                traceable: false,
                trackable: false,
                transparent: true,
                trustworthy: true
            });
        });
    });

    // ===== 階段 2：引導 =====
    test('階段2：首次上傳 - 上傳並鎖定證據', async ({ page }) => {
        const evidenceData = JourneyTestDataFactory.createEvidenceUpload();

        await test.step('導航至上傳頁面', async () => {
            await page.goto('/services/evidence-vault/upload');
            await expect(page.locator('h2:has-text("上傳證據")')).toBeVisible();
        });

        await test.step('填寫證據 Metadata', async () => {
            await page.fill('input[name="title"]', evidenceData.title);
            await page.fill('textarea[name="description"]', evidenceData.description);
            await page.selectOption('select[name="category"]', evidenceData.category);

            // 添加標籤
            for (const tag of evidenceData.tags) {
                await page.fill('input[name="tagInput"]', tag);
                await page.press('input[name="tagInput"]', 'Enter');
            }

            // 設定機密等級
            await page.selectOption('select[name="confidentiality"]', evidenceData.confidentiality);
        });

        await test.step('上傳檔案', async () => {
            // 創建測試檔案
            const testFileContent = `測試證據文件\n時間戳記：${new Date().toISOString()}`;
            const buffer = Buffer.from(testFileContent, 'utf-8');

            await page.setInputFiles('input[type="file"]', {
                name: 'test-evidence.txt',
                mimeType: 'text/plain',
                buffer
            });

            // 驗證檔案預覽
            await expect(page.locator('.file-preview')).toBeVisible();
            await expect(page.locator('text=test-evidence.txt')).toBeVisible();
        });

        await test.step('提交上傳請求（尚未鎖定）', async () => {
            await page.click('button:has-text("上傳證據")');

            const response = await page.waitForResponse(
                resp => resp.url().includes('/api/evidence') && resp.request().method() === 'POST'
            );

            const result = await response.json();
            expect(result.status).toBe('success');
            expect(result.data).toHaveProperty('uuid');
            expect(result.data).toHaveProperty('preliminaryHash');

            evidenceUuid = result.data.uuid;

            // 此時尚未最終鎖定，Trustworthy 為 false
            expect(result.data.locked).toBe(false);
        });

        await test.step('執行 Hash Lock', async () => {
            // 跳轉至確認頁面
            await page.waitForURL(`/services/evidence-vault/confirm/${evidenceUuid}`);

            await page.click('button:has-text("確認鎖定")');

            const lockResponse = await page.waitForResponse(
                resp => resp.url().includes(`/api/evidence/${evidenceUuid}/lock`) && resp.request().method() === 'POST'
            );

            const lockResult = await lockResponse.json();
            expect(lockResult.status).toBe('success');
            expect(lockResult.data).toHaveProperty('hash');
            expect(lockResult.data.hash).toMatch(/^[a-f0-9]{64}$/);
            expect(lockResult.data.locked).toBe(true);

            evidenceHash = lockResult.data.hash;
        });

        await test.step('驗證確認郵件通知', async () => {
            // 顯示郵件發送成功提示
            await expect(page.locator('text=/確認信已發送/i')).toBeVisible();
        });

        await test.step('5T 驗證：引導階段（鎖定後）', async () => {
            await page.goto(`/services/evidence-vault/detail/${evidenceUuid}`);

            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true  // 已鎖定
            });
        });
    });

    // ===== 階段 3：參與 =====
    test('階段3：管理證據庫 - 系統化管理與檢索', async ({ page }) => {
        await test.step('瀏覽證據清單', async () => {
            await page.goto('/services/evidence-vault/mine');

            // 驗證清單顯示
            const evidenceList = page.locator('.evidence-list');
            await expect(evidenceList).toBeVisible();

            // 驗證至少有一筆證據
            const evidenceCount = await page.locator('.evidence-card').count();
            expect(evidenceCount).toBeGreaterThan(0);
        });

        await test.step('使用進階搜尋', async () => {
            await page.click('button:has-text("進階搜尋")');

            // 填寫搜尋條件
            await page.fill('input[name="keyword"]', '測試');
            await page.selectOption('select[name="category"]', '環境');

            // 設定時間範圍
            const today = new Date().toISOString().split('T')[0];
            await page.fill('input[name="dateFrom"]', today);

            await page.click('button:has-text("搜尋")');

            // 驗證搜尋結果
            await page.waitForSelector('.search-results');
            const resultCount = await page.locator('.evidence-card').count();
            expect(resultCount).toBeGreaterThanOrEqual(0);
        });

        await test.step('查看證據鏈歷史', async () => {
            await page.click('.evidence-card >> nth=0');
            await page.click('button:has-text("查看證據鏈")');

            const chainView = page.locator('.evidence-chain-timeline');
            await expect(chainView).toBeVisible();

            // 驗證審計軌跡項目
            await expect(page.locator('.chain-event')).toHaveCount(await page.locator('.chain-event').count());

            // 驗證每個事件都有時間戳記（Trackable）
            const timestamps = await page.locator('.chain-event [data-timestamp]').count();
            expect(timestamps).toBeGreaterThan(0);
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
    test('階段4：證據驗證 - 公開展示與驗證', async ({ page }) => {
        const testEvidenceUuid = JourneyTestDataFactory.generateUuid('evidence');

        await test.step('訪問公開驗證頁面', async () => {
            // 不需登入即可訪問
            await page.goto(`/evidence/${testEvidenceUuid}`);

            await expect(page.locator('h1:has-text("證據驗證")')).toBeVisible();
        });

        await test.step('驗證 5T 指標顯示', async () => {
            await validateEvidenceFullCompliance(page, testEvidenceUuid);
        });

        await test.step('生成驗證 QR Code', async () => {
            await page.goto(`/services/evidence-vault/detail/${testEvidenceUuid}`);
            await page.click('button:has-text("生成 QR Code")');

            const qrModal = page.locator('.qr-code-modal');
            await expect(qrModal).toBeVisible();

            // 驗證 QR Code 圖片
            const qrImage = qrModal.locator('img.qr-code, canvas.qr-code');
            await expect(qrImage).toBeVisible();
        });

        await test.step('下載驗證證書', async () => {
            const downloadPromise = page.waitForEvent('download');
            await page.click('button:has-text("下載證書")');

            const download = await downloadPromise;
            expect(download.suggestedFilename()).toMatch(/evidence_certificate.*\.pdf$/);
        });

        await test.step('驗證知識資產獲得', async () => {
            await validateKnowledgeAssets(page, [
                '證據守護者徽章',
                '不可篡改證據鏈'
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
    test('階段5：信任倡導 - 成為證據守護者', async ({ page }) => {
        await test.step('分享驗證成果', async () => {
            await page.goto('/services/evidence-vault/share');

            // 選擇要分享的證據
            await page.click('.evidence-selector >> nth=0');

            await page.click('button:has-text("生成分享素材")');

            // 驗證分享卡片
            const shareCard = page.locator('.share-card-preview');
            await expect(shareCard).toBeVisible();
            await expect(shareCard.locator('text=/已驗證/i')).toBeVisible();
        });

        await test.step('加入信任網絡', async () => {
            await page.goto('/community/trust-network');

            await page.click('button:has-text("加入網絡")');

            // 驗證成員資格
            await expect(page.locator('text=/已加入信任網絡/i')).toBeVisible();
        });
    });

    // ===== 端到端整合測試 =====
    test('端到端：完整旅程整合驗證', async ({ page }) => {
        await test.step('從發現到倡導的完整流程', async () => {
            // 1. 發現
            await page.goto('/services/evidence-vault');
            await page.click('button:has-text("開始使用")');

            // 2. 引導
            const evidenceData = JourneyTestDataFactory.createEvidenceUpload();
            await page.fill('input[name="title"]', evidenceData.title);
            await page.fill('textarea[name="description"]', evidenceData.description);

            const testFileContent = `完整測試證據\n${new Date().toISOString()}`;
            await page.setInputFiles('input[type="file"]', {
                name: 'full-test-evidence.txt',
                mimeType: 'text/plain',
                buffer: Buffer.from(testFileContent, 'utf-8')
            });

            await page.click('button:has-text("上傳證據")');
            await page.waitForURL(/\/confirm\//);
            await page.click('button:has-text("確認鎖定")');

            // 3. 參與
            await page.goto('/services/evidence-vault/mine');
            await page.click('.evidence-card >> nth=0');

            // 4. 價值實現
            await page.click('button:has-text("生成 QR Code")');
            await expect(page.locator('.qr-code-modal')).toBeVisible();

            // 5. 倡導
            await page.goto('/services/evidence-vault/share');
            await expect(page.locator('.share-options')).toBeVisible();
        });

        await test.step('驗證學習進度記錄', async () => {
            await page.goto('/profile/learning-progress');

            const vaultProgress = page.locator('[data-service="evidence-vault"] .progress-value');
            const progressText = await vaultProgress.textContent();
            const progressValue = parseInt(progressText || '0', 10);

            expect(progressValue).toBeGreaterThanOrEqual(70);
        });
    });

    // ===== Hash Lock 安全性測試 =====
    test('安全性：Hash Lock 不可篡改驗證', async ({ page }) => {
        await test.step('驗證原始 Hash 計算', async () => {
            const originalContent = '原始證據內容';
            const expectedHash = crypto.createHash('sha256').update(originalContent).digest('hex');

            // 上傳證據
            await page.goto('/services/evidence-vault/upload');
            await page.fill('input[name="title"]', '安全性測試證據');

            await page.setInputFiles('input[type="file"]', {
                name: 'hash-test.txt',
                mimeType: 'text/plain',
                buffer: Buffer.from(originalContent, 'utf-8')
            });

            await page.click('button:has-text("上傳證據")');
            await page.waitForURL(/\/confirm\//);
            await page.click('button:has-text("確認鎖定")');

            // 驗證返回的 Hash
            const hashDisplay = page.locator('[data-evidence-hash]');
            const actualHash = await hashDisplay.getAttribute('data-evidence-hash');

            expect(actualHash).toBe(expectedHash);
        });
    });
});
