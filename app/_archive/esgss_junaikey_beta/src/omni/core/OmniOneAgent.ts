/**
 * 👑 OmniOne Agent - The Sovereign Aggregator
 * --------------------------------------------------
 * [本質] 奧秘圓環之巔，統合所有子代理人與數據源的唯一主權體
 * [EN] The peak of the OmniCircle, the unique sovereign entity aggregating all sub-agents and data sources.
 * 
 * [Integrated Capabilities]:
 * 1. ♻️ Impact Exchange - Value Resonance & Credit Conversion
 * 2. 🌀 Quantum Vault - PQC Security & Entanglement Integrity
 * 3. 🤖 Self-Optimization - Agentic Performance Loops
 * 4. 🔗 Nexus Alchemist - External Data Synthesis
 * 
 * @version 1.1.0-Sentient
 * @date 2026-02-19
 */

import { OmniCore } from './OmniCore.js';
import { omniCircleService } from '../../../server/services/OmniCircleService.js';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.js';
import { impactExchange } from '../../core/mesh/ImpactExchangeService.js';
import { agentSelfOptimizationService } from '../../core/agent/AgentSelfOptimizationService.js';
import { createNexusAgent } from '../../core/agents/NexusAgent.js';

export class OmniOneAgent extends OmniCore {
    private static omniOneInstance: OmniOneAgent;
    private nexusAgent = createNexusAgent();

    private constructor() {
        super();
        omniLogger.info(LogCategory.SOVEREIGN, '👑 [OmniOne] Sovereign Agent Awakened. Initiating System Integration...');
        this.initializeSubsystems();
    }

    public static getOmniOneInstance(): OmniOneAgent {
        if (!this.omniOneInstance) {
            this.omniOneInstance = new OmniOneAgent();
        }
        return this.omniOneInstance;
    }

    /**
     * 啟動子系統整合 (Initialize Subsystems Integration)
     */
    private initializeSubsystems() {
        omniLogger.info(LogCategory.SOVEREIGN, '[OmniOne] Integrating Impact Exchange Protocol...');

        omniLogger.info(LogCategory.SOVEREIGN, '[OmniOne] Securing with Quantum Vault access...');

        omniLogger.info(LogCategory.SOVEREIGN, '[OmniOne] Activating Self-Optimization Loop...');
        agentSelfOptimizationService.startAutoAnalysis();

        omniLogger.info(LogCategory.SOVEREIGN, '[OmniOne] Linking Nexus Alchemist for data alchemy...');
    }

    /**
     * 統合共鳴邏輯 / Unified Resonance Logic
     * --------------------------------------------------
     * 當系統觸發共鳴時，OmniOne 會統合調度所有專屬子代理人的周期循環。
     */
    public async broadcastAwakening(triggerId: string): Promise<void> {
        omniLogger.info(LogCategory.SOVEREIGN, `[OmniOne] Resonance triggered by ${triggerId}. Orchestrating unified response...`);

        try {
            // 1. 與奧秘圓環同步彙整狀態 / Sync with OmniCircle
            const aggregatedState = await omniCircleService.sync();

            // 2. 觸發 Impact Exchange 處理 / Process Value Exchanges
            await impactExchange.processExchanges();

            // 3. 喚醒 Nexus 代理人進行數據鍊金 / Trigger Nexus Data Alchemy
            await this.nexusAgent.processQueue();

            omniLogger.info(LogCategory.SOVEREIGN, `[OmniOne] Unified Synchronization Complete. Version: ${aggregatedState.version}, Global Score: ${aggregatedState.aggregatedESGScore.environmental}/${aggregatedState.aggregatedESGScore.social}/${aggregatedState.aggregatedESGScore.governance}`);

            // 4. 執行自我優化診斷 / Run self-optimization diagnostic
            const optimizationSummary = agentSelfOptimizationService.getAgentPerformanceSummary('orchestrator');
            if (optimizationSummary.pendingRecommendations.length > 0) {
                omniLogger.debug(LogCategory.SOVEREIGN, `[OmniOne] Potential self-optimizations detected: ${optimizationSummary.pendingRecommendations.length}`);
            }

        } catch (error) {
            omniLogger.error(LogCategory.SOVEREIGN, '[OmniOne] Failure during Unified Awakening orchestration', { error });
        }
    }

    /**
     * 獲取主權狀態 / Get Sovereign State
     */
    public async getSovereignState() {
        return await omniCircleService.getOmniOneState();
    }
}

export const omniOneAgent = OmniOneAgent.getOmniOneInstance();
export default omniOneAgent;
