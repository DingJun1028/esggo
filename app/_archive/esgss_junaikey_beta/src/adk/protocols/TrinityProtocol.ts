import { Runner, InMemorySessionService, isFinalResponse } from '@google/adk';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { searchAgent } from '../agents/SearchAgent';
import { auditorAgent } from '../agents/AuditorAgent';
import { coordinatorAgent } from '../agents/CoordinatorAgent';

export interface TrinityResult {
    success: boolean;
    resonanceScore: number;
    finalConsensus: string;
    auditLog: string[];
}

/**
 * TrinityProtocol
 * 
 * Implements the "Trinity" orchestration pattern:
 * 1. Search (Fetch Data)
 * 2. Auditor (Challenge & Validate)
 * 3. Coordinator (Synthesize & Score)
 */
export const TrinityProtocol = {

    async execute(topic: string): Promise<TrinityResult> {
        omniLogger.info(LogCategory.SYSTEM, `[TRINITY] Initiating protocol for topic: ${topic}`);
        const sessionService = new InMemorySessionService();
        const logs: string[] = [];

        try {
            // --- Step 1: Search Agent (Thesis) ---
            logs.push(`[SEARCH] Scanning global intelligence for: ${topic}`);
            const searchResult = await this.runAgent(
                'SearchAgent',
                searchAgent,
                sessionService,
                `請針對「${topic}」進行快速市場掃描，找出最新的關鍵數據與爭議點。`
            );
            logs.push(`[SEARCH] Data Acquired. Length: ${searchResult.length} chars.`);

            // --- Step 2: Auditor Agent (Antithesis) ---
            logs.push(`[AUDITOR] Challenging findings...`);
            const auditResult = await this.runAgent(
                'AuditorAgent',
                auditorAgent,
                sessionService,
                `以下是針對「${topic}」的研究報告，請進行對抗性審核 (Adversarial Audit)。
                如果不符合 5T 協議或存在綠色清洗嫌疑，請嚴厲指出。
                報告內容：
                ${searchResult}`
            );
            logs.push(`[AUDITOR] Audit Complete.`);

            // --- Step 3: Coordinator Agent (Synthesis) ---
            logs.push(`[COORDINATOR] Synthesizing final consensus...`);
            const consensus = await this.runAgent(
                'CoordinatorAgent',
                coordinatorAgent,
                sessionService,
                `我們剛完成了針對「${topic}」的攻防演練。
                Search 結果：${searchResult}
                Auditor 審核：${auditResult}

                請綜合雙方觀點，給出最終的「共鳴分數 (Resonance Score, 0-100)」與簡短總結。
                輸出格式必須包含：
                SCORE: [分數]
                SUMMARY: [總結]
                `
            );

            // Parse Score
            const scoreMatch = consensus.match(/SCORE:\s*(\d+(\.\d+)?)/);
            const resonanceScore = scoreMatch ? parseFloat(scoreMatch[1]) : 85.0; // Default fallback

            omniLogger.info(LogCategory.SYSTEM, `[TRINITY] Protocol Success. Score: ${resonanceScore}`);

            return {
                success: true,
                resonanceScore,
                finalConsensus: consensus,
                auditLog: logs
            };

        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[TrinityProtocol] Trinity Protocol Error:', { error })
            return {
                success: false,
                resonanceScore: 0,
                finalConsensus: 'Protocol Failed',
                auditLog: [...logs, `ERROR: ${String(error)}`]
            };
        }
    },

    async runAgent(appName: string, agent: any, sessionService: any, prompt: string): Promise<string> {
        const sessionId = `${appName}_${Date.now()}`;
        await sessionService.createSession({ appName, userId: 'trinity_core', sessionId });

        const runner = new Runner({ appName, agent, sessionService });
        const eventGenerator = runner.runAsync({
            sessionId,
            userId: 'trinity_core',
            newMessage: { role: 'user', parts: [{ text: prompt }] }
        });

        let response = '';
        for await (const event of eventGenerator) {
            if (isFinalResponse(event)) {
                response = event.content?.parts?.[0]?.text || '';
            }
        }
        return response;
    }
};
