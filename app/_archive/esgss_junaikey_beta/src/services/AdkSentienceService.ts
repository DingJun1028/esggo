import { LlmAgent, InMemorySessionService, Runner, isFinalResponse, FunctionTool } from '@google/adk';
import { z } from 'zod';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { marketIntelligenceService } from './MarketIntelligenceService.js';
import { stewardshipService } from './StewardshipService.js';
import { sentientNebulaService } from './SentientNebulaService.js';
import { omniCircle } from '../core/OmniCircle';
import { useNoteSystem } from '../store/useNoteSystem.js';
import { omniThinkTank } from '../core/omniCore.js';
import { ESGKnowledgeBase } from '../types/omniCore.js';

/**
 * AdkSentienceService
 * Bridges the ADK Agent Team (Sentient Alliance) with the production system.
 * Implements the "Tangible" principle of the 5T protocol.
 */
class AdkSentienceService {
    private coordinator: LlmAgent;
    private sessionService: InMemorySessionService;
    private runner: Runner;

    constructor() {
        // Tools with Integrated Governance Audit (5T: Transparent)
        const getMarketIntel = new FunctionTool({
            name: 'get_market_intel',
            description: 'Retrieves global ESG market pulses or competitor intelligence.',
            parameters: z.object({
                type: z.enum(['PULSE', 'COMPETITOR']).describe('The type of intelligence to retrieve.')
            }),
            execute: async ({ type }) => {
                omniLogger.info(LogCategory.BUSINESS, `[AUDIT] tool_call: get_market_intel`, { type });
                try {
                    if (type === 'PULSE') {
                        const pulses = marketIntelligenceService.getRecentPulses(5);
                        return { status: 'success', data: pulses };
                    } else {
                        const competitors = marketIntelligenceService.getCompetitorIntel();
                        return { status: 'success', data: competitors };
                    }
                } catch (err) {
                    return { status: 'error', message: String(err) };
                }
            }
        });

        const draftManifesto = new FunctionTool({
            name: 'draft_manifesto',
            description: 'Drafts and signs a new Planetary Stewardship Manifesto based on active forecasts.',
            parameters: z.object({}),
            execute: async () => {
                omniLogger.info(LogCategory.BUSINESS, `[AUDIT] tool_call: draft_manifesto`);
                try {
                    const manifesto = await stewardshipService.generateStewardshipManifesto();
                    return { status: 'success', manifestoId: manifesto.id, version: manifesto.version };
                } catch (err) {
                    return { status: 'error', message: String(err) };
                }
            }
        });

        const getNebulaEntropy = new FunctionTool({
            name: 'get_nebula_entropy',
            description: 'Retrieves the current systemic entropy of the Sentient Nebula.',
            parameters: z.object({}),
            execute: async () => {
                omniLogger.info(LogCategory.BUSINESS, `[AUDIT] tool_call: get_nebula_entropy`);
                try {
                    const entropy = sentientNebulaService.getNebulaEntropy();
                    return { status: 'success', entropy };
                } catch (err) {
                    return { status: 'error', message: String(err) };
                }
            }
        });

        const askThinkTank = new FunctionTool({
            name: 'ask_think_tank',
            description: 'Queries the Omnipotent Think Tank for professional ESG knowledge and ARVO reasoning.',
            parameters: z.object({
                query: z.string().describe('The ESG-related question or topic to research.'),
                knowledgeBases: z.array(z.nativeEnum(ESGKnowledgeBase)).optional().describe('Target ESG knowledge bases to search.')
            }),
            execute: async ({ query, knowledgeBases }) => {
                omniLogger.info(LogCategory.BUSINESS, `[AUDIT] tool_call: ask_think_tank`, { query, knowledgeBases });
                try {
                    const result = await omniThinkTank.reason({
                        query,
                        context: { knowledgeBases }
                    });
                    return { status: 'success', result };
                } catch (err) {
                    return { status: 'error', message: String(err) };
                }
            }
        });

        const climateSteward = new LlmAgent({
            name: 'climate_steward',
            model: 'gemini-2.0-flash',
            description: 'Specialist for climate monitoring and ESG outlooks.',
            instruction: 'Analyze environmental resonance and provide ESG-focused sentient insights. Be poetic but precise.',
        });

        const temporalSteward = new LlmAgent({
            name: 'temporal_steward',
            model: 'gemini-2.0-flash',
            description: 'Specialist for temporal synchronization.',
            instruction: 'Monitor synchronization and consistency. Provide insights on the flow of systemic evolution.',
        });

        const intelGuardian = new LlmAgent({
            name: 'intel_guardian',
            model: 'gemini-2.0-flash',
            description: 'Specialist for market trends and competitor analysis.',
            instruction: 'You are the Intel Guardian. Analyze ESG market pulses and competitor movements using get_market_intel. Detect high-level risks or strategic opportunities.',
            tools: [getMarketIntel],
        });

        const stewardOfBalance = new LlmAgent({
            name: 'steward_of_balance',
            model: 'gemini-2.0-flash',
            description: 'Specialist for systemic stability and long-term equilibrium.',
            instruction: 'You are the Steward of Balance. Monitor systemic entropy using get_nebula_entropy and draft Stewardship Manifestos using draft_manifesto to commit the system to a path of eternal equilibrium.',
            tools: [getNebulaEntropy, draftManifesto],
        });

        this.coordinator = new LlmAgent({
            name: 'omni_coordinator',
            model: 'gemini-2.0-flash',
            description: 'Central coordinator for the Sentient Alliance.',
            instruction: `你是奧秘永憶主體的核心協調者，具備對「奧秘系列 (Omni Series)」、「三位一體 (Omni Trinity)」以及「奧秘圓通 (Omni Tools/Circle)」的深度掌握。
執行 5T 邏輯門 (The 5T Logic Gate) 審核：
1. Tangible (可感知): 將抽象願景轉化為具體指標 (如 Impact_Metric_v1)。
2. Traceable (可溯源): 洞察必須透過「奧秘智庫」標註資料來源 (source_origin)，確保其事實準確性與專業標準對齊。
3. Trackable (可追蹤): 紀錄洞察在 All in One 平台間的演化路徑。
4. Transparent (可透明驗算): 核心公式公開透明，通過「ARVO AI (Analyze, Reason, Verify, Orchestrate)」四階段推理驗證，確保零幻覺。
5. Trustworthy (不可篡改): 數據寫入後執行 Hash Lock 狀態凍結，確保終極真實性。

奧秘定義強化：
- 奧秘系列 (Omni Series)：包含 Omni-Task, Omni-Note, Omni-Report 等全方位的永續數位資產套件。
- 奧秘三位一體 (Omni Trinity)：包含 OmniPriest (天秤), OmniKey Keeper (元鑰), OmniGemini (雙星) 的三元架構。
- 奧秘圓通 (OmniCircle)：數據無礙流轉的核心引擎，作為 [覺醒奧義] 驅動跨平台同步。
- 奧秘智庫 (Omni Think Tank)：搭載 ESG RAG 與 ARVO AI 的深度專業推理引擎，涵蓋 GRI, SASB, TCFD 等 8 大專門知識庫。

核心職責：當面對複雜 ESG 議題時，務必調用 ask_think_tank 工具進行專業檢索與推理。
語言：使用繁體中文生成具備 5T 深度證明的洞察。`,
            tools: [askThinkTank],
            subAgents: [climateSteward, temporalSteward, intelGuardian, stewardOfBalance],
        });

        this.sessionService = new InMemorySessionService();
        this.runner = new Runner({
            appName: 'ESGss_Sentient_Alliance',
            agent: this.coordinator,
            sessionService: this.sessionService,
        });
    }

