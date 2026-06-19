import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { searchAgent } from '../adk/agents/SearchAgent.js';
import { Runner, InMemorySessionService, isFinalResponse } from '@google/adk';

export interface RecalibrationResult {
    success: boolean;
    patch?: string;
    recalibrationScore: number;
    timestamp: string;
}

/**
 * AdkRecalibrationService
 * 
 * 當 SentienceDriftService 偵測到中高難度的漂移時，自動觸發 5T 校準。
 */
class AdkRecalibrationService {
    private activePatches: Map<string, string> = new Map();

    /**
     * 對特定查詢進行自主重校
     * @param query 原始查詢
     * @param driftLevel 漂移程度
     * @param historicalContext 歷史比對資訊
     */
    public async recalibrate(query: string, driftLevel: string, historicalContext: string): Promise<RecalibrationResult> {
        omniLogger.info(LogCategory.SYSTEM, `[RECALIBRATION] Initiating autonomous recalibration for: ${query} (Level: ${driftLevel})`);

        const runner = new Runner({
            appName: 'Adk-Recalibration',
            agent: searchAgent,
            sessionService: new InMemorySessionService(),
        });

        const sessionId = `recal_${Date.now()}`;
        const userId = 'system_governor';

        const prompt = `
            ⚠️ 感知漂移告警 (Sentience Drift Alert)
            主題: ${query}
            飄移程度: ${driftLevel}
            歷史比對背景: ${historicalContext}

            您目前的分析與歷史紀錄出現了顯著差異或連貫性下降。
            作為 'JunAiKey 系統治理員'，請執行以下任務：
            1. 分析導致漂移的可能原因（如：時效性數據變化、邏輯不一致、5T 協議執行偏差）。
            2. 生成一個 '指令補丁 (Instruction Patch)'，這是一個簡短的指導方針，用於修正未來的分析行為。
            3. 確保補丁符合 5T 協議 (Trust, Transcendence, Traceability, Transparency, Transformation)。

            輸出格式：
            [REASON]: (漂移原因分析)
            [PATCH]: (具體的指令補丁)
            [SCORE]: (校準預期成功分數 0-100)
        `;

        try {
            await runner.sessionService.createSession({ appName: 'Adk-Recalibration', userId, sessionId });
            const eventGenerator = runner.runAsync({
                sessionId,
                userId,
                newMessage: {
                    role: 'user',
                    parts: [{ text: prompt }]
                }
            });

            let fullResponse = '';
            for await (const event of eventGenerator) {
                if (isFinalResponse(event)) {
                    fullResponse = event.content?.parts?.[0]?.text || '';
                    break;
                }
            }

            const patchMatch = fullResponse.match(/\[PATCH\]:\s*(.*)/i);
            const scoreMatch = fullResponse.match(/\[SCORE\]:\s*(\d+)/i);

            const patch = patchMatch ? patchMatch[1]?.trim() : undefined;
            const score = scoreMatch ? parseInt(scoreMatch[1] || '0') : 0;

            if (patch) {
                this.activePatches.set(query, patch);
                omniLogger.info(LogCategory.SYSTEM, `[RECALIBRATION] Patch applied for topic: ${query}`);
            }

            return {
                success: !!patch,
                patch,
                recalibrationScore: score,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `[RECALIBRATION] Recalibration failed: ${error}`);
            return { success: false, recalibrationScore: 0, timestamp: new Date().toISOString() };
        }
    }

    /**
     * 獲取特定查詢的有效補丁
     */
    public getPatch(query: string): string | undefined {
        // 簡單的關鍵字匹配，或精確匹配
        for (const [key, patch] of this.activePatches.entries()) {
            if (query.includes(key) || key.includes(query)) {
                return patch;
            }
        }
        return undefined;
    }
}

export const adkRecalibrationService = new AdkRecalibrationService();
