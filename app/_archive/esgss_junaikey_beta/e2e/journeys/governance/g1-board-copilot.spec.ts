/**
 * 🎯 G1: Board Copilot - E2E Journey Tests
 * 董事會副駕駛 - 端到端客戶旅程測試
 * 
 * Test Coverage:
 * - Discovery stage (治理意識覺醒)
 * - Onboarding stage (董事會架構建置)
 * - Engagement stage (AI 輔助會議執行)
 * - Value Realization stage (治理成熟度認證)
 * - Advocacy stage (治理冠軍倡導)
 */

import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { BoardCopilotJourney } from '../../../journeys/g1-board-copilot.journey';
import { validateFiveT } from '../../helpers/five-t-validator';
import { JourneyTestDataFactory } from '../../helpers/test-data-factory';

test.describe('G1: Board Copilot - Complete Customer Journey', () => {
    let page: Page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        // 登入為企業用戶
        await page.goto('/auth/login');
        await page.fill('input[name="email"]', 'ceo@testcorp.com');
        await page.fill('input[name="password"]', 'SecurePass123!');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');
    });

    // ==================== 階段 1: Discovery ====================
    test('階段1：發現 - 探索 Board Copilot 價值主張', async () => {
        // Touchpoint 1: 服務介紹頁面
        await test.step('瀏覽服務介紹頁面', async () => {
            await page.goto('/services/board-copilot');

            // 驗證頁面內容
            await expect(page.locator('h1')).toContainText('董事會副駕駛');
            await expect(page.locator('text=AI 輔助治理')).toBeVisible();
            await expect(page.locator('[data-testid="case-studies"]')).toBeVisible();
            await expect(page.locator('[data-testid="pricing"]')).toBeVisible();

            // 5T 驗證
            await validateFiveT(page, {
                tangible: true,      // 案例展示
                traceable: false,    // 尚未產生數據
                trackable: false,
                transparent: true,   // 定價公開
                trustworthy: true    // 官方認證
            });
        });

        // Touchpoint 2: 治理成熟度測驗
        await test.step('完成治理成熟度自我評估', async () => {
            await page.click('button:has-text("開始評估")');
            await page.waitForSelector('[data-testid="governance-quiz"]');

            // 回答 10 道測驗題
            for (let i = 1; i <= 10; i++) {
                await page.click(`[data-question="${i}"] input[type="radio"]`);
            }

            await page.click('button:has-text("提交評估")');

            // 驗證評分結果
            const score = await page.locator('[data-testid="governance-score"]').textContent();
            expect(Number(score)).toBeGreaterThanOrEqual(0);
            expect(Number(score)).toBeLessThanOrEqual(100);

            // 驗證改善建議顯示
            await expect(page.locator('[data-testid="improvement-suggestions"]')).toBeVisible();

            // 5T 驗證
            await validateFiveT(page, {
                tangible: true,
                traceable: true,     // 答題來源記錄
                trackable: true,     // 評估進度
                transparent: true,   // 評分邏輯公開
                trustworthy: false
            });
        });

        // 驗證知識資產
        await test.step('獲得「Governance Awareness」徽章', async () => {
            await page.goto('/profile/knowledge-assets');
            await expect(page.locator('text=Governance Awareness')).toBeVisible();
            await expect(page.locator('text=治理意識覺醒')).toBeVisible();
        });
    });

    // ==================== 階段 2: Onboarding ====================
    test('階段2：引導 - 建立董事會架構', async () => {
        // Touchpoint 1: 董事會設定精靈
        await test.step('使用設定精靈建立董事會', async () => {
            await page.goto('/board-copilot/setup');

            // 新增董事會成員（至少 3 位）
            const members = [
                JourneyTestDataFactory.createBoardMember(),
                JourneyTestDataFactory.createBoardMember(),
                JourneyTestDataFactory.createBoardMember()
            ];

            for (const member of members) {
                await page.click('button:has-text("新增成員")');
                await page.fill('input[name="memberName"]', member.name);
                await page.fill('input[name="memberEmail"]', member.email);
                await page.selectOption('select[name="memberRole"]', member.role);
                await page.click('button:has-text("確認")');
            }

            // 驗證成員列表
            const memberCount = await page.locator('[data-testid="board-member"]').count();
            expect(memberCount).toBeGreaterThanOrEqual(3);

            // 5T 驗證
            await validateFiveT(page, {
                tangible: true,      // 組織架構圖
                traceable: true,     // 成員來源記錄
                trackable: true,     // 設定進度
                transparent: true,
                trustworthy: false   // 尚未確認
            });
        });

        // Touchpoint 2: 選擇治理框架
        await test.step('選擇治理框架（GRI/SASB/TCFD）', async () => {
            await page.click('button:has-text("下一步")');
            await page.waitForSelector('[data-testid="framework-selection"]');

            // 選擇 GRI 框架
            await page.click('[data-framework="GRI"]');

            // 驗證系統推薦
            await expect(page.locator('[data-testid="framework-recommendation"]')).toBeVisible();
            await expect(page.locator('text=合規檢查清單')).toBeVisible();

            await page.click('button:has-text("確認框架")');

            // 5T 驗證
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true    // 框架選擇鎖定
            });
        });

        // Touchpoint 3: 完成設定並鎖定
        await test.step('提交董事會設定', async () => {
            await page.click('button:has-text("完成設定")');
            await page.waitForSelector('[data-testid="board-uuid"]');

            // 驗證董事會 UUID
            const boardUUID = await page.locator('[data-testid="board-uuid"]').textContent();
            expect(boardUUID).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

            // 驗證證書頒發
            await expect(page.locator('text=Board Setup Complete')).toBeVisible();
            await page.goto('/profile/knowledge-assets');
            await expect(page.locator('text=董事會架構建置完成')).toBeVisible();

            // 5T 全面驗證
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true    // SHA-256 鎖定
            });
        });
    });

    // ==================== 階段 3: Engagement ====================
    test('階段3：參與 - AI 輔助會議執行', async () => {
        const meetingData = JourneyTestDataFactory.createMeetingAgenda();

        // Touchpoint 1: AI 生成會議議程
        await test.step('使用 AI 生成會議議程', async () => {
            await page.goto('/board-copilot/meeting/new');

            await page.fill('input[name="meetingTitle"]', meetingData.title);
            await page.click('button:has-text("AI 生成議程")');

            // 等待 AI 生成
            await page.waitForSelector('[data-testid="ai-agenda-items"]');

            // 驗證議程項目數量
            const agendaCount = await page.locator('[data-testid="agenda-item"]').count();
            expect(agendaCount).toBeGreaterThanOrEqual(5);

            // 驗證 AI 建議來源可追溯
            await page.click('[data-testid="agenda-item"]:first-child [data-testid="view-source"]');
            await expect(page.locator('[data-testid="ai-reasoning"]')).toBeVisible();

            // 5T 驗證
            await validateFiveT(page, {
                tangible: true,
                traceable: true,     // AI 建議來源
                trackable: true,
                transparent: true,   // AI 邏輯透明
                trustworthy: false
            });
        });

        // Touchpoint 2: 執行合規檢查
        await test.step('執行自動化合規檢查', async () => {
            await page.click('button:has-text("合規檢查")');
            await page.waitForSelector('[data-testid="compliance-report"]');

            // 驗證合規報告
            await expect(page.locator('[data-testid="compliance-score"]')).toBeVisible();
            await expect(page.locator('[data-testid="compliance-issues"]')).toBeVisible();

            // 5T 驗證
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true    // 報告鎖定
            });
        });

        // Touchpoint 3: 會議執行與紀錄
        await test.step('進行會議並記錄決議', async () => {
            await page.click('button:has-text("開始會議")');
            await page.waitForSelector('[data-testid="meeting-live"]');

            // 記錄決議
            await page.fill('textarea[name="resolution"]', '通過 2026 年永續策略報告');
            await page.click('button:has-text("記錄決議")');

            // 投票表決
            await page.click('[data-testid="vote-for"]');
            await page.click('button:has-text("確認投票")');

            // 結束會議
            await page.click('button:has-text("結束會議")');

            // 5T 驗證
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            });
        });

        // Touchpoint 4: Hash Lock 鎖定會議紀錄
        await test.step('鎖定會議紀錄', async () => {
            await page.waitForSelector('[data-testid="lock-minutes"]');
            await page.click('button:has-text("鎖定紀錄")');

            // 等待 Hash Lock 完成
            await page.waitForSelector('[data-testid="hash-lock-complete"]');

            // 驗證 SHA-256 雜湊值
            const hash = await page.locator('[data-testid="sha256-hash"]').textContent();
            expect(hash).toMatch(/^[a-f0-9]{64}$/);

            // 驗證公開驗證 URL
            const verifyURL = await page.locator('[data-testid="public-verify-url"]').textContent();
            expect(verifyURL).toContain('/evidence/meeting/');

            // 完整 5T 驗證
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true    // 完全不可篡改
            });
        });

        // 驗證知識資產
        await test.step('獲得「First Meeting Success」報告', async () => {
            await page.goto('/profile/knowledge-assets');
            await expect(page.locator('text=首次會議成功報告')).toBeVisible();
        });
    });

    // ==================== 階段 4: Value Realization ====================
    test('階段4：價值實現 - 治理成熟度認證', async () => {
        // Touchpoint 1: 風險預警儀表板
        await test.step('查看風險預警儀表板', async () => {
            await page.goto('/board-copilot/risk-intelligence');

            // 驗證風險熱力圖
            await expect(page.locator('[data-testid="risk-heatmap"]')).toBeVisible();
            await expect(page.locator('[data-testid="regulatory-alerts"]')).toBeVisible();
            await expect(page.locator('[data-testid="peer-benchmark"]')).toBeVisible();

            // 5T 驗證
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            });
        });

        // Touchpoint 2: 生成治理評分卡
        await test.step('生成治理成熟度評分卡', async () => {
            await page.click('button:has-text("生成評分卡")');
            await page.waitForSelector('[data-testid="governance-scorecard"]');

            // 驗證整體評分
            const overall Score = await page.locator('[data-testid="overall-score"]').textContent();
            expect(Number(overallScore)).toBeGreaterThanOrEqual(0);
            expect(Number(overallScore)).toBeLessThanOrEqual(100);

            // 驗證維度評分
            await expect(page.locator('[data-dimension="board-structure"]')).toBeVisible();
            await expect(page.locator('[data-dimension="risk-management"]')).toBeVisible();
            await expect(page.locator('[data-dimension="transparency"]')).toBeVisible();

            // 驗證改善路徑圖
            await expect(page.locator('[data-testid="improvement-roadmap"]')).toBeVisible();

            // 5T 驗證
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,   // 評分公式公開
                trustworthy: true    // 評分結果鎖定
            });
        });

        // Touchpoint 3: 獲得認證
        await test.step('獲得 Governance Maturity Level 3 認證', async () => {
            await page.click('button:has-text("申請認證")');
            await page.waitForSelector('[data-testid="certification-complete"]');

            // 驗證數位證書
            await expect(page.locator('text=Governance Maturity Level 3')).toBeVisible();
            await expect(page.locator('[data-testid="certificate-pdf"]')).toBeVisible();

            // 下載 PDF
            const [download] = await Promise.all([
                page.waitForEvent('download'),
                page.click('[data-testid="download-certificate"]')
            ]);
            expect(download.suggestedFilename()).toContain('Governance_Certificate');

            // 驗證區塊鏈證明
            const blockchainHash = await page.locator('[data-testid="blockchain-hash"]').textContent();
            expect(blockchainHash).toMatch(/^[a-f0-9]{64}$/);

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

    // ==================== 階段 5: Advocacy ====================
    test('階段5：倡導 - 成為治理冠軍', async () => {
        // Touchpoint 1: 分享治理評分卡
        await test.step('公開分享治理評分卡', async () => {
            await page.goto('/board-copilot/share/scorecard');

            // 選擇公開分享
            await page.check('input[name="makePublic"]');
            await page.click('button:has-text("生成公開頁面")');

            // 驗證公開 URL 與 QR Code
            await page.waitForSelector('[data-testid="public-url"]');
            const publicURL = await page.locator('[data-testid="public-url"]').textContent();
            expect(publicURL).toContain('/public/governance/');

            await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();

            // 5T 驗證
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            });
        });

        // Touchpoint 2: 邀請同業對標
        await test.step('邀請同業董事會對標', async () => {
            await page.goto('/board-copilot/benchmark');

            await page.fill('input[name="peerEmail"]', 'peer@competitor.com');
            await page.click('button:has-text("發送邀請")');

            // 驗證邀請連結生成
            await expect(page.locator('[data-testid="invitation-link"]')).toBeVisible();

            // 5T 驗證
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true
            });
        });

        // Touchpoint 3: 解鎖「Governance Champion」徽章
        await test.step('獲得治理冠軍徽章', async () => {
            await page.goto('/profile/knowledge-assets');

            // 驗證徽章
            await expect(page.locator('text=Governance Champion')).toBeVisible();
            await expect(page.locator('text=治理冠軍徽章')).toBeVisible();

            // 驗證 NFT 格式徽章
            await page.click('[data-badge="governance-champion"]');
            await expect(page.locator('[data-testid="nft-metadata"]')).toBeVisible();

            // 完整 5T 驗證
            await validateFiveT(page, {
                tangible: true,
                traceable: true,
                trackable: true,
                transparent: true,
                trustworthy: true    // NFT 區塊鏈驗證
            });
        });
    });

    // ==================== 完整旅程驗證 ====================
    test('完整旅程 - 從發現到倡導', async () => {
        await test.step('驗證所有階段完成', async () => {
            await page.goto('/journey/board-copilot');

            // 驗證所有階段狀態
            await expect(page.locator('[data-stage="discovery"][data-status="completed"]')).toBeVisible();
            await expect(page.locator('[data-stage="onboarding"][data-status="completed"]')).toBeVisible();
            await expect(page.locator('[data-stage="engagement"][data-status="completed"]')).toBeVisible();
            await expect(page.locator('[data-stage="value-realization"][data-status="completed"]')).toBeVisible();
            await expect(page.locator('[data-stage="advocacy"][data-status="completed"]')).toBeVisible();

            // 驗證整體進度
            const progress = await page.locator('[data-testid="journey-progress"]').textContent();
            expect(progress).toBe('100%');
        });

        await test.step('驗證成功標準', async () => {
            // SC1: 董事會成員 ≥ 3
            const memberCount = await page.locator('[data-testid="board-members-count"]').textContent();
            expect(Number(memberCount)).toBeGreaterThanOrEqual(3);

            // SC2: 會議紀錄已鎖定
            await page.goto('/board-copilot/meetings');
            await expect(page.locator('[data-testid="hash-lock-status"]')).toContainText('locked');

            // SC3: 治理成熟度 ≥ 70
            const govScore = await page.locator('[data-testid="governance-score"]').textContent();
            expect(Number(govScore)).toBeGreaterThanOrEqual(70);

            // SC4: 所有知識資產獲得
            await page.goto('/profile/knowledge-assets');
            const assetCount = await page.locator('[data-service="board-copilot"]').count();
            expect(assetCount).toBeGreaterThanOrEqual(6); // 6 個知識資產
        });
    });
});
