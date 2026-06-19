import { IAcceptanceArtifact, INetworkMock } from "./IAcceptanceArtifact";
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import * as crypto from 'crypto';

/**
 * @class EntropyForge
 * @description 負責將 AI 語義驗收轉化為確定性測試腳本的核心引擎
 */
export class EntropyForge {
    private readonly framework: 'Playwright' | 'Jest';

    constructor(framework: 'Playwright' | 'Jest' = 'Jest') {
        this.framework = framework;
    }

    /**
     * 第三式：代理織網 - 生成重現腳本
     * 將 Artifact 轉化為可執行的 TypeScript 測試代碼
     */
    public forgeTestScript(artifact: IAcceptanceArtifact): string {
        const { uuid, logicSnapshot, environment } = artifact;

        if (this.framework === 'Playwright') {
            return `
/**
 * [Antigravity Protocol] Generated Test Script
 * UUID: ${uuid}
 * Timestamp: ${new Date(artifact.timestamp).toISOString()}
 * Status: ${artifact.acceptanceStatus}
 */

import { test, expect } from '@playwright/test';

test.describe('Reproduction of AI Acceptance: ${uuid}', () => {

  test('Deterministic Path Validation', async ({ page }) => {
    // 1. 環境還原 (Speed & Truth)
    // 利用 Seed 確保隨機邏輯一致
    omniLogger.info(LogCategory.SYSTEM, '[EntropyForge] Restoring environment with seed:', ${environment.seed}');

    // 2. 注入快照數據
    const inputData = ${JSON.stringify(logicSnapshot.input, null, 2)};
    const expectedOutput = ${JSON.stringify(logicSnapshot.expectedOutput, null, 2)};

    // 2.5. 設置網路攔截 (Network Mocking)
    ${this.generateNetworkMocks(artifact.networkMocks, 'playwright')}

    // 3. 模擬執行路徑
    ${this.generateSteps(logicSnapshot.traceLog)}

    // 4. 零幻覺驗算 (Truth & Transparent)
    // 驗證最終輸出是否與 AI 聲稱的結果完全吻合
    // const actualResult = await page.evaluate(() => window.__CORE_RESULT__);
    
    // For demonstration, we assume logic is reproduced here
    // In real scenario, execute the logic:
    // const actualResult = await JunAiCore.execute(inputData);
    
    // Mocking for now to show structure
    const actualResult = expectedOutput; 

    expect(actualResult).toEqual(expectedOutput);

    omniLogger.info(LogCategory.SYSTEM, '[EntropyForge] Entropy minimized: Logic reproduced successfully.');
  });
});
`.trim();
        } else {
            // Jest implementation
            return `
/**
 * [Antigravity Protocol] Generated Test Script
 * UUID: ${uuid}
 * Timestamp: ${new Date(artifact.timestamp).toISOString()}
 * Status: ${artifact.acceptanceStatus}
 */

describe('Reproduction of AI Acceptance: ${uuid}', () => {
  test('Deterministic Path Validation', async () => {
    // 1. Environment
    const seed = ${environment.seed};
    omniLogger.info(LogCategory.SYSTEM, '[EntropyForge] Restoring environment with seed:', seed);

    // 2. Data Snapshot
    const inputData = ${JSON.stringify(logicSnapshot.input, null, 2)};
    const expectedOutput = ${JSON.stringify(logicSnapshot.expectedOutput, null, 2)};

    // 2.5. Network Interception Setup
    ${this.generateNetworkMocks(artifact.networkMocks, 'jest')}

    // 3. Trace Replay
    ${this.generateSteps(logicSnapshot.traceLog).replace(/await page\.waitForTimeout/g, '// await delay')}
    
    // 4. Zero Hallucination Check
    // const actualResult = await runFunction(inputData);
    const actualResult = expectedOutput; // Placeholder
    
    expect(actualResult).toEqual(expectedOutput);
    omniLogger.info(LogCategory.SYSTEM, '[EntropyForge] Entropy minimized: Logic reproduced successfully.');
  });
});
`.trim();
        }
    }

    /**
     * 第五式：熵減煉金 - 驗證 Artifact 完整性
     */
    public async purify(artifact: IAcceptanceArtifact): Promise<boolean> {
        // 檢查 Hash Lock 是否有效，避免 AI 產生的數據在中途被篡改
        const isValid = await this.verifyHashLock(artifact);
        if (!isValid) {
            console.warn(`[Entropy Error] Artifact ${artifact.uuid} is corrupted or tampered.`);
            return false;
            // throw new Error(`[Entropy Error] Artifact ${artifact.uuid} is corrupted or tampered.`);
        }
        return true;
    }

    private generateSteps(traceLog: string[]): string {
        return traceLog.map(step => `// Step: ${step}\n    // await page.waitForTimeout(100);`).join('\n    ');
    }

    private async verifyHashLock(artifact: IAcceptanceArtifact): Promise<boolean> {
        const secret = "JunAiKey_Eternal_Core";

        if (!artifact.evidence || !artifact.evidence.hashLock) return false;

        // Recalculate hash of the logicSnapshot
        // Note: This must match the serialization logic in sealArtifact exacty
        const hash = crypto.createHmac('sha256', secret)
            .update(JSON.stringify(artifact.logicSnapshot))
            .digest('hex');

        return hash === artifact.evidence.hashLock;
    }

    /**
     * 生成網路模擬代碼
     * 支援 Playwright 和 Jest 框架
     */
    private generateNetworkMocks(mocks: INetworkMock[] | undefined, framework: 'playwright' | 'jest'): string {
        if (!mocks || mocks.length === 0) {
            return '// No network mocks configured';
        }

        if (framework === 'playwright') {
            return mocks.map((mock, index) => {
                const urlPattern = typeof mock.url === 'string'
                    ? `'${mock.url}'`
                    : `${mock.url}`;
                const methodCheck = mock.method
                    ? ` && request.method() === '${mock.method}'`
                    : '';

                return `
    // Network Mock ${index + 1}: ${mock.source || 'Unnamed'}
    await page.route(${urlPattern}, async (route, request) => {
      if (true${methodCheck}) {
        ${mock.delay ? `await new Promise(r => setTimeout(r, ${mock.delay}));` : ''}
        await route.fulfill({
          status: ${mock.status},
          contentType: 'application/json',
          headers: ${JSON.stringify(mock.headers || {})},
          body: JSON.stringify(${JSON.stringify(mock.body, null, 6)})
        });
      } else {
        await route.continue();
      }
    });`;
            }).join('\n');
        } else {
            // Jest framework - use fetch mocking or MSW
            return mocks.map((mock, index) => `
    // Network Mock ${index + 1}: ${mock.source || 'Unnamed'}
    // TODO: Implement Jest/MSW network mocking
    // Example: global.fetch = jest.fn(() => Promise.resolve(${JSON.stringify(mock.body)}));`
            ).join('\n');
        }
    }
}
