import { OmniBase } from './OmniBase';
import { OmniPersonaManager, PersonaType, IPersonaResponse } from './omni-persona-manager';
import { omniLogger, LogCategory } from './omniLogger';
import { OmniDecisionValidator, IDecisionInput, IT5ValidationResult } from './omni-decision-validator';
import { v4 as uuidv4 } from 'uuid';

/**
 * 🌌 OmniMultiAgentOrchestrator
 * 負責協調多個人格（Twins）之間的對話、辯論與共識生成。
 * 遵循 5T 協議 2.0 與 Socratic Reasoning (蘇格拉底式推理)。
 */
export class OmniMultiAgentOrchestrator extends OmniBase {
    private static instance: OmniMultiAgentOrchestrator;
    private personaManager = OmniPersonaManager.getInstance();
    private decisionValidator = OmniDecisionValidator.getInstance();

    private constructor() {
        super();
    }

    public static getInstance(): OmniMultiAgentOrchestrator {
        if (!OmniMultiAgentOrchestrator.instance) {
            OmniMultiAgentOrchestrator.instance = new OmniMultiAgentOrchestrator();
        }
        return OmniMultiAgentOrchestrator.instance;
    }

    /**
     * 🧠 SocraticReasoning: 啟動多代理辯論流程
     */
    public async orchestrate(
        query: string,
        domain: string,
        agentTypes: PersonaType[] = ['strategic-oracle', 'compliance-guard']
    ): Promise<{
        finalConsensus: string;
        reasoningChain: IPersonaResponse[];
        validation: IT5ValidationResult;
    }> {
        const reasoningChain: IPersonaResponse[] = [];
        let currentContext = query;

        omniLogger.info(LogCategory.AI, `[Orchestrator] Starting reasoning for: ${query}`);

        // 1. 初步分析 (Initiator)
        for (const type of agentTypes) {
            const response = await this.personaManager.generateResponse(type, 'analysis', { query: currentContext });
            reasoningChain.push(response);
            
            // 蘇格拉底式演進：將前一個代理的回傳作為下一個代理的挑戰
            currentContext += `\n\nChallenge from ${type}: ${response.response}`;
        }

        // 2. 生成最終共識
        const finalPersona = this.personaManager.getBestPersona(domain);
        const consensusResponse = this.personaManager.generateResponse(finalPersona.type, 'recommendation', { query, chain: reasoningChain.map(r => r.response).join('|') });
        
        reasoningChain.push(consensusResponse);

        // 3. 5T 驗證
        const decisionInput: IDecisionInput = {
            id: `multi-agent-${uuidv4().substring(0, 8)}`,
            domain,
            action: 'ConsensusGeneration',
            payload: {
                query,
                consensus: consensusResponse.response,
                reasoning_steps: reasoningChain.length,
                alternativesConsidered: true,
                esgAlignment: true
            }
        };

        const validation = await this.decisionValidator.validate(decisionInput);

        return {
            finalConsensus: consensusResponse.response,
            reasoningChain,
            validation
        };
    }
}

export default OmniMultiAgentOrchestrator;
