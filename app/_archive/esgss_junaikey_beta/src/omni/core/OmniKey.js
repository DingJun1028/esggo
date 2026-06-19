import { useOmniMemory } from '../infrastructure/memory/OmniMemory.js';
import { OmniEvolution } from './OmniEvolution.js';
import { omniLogger, LogCategory } from '../../services/omniLogger.js';
import { GoodwardLogicGate, lockComponent } from './GoodwardCore.js';
import { omniConstitutionService } from '../../../server/services/OmniConstitutionService.js';
/**
 * 🔑 奧秘元鑰 / OmniKey - System Core Coordinator
 * ================================================
 * [系列] V6 覺醒架構 (V6 Awakening Architecture)
 * [TC] 系統核心協調器。負責中央調度與權限控制。
 * [EN] System Core Coordinator. Responsible for central orchestration and permission control.
 *
 * Scripture Alignment:
 * - Rule 1: OmniKey - Central Coordination & Permission Control
 *
 * Features:
 * - Coordinates Six Forms evolution
 * - Manages interaction with Memory Palace
 * - Serves as the unified entry point for external commands
 */
export class OmniKey {
    static instance;
    constructor() {
        omniLogger.info(LogCategory.SYSTEM, 'OmniKey initialized.');
    }
    /**
     * 🛰️ 獲取元鑰實例 / Get OmniKey Instance
     * --------------------------------------------------
     * [TC] 取得全域唯一的 OmniKey 單例。
     * [EN] Retrieves the globally unique OmniKey singleton instance.
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new OmniKey();
        }
        return this.instance;
    }
    /**
     * 🔓 開啟演化週期 / Unlock Evolution Cycle
     * --------------------------------------------------
     * [TC] 系統調用的統一入口。啟動代理人的六形演化週期，並返回 5T 驗證回應。
     * [EN] Unified entry point for system calls. Initiates the agent's Six Forms
     *      evolution cycle and returns a 5T-verified response.
     *
     * @param input [TC] 觸發指令 [EN] Trigger command
     * @returns [TC] 5T 驗證結果 [EN] 5T-verified result
     */
    async unlock(input) {
        const generateErrorResponse = (msg) => ({
            message: msg,
            core: lockComponent({
                uuid: 'error-response',
                status: 'Trustworthy',
                evidence: {
                    logicGate: {
                        tangible: 'Error-Response',
                        traceable: 'OmniKey',
                        trackable: 'Error-001',
                        transparent: 'Standard-Error-Protocol',
                        trustworthy: 'System-Generated-Lock',
                    },
                    timestamp: Date.now(),
                    hash: 'error-hash',
                },
            }),
        });
        if (!input) {
            omniLogger.warn(LogCategory.SYSTEM, '[OmniKey] Empty input received.');
            return generateErrorResponse('Empty command received. Please provide a specific target.');
        }
        const memory = useOmniMemory.getState();
        omniLogger.info(LogCategory.SYSTEM, `[OmniKey] Command received: ${input}`);
        try {
            // [Phase 1: Awakening]
            memory.setEvolutionPhase('AWAKENING');
            const perception = OmniEvolution.awaken(input);
            memory.addInteractionLog(perception.topic);
            // [Phase 2: Analysis]
            memory.setEvolutionPhase('ANALYSIS');
            const analysis = await OmniEvolution.analyze(input);
            omniLogger.debug(LogCategory.AGENT, `[OmniKey] Intent analyzed: ${analysis.intent} (Confidence: ${analysis.confidence}, Complexity: ${analysis.complexity})`);
            // [Phase 3: Resonance]
            memory.setEvolutionPhase('RESONANCE');
            const resonanceScore = OmniEvolution.calculateResonance(analysis.intent, memory.palace.theVault.conceptWeights);
            omniLogger.debug(LogCategory.AGENT, `[OmniKey] Resonance Index: ${resonanceScore}`);
            // [Phase 4: Strategy]
            memory.setEvolutionPhase('STRATEGY');
            const strategies = await OmniEvolution.strategize(analysis.intent, input, analysis.complexity);
            // [Phase 5: Execution]
            memory.setEvolutionPhase('EXECUTION');
            const executionResult = await OmniEvolution.execute(analysis.intent, strategies);
            const result = `[Agent Response] ${executionResult}
Strategies:
${strategies.map(s => `- ${s}`).join('\n')}
(Resonance Level: ${resonanceScore})`;
            // [Phase 6: Evolution]
            memory.setEvolutionPhase('EVOLUTION');
            // Reinforce intent concept
            memory.reinforceConcept(analysis.intent, 0.5);
            // Calculate gained experience points
            const xpGained = await OmniEvolution.calculateExperience(memory.evolutionState.evolutionLevel, analysis.confidence);
            memory.updateEvolutionMetrics({
                experiencePoints: memory.evolutionState.experiencePoints + xpGained,
                inferenceSpeed: Math.random() * 50 + 50, // Simulated optimization
            });
            omniLogger.info(LogCategory.SYSTEM, `[OmniKey] Evolution cycle complete. XP Gained: ${xpGained}`);
            // Construct 5T Verified Component
            const responseCore = GoodwardLogicGate.crystallize({
                uuid: `response-${Date.now()}`,
                version: '6.50.Eternal',
                timestamp: Date.now(),
                evidence: {
                    tangible: {
                        metric: `Analysis: ${analysis.intent}`,
                        timestamp: Date.now(),
                    },
                    traceable: {
                        source_origin: `Input: ${input}`,
                        owner: 'OmniKey',
                    },
                    trackable: {
                        lifecycle_hooks: [
                            { event: 'Evolution-Cycle', timestamp: Date.now(), actor: 'OmniKey' },
                        ],
                        pathway: [
                            'Unlock',
                            'Awaken',
                            'Analyze',
                            'Resonate',
                            'Strategize',
                            'Execute',
                            'Consolidate',
                        ],
                        current_hook_id: memory.evolutionState.currentPhase,
                    },
                    transparent: {
                        formula: 'OmniEvolution-v7',
                        validation_standard: '6-Forms-Protocol',
                    },
                    trustworthy: {
                        hash_lock: `Hash-Lock-${resonanceScore}`,
                        is_frozen: false, // crystallize will set this to true
                    },
                },
            });
            // [Phase 6.5: Constitutional Audit] - Phase 65 Addition
            const constitutionalAudit = omniConstitutionService.auditCore(responseCore);
            if (!constitutionalAudit.isValid) {
                omniLogger.critical(LogCategory.SOVEREIGN, `[OmniKey] Constitutional Breach detected in core outcome!`);
                // If the system is locked, we return a restricted response
                if (omniConstitutionService.isSystemLocked()) {
                    return {
                        core: responseCore,
                        message: '⚠️ System Sovereignty Restricted: Constitutional violation detected in outcome generation.',
                    };
                }
            }
            // [New] Log to Evidence Vault
            memory.addEvidence(responseCore.evidence);
            return {
                core: responseCore,
                message: result,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            omniLogger.error(LogCategory.SYSTEM, '[OmniKey] Chaos encountered during execution', {
                error: errorMessage,
            });
            return generateErrorResponse('System anomaly occurred. Perception link blocked. Please recalibrate.');
        }
    }
    /**
     * 🧹 銷毀資源 / Destroy Resources
     * --------------------------------------------------
     * [TC] 釋放核心資源並執行清理程序。
     * [EN] Releases core resources and executes cleanup procedures.
     */
    destroy() {
        omniLogger.info(LogCategory.SYSTEM, '🔑 [OmniKey] Core resources released.');
    }
}