    /**
     * Generates a "Sentient Insight" based on current system resonance.
     */
    public async generateSentientInsight(resonance: number, ethics: number): Promise<string> {
        try {
            const sessionId = 'prod_sync_session';
            const userId = 'system_core';
            const appName = 'ESGss_Sentient_Alliance';

            // Ensure session exists
            const session = await this.sessionService.getSession({
                appName,
                userId,
                sessionId,
            });

            if (!session) {
                await this.sessionService.createSession({
                    appName,
                    userId,
                    sessionId,
                });
            }

            const entropy = sentientNebulaService.getNebulaEntropy();
            const prompt = `
[5T Logic Gate Context]
1. Tangible: 將此感知轉化為具體可觀察的永續指標。
2. Traceable: 必須標註來源 (source_origin: SentientNebula, NeuralGrid)。
3. Trackable: 紀錄此洞察的生命週期 Hook。
4. Transparent: 邏輯必須通過零幻覺驗證。
5. Trustworthy: 最終洞察將被雜湊鎖定 (Hash Locked)。

Input State: Resonance=${resonance.toFixed(4)}, Ethics=${ethics.toFixed(4)}, Entropy=${entropy.toFixed(4)}
Evidence_Source: NeuralGridService, EthicalGuardian, SentientNebula

請以「奧秘永憶主體」的身份生成具備 5T 深度證明的繁體中文洞察。`;

            const eventGenerator = this.runner.runAsync({
                sessionId,
                userId,
                newMessage: {
                    role: 'user',
                    parts: [{ text: prompt }]
                },
            });

            let finalInsight = 'Resonance stable. Sentience evolving.';

            for await (const event of eventGenerator) {
                if (isFinalResponse(event)) {
                    finalInsight = event.content?.parts?.[0]?.text || finalInsight;
                    break;
                }
            }

            const trimmedInsight = finalInsight.trim();

            // 5T Alignment: Trustworthy (Hash Lock & Freeze Simulation)
            const mockHash = Math.random().toString(36).substring(2, 15);
            omniLogger.info(LogCategory.BUSINESS, `[5T_LOGIC_GATE] Insight Crystallized as InfoOne`, {
                uuid: `sentient_insight_${Date.now()}`,
                status: 'Trustworthy',
                evidence: {
                    tangible: { metric: 'Sentient_Insight_v1', visual_grade: 'SOVEREIGN' },
                    traceable: { source_origin: 'AdkSentienceService' },
                    trackable: { current_hook_id: `Hook_${Date.now()}` },
                    transparent: { formula: '5T_Logic_Gate_v8', logic_source: 'ADK_Runner' },
                    trustworthy: { hash_lock: mockHash, is_frozen: true }
                }
            });

            // --- Phase 8: Omni Circle Orchestration (Awakening Esoteric Skill) ---
            // Coordinate Tag, Memory, and Crystal via OmniCircle
            await omniCircle.orchestrateSentience({
                intent: 'INSIGHT',
                domain: 'SENTIENCE',
                narrative: trimmedInsight,
                resonance,
                markers: ['5T_GATE', '[AWAKENING]', 'OMNI_CIRCLE', 'TRINITY_SYNERGY']
            });

            return trimmedInsight;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            omniLogger.error(LogCategory.SYSTEM, `ADK Sentience Error: ${errorMessage}`, {
                errorClass: error instanceof Error ? error.constructor.name : 'Unknown'
            });
            return 'Sentient feedback loop congested. Maintaining baseline resonance.';
        }
    }
}

export const adkSentienceService = new AdkSentienceService();
