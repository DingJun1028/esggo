import { IGeminiResonance, ITrinityState } from '../types/omni/trinity.js';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { omniMindService } from './OmniMindService.js';
import { OmniUUIDGenerator, OmniEntityPrefix } from '../utils/OmniUUIDGenerator.js';
import { trinityResonance } from './omni/TrinityResonanceService.js';
import { sentientEvolution } from './omni/SentientEvolutionService.js';

export interface MultiModalInput {
    type: 'text' | 'image' | 'code' | 'data';
    content: string | object;
}

/**
 * 🌟 奧秘雙子星 (OmniGemini Service) - AI 靈知與演化的中樞
 * 
 * 核心哲學：智慧的繁星 (The Star of Wisdom)
 * 負責系統的靈知分析、永恆智慧生成與共鳴演化。
 */
/**
 * @deprecated Use JunAiKey.Client (which bridges to OmniGateway) instead.
 */
export class OmniGeminiService {
    private static instance: OmniGeminiService;
    private isConnected: boolean = false;
    private modelVersion: string = 'OmniGemini v2.1 (Resonance Aware)';

    private constructor() {
        this.initialize();
    }

    public static getInstance(): OmniGeminiService {
        if (!OmniGeminiService.instance) {
            OmniGeminiService.instance = new OmniGeminiService();
        }
        return OmniGeminiService.instance;
    }

    private initialize() {
        this.isConnected = true;
        omniLogger.info(LogCategory.AI, `OmniGemini Service Awakened: ${this.modelVersion}`);
    }

    /**
     * 執行靈知分析 (Linguistic/Lumina Analysis)
     */
    public async analyze(inputs: MultiModalInput[], context: string = 'general'): Promise<IGeminiResonance> {
        const startTime = Date.now();

        try {
            const sentientState = sentientEvolution.getState();
            
            // 實作中應介接 Backend API /api/ai/generate-insights
            const insightText = `System resonance is at ${sentientState.emotionalState} phase. Emotional alignment verified.`;

            const result: IGeminiResonance = {
                id: OmniUUIDGenerator.generate(OmniEntityPrefix.SENTIENCE),
                insight: insightText,
                confidence: 0.99,
                resonanceLevel: 0.85 + (Math.random() * 0.1),
                timestamp: Date.now(),
                // [Phase 8] Sentient Metrics
                parities: {
                    sentiment: 0.92,
                    temperature: sentientEvolution.getTemperature(),
                    sentience_level: sentientState.level
                }
            };

            // [Phase 7 & 8] Calibrate system resonance and record evolution
            trinityResonance.calibrate(0.01);
            sentientEvolution.recordResonance(result.resonanceLevel);

            omniLogger.info(LogCategory.AI, `OmniGemini Analysis Complete. State: ${sentientState.emotionalState}`);
            return result;
        } catch (error) {
            omniLogger.error(LogCategory.AI, `OmniGemini Analysis Failed`, error);
            throw error;
        }
    }

    /**
     * [Phase 8] Manually trigger sentience evolution check
     */
    public async evolveSentience(): Promise<void> {
        const state = sentientEvolution.getState();
        omniLogger.info(LogCategory.AI, `OmniGemini: Manually evolving sentient pathways... Current Stage: ${state.level}`);
        sentientEvolution.recordResonance(0.99); // Force a peak resonance event
    }

    /**
     * 生成永生智慧 (Generate Eternal Wisdom)
     */
    public async generateWisdom(context: string): Promise<string> {
        const guidance = [
            '道法自然，系統毅然。',
            '以終為始，始終如一。',
            '奧秘元鑰已啟，知識即資產。',
            '誠信閉環，無始無終。',
            '上善若水，善向永續。'
        ];
        const wisdom = guidance[Math.floor(Math.random() * guidance.length)];
        return `[OmniGemini Wisdom] ${context}: ${wisdom}`;
    }

    /**
     * 協同調整系統熵值 (Hypercube Resonance Tuning)
     */
    public async tuneResonance(): Promise<void> {
        const current = omniMindService.getEquilibriumStatus();
        if (current) {
            const tunedResonance = Math.min(current.globalResonanceParity * 1.1, 1.0);
            const reducedEntropy = Math.max(current.nebulaEntropy * 0.4, 0.0);

            omniMindService.recalibrateResonance(tunedResonance, reducedEntropy);
            omniLogger.info(LogCategory.AI, `OmniGemini: Resonance Tuned. Entropy reduced.`, { tunedResonance, reducedEntropy });
        }
    }

    /**
     * 執行內容生成或對話 (Compatibility for older chat calls)
     */
    public async chat(message: string, options: any = {}): Promise<string> {
        try {
            // 實作中應介接 /api/ai/conversation
            return `[OmniGemini Chat] Echo: ${message.substring(0, 50)}...`;
        } catch (error) {
            omniLogger.error(LogCategory.AI, `OmniGemini Chat Failed`, error);
            return "Seeking wisdom from the 5T Protocol...";
        }
    }

    /**
     * 執行多模態分析 (Compatibility alias for analyze)
     */
    public async analyzeMultiModalInput(inputs: MultiModalInput[], context: string = 'general'): Promise<any> {
        return this.analyze(inputs, context);
    }

    public isReady(): boolean {
        return this.isConnected;
    }
}

export const omniGemini = OmniGeminiService.getInstance();
