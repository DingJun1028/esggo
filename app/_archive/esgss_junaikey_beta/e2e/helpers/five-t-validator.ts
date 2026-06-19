/**
 * 🔍 5T 協議驗證輔助工具
 * 5T Protocol Validation Helper for E2E Tests
 * 
 * 用於在 Playwright 測試中驗證每個接觸點是否符合 5T 協議
 */

import { Page, expect } from '@playwright/test';
import { FiveTCheckpoint } from '../../../src/types/customer-journey';

/**
 * 驗證頁面是否符合 5T 協議要求
 * 
 * @param page - Playwright Page 物件
 * @param expected - 預期的 5T 合規狀態
 */
export async function validateFiveT(
    page: Page,
    expected: FiveTCheckpoint
): Promise<void> {
    // ===== 1. Tangible (可感知) =====
    if (expected.tangible) {
        // 驗證是否有視覺化反饋元素
        const hasVisualFeedback = await page.locator('[data-testid="impact-visual"], .impact-score, .carbon-chart, canvas').count();
        expect(hasVisualFeedback).toBeGreaterThan(0);

        // 確保有具體的數值或圖表顯示
        const hasConcreteMetrics = await page.locator('text=/\\d+(\\.\\d+)?\\s*(公噸|kg|%|分)/').count();
        expect(hasConcreteMetrics).toBeGreaterThan(0);
    }

    // ===== 2. Traceable (可溯源) =====
    if (expected.traceable) {
        // 驗證數據來源標註
        const hasSourceAttribution = await page.locator('[data-source-id], [data-source-origin]').count();
        expect(hasSourceAttribution).toBeGreaterThan(0);

        // 可選：驗證來源 ID 格式
        const sourceId = await page.getAttribute('[data-source-id]', 'data-source-id');
        if (sourceId) {
            expect(sourceId).toBeTruthy();
            expect(sourceId.length).toBeGreaterThan(0);
        }
    }

    // ===== 3. Trackable (可追蹤) =====
    if (expected.trackable) {
        // 驗證時間戳記錄
        const hasTimestamp = await page.locator('[data-timestamp], [data-created-at]').count();
        expect(hasTimestamp).toBeGreaterThan(0);

        // 驗證時間戳格式（ISO 8601）
        const timestamp = await page.getAttribute('[data-timestamp]', 'data-timestamp');
        if (timestamp) {
            const date = new Date(timestamp);
            expect(date).toBeInstanceOf(Date);
            expect(date.toString()).not.toBe('Invalid Date');
        }
    }

    // ===== 4. Transparent (可驗算) =====
    if (expected.transparent) {
        // 驗證計算公式揭露
        const hasFormulaDisclosure = await page.locator('[data-formula], .formula-display, button:has-text("查看計算公式")').count();
        expect(hasFormulaDisclosure).toBeGreaterThan(0);

        // 可選：點擊公式按鈕並驗證顯示
        const formulaButton = page.locator('button:has-text("查看計算公式"), button[aria-label*="公式"]').first();
        if (await formulaButton.isVisible()) {
            await formulaButton.click();
            await expect(page.locator('.formula-modal, .formula-tooltip, [role="dialog"]')).toBeVisible();
        }
    }

    // ===== 5. Trustworthy (不可篡改) =====
    if (expected.trustworthy) {
        // 驗證 Hash Lock（SHA-256）
        const hashElement = await page.locator('[data-hash], [data-evidence-hash]').first();
        if (await hashElement.count() > 0) {
            const hash = await hashElement.getAttribute('data-hash') || await hashElement.getAttribute('data-evidence-hash');

            // 驗證 Hash 格式（64 個十六進位字元）
            expect(hash).toMatch(/^[a-f0-9]{64}$/);
        }

        // 驗證不可篡改狀態標記
        const hasImmutableMarker = await page.locator('[data-immutable="true"], .locked-status, .trustworthy-badge').count();
        expect(hasImmutableMarker).toBeGreaterThan(0);
    }
}

/**
 * 驗證證據物件的完整 5T 合規
 * 
 * @param page - Playwright Page 物件
 * @param evidenceUuid - 證據 UUID
 */
export async function validateEvidenceFullCompliance(
    page: Page,
    evidenceUuid: string
): Promise<void> {
    await page.goto(`/evidence/${evidenceUuid}`);

    // 等待證據頁面載入
    await expect(page.locator('h1:has-text("證據驗證")')).toBeVisible();

    // 驗證所有 5T 指標都顯示為已驗證
    const fiveTIndicators = [
        'tangible',
        'traceable',
        'trackable',
        'transparent',
        'trustworthy'
    ];

    for (const indicator of fiveTIndicators) {
        const element = page.locator(`[data-5t="${indicator}"]`);
        await expect(element).toBeVisible();
        await expect(element).toHaveClass(/verified|passed|success/);
    }

    // 驗證整體狀態為「已驗證」
    await expect(page.locator('.verification-result:has-text("驗證通過"), .verification-result:has-text("Verified")')).toBeVisible();
}

/**
 * 驗證知識資產是否已正確記錄
 * 
 * @param page - Playwright Page 物件
 * @param expectedAssets - 預期獲得的知識資產列表
 */
export async function validateKnowledgeAssets(
    page: Page,
    expectedAssets: string[]
): Promise<void> {
    await page.goto('/profile/knowledge-assets');

    // 確保頁面載入
    await expect(page.locator('h1, h2').filter({ hasText: /知識資產|Knowledge Assets/ })).toBeVisible();

    // 驗證每個預期的資產都存在
    for (const asset of expectedAssets) {
        const assetElement = page.locator(`.asset-card, .knowledge-item`).filter({ hasText: asset });
        await expect(assetElement).toBeVisible();
    }
}

/**
 * 驗證學習進度是否正確追蹤
 * 
 * @param page - Playwright Page 物件
 * @param serviceId - 服務 ID
 * @param expectedProgress - 預期進度（0-100）
 */
export async function validateLearningProgress(
    page: Page,
    serviceId: string,
    expectedProgress: number
): Promise<void> {
    await page.goto('/profile/learning-progress');

    // 找到對應服務的進度條
    const progressBar = page.locator(`[data-service-id="${serviceId}"] .progress-bar, [data-service="${serviceId}"] progress`);
    await expect(progressBar).toBeVisible();

    // 驗證進度值
    const actualProgress = await progressBar.getAttribute('aria-valuenow') || await progressBar.getAttribute('value');
    const progressValue = parseInt(actualProgress || '0', 10);

    // 允許 ±5% 的誤差範圍
    expect(progressValue).toBeGreaterThanOrEqual(expectedProgress - 5);
    expect(progressValue).toBeLessThanOrEqual(expectedProgress + 5);
}
