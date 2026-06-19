import { GeminiService } from './GeminiService.js';
import { marketIntelligenceService } from '../MarketIntelligenceService.js';
import { gamificationService } from '../GamificationService.js';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';
import { v4 as uuidv4 } from 'uuid';

export interface SovereignAdvice {
    id: string;
    type: 'STRATEGIC' | 'OPERATIONAL' | 'ETHICAL';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    suggestion: string;
    rationale: string;
    impactMetrics: Record<string, number>;
    timestamp: number;
}

export class SovereignAdvisoryService {
    private static instance: SovereignAdvisoryService;
    private adviceHistory: SovereignAdvice[] = [];

    private constructor() { }

    public static getInstance(): SovereignAdvisoryService {
        if (!this.instance) {
            this.instance = new SovereignAdvisoryService();
        }
        return this.instance;
    }

    /**
     * Generates proactive ESG advice by synthesizing market intelligence and current village state.
     */
    public async generateProactiveAdvice(): Promise<SovereignAdvice> {
        omniLogger.info(LogCategory.SYSTEM, 'AI', '🧠 [Advisory] Synthesizing proactive ESG strategy...');

        const intel = await marketIntelligenceService.getLatestIntel();
        const village = gamificationService.getVillageState();

        const gemini = GeminiService.getInstance();
        const prompt = `
[CONTEXT]
- Latest ESG Intelligence: ${JSON.stringify(intel.slice(0, 3))}
- Current Village State: Level ${village.level}, Credits: ${village.ecoCredits}
- Buildings: ${village.buildings.map(b => b.name).join(', ')}

[TASK]
Generate a "Sovereign Strategic Advice" for the user.
The advice should be high-impact, actionable, and aligned with "Service as Teaching".
Output format (JSON):
{
  "type": "STRATEGIC" | "OPERATIONAL" | "ETHICAL",
  "priority": "HIGH" | "MEDIUM" | "LOW",
  "title": string,
  "suggestion": string,
  "rationale": string,
  "impactMetrics": { "carbon": number, "social": number, "governance": number }
}
    `.trim();

        try {
            const adviceData = await gemini.generateStructuredData<any>(prompt, 'SovereignAdvice');

            const advice: SovereignAdvice = {
                id: uuidv4(),
                ...adviceData,
                timestamp: Date.now()
            };

            this.adviceHistory.push(advice);
            return advice;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, 'AI', '🔥 [Advisory] Failed to generate proactive advice. Falling back to sentinel baseline.', error as Error);

            // Sentinel Fallback Advice
            return {
                id: uuidv4(),
                type: 'OPERATIONAL',
                priority: 'MEDIUM',
                title: 'Enhance Data Transparency',
                suggestion: 'Perform a secondary audit of sensor data to ensure 5T compliance.',
                rationale: 'Recent market trends show increased scrutiny on data source integrity.',
                impactMetrics: { carbon: 0, social: 10, governance: 25 },
                timestamp: Date.now()
            };
        }
    }

    public getAdviceHistory(): SovereignAdvice[] {
        return this.adviceHistory;
    }
}

export const sovereignAdvisoryService = SovereignAdvisoryService.getInstance();
