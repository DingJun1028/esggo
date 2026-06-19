import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';
import { digitalTwinService } from '../../DigitalTwinService.js';
import { IPersonalTwin } from '../../../../src/types/twin/index.js';
import { IntegrityPassportService, type PassportState } from '../../IntegrityPassportService.js';
import type { ICrystalDNA } from '../../OmniReportService.js';

/**
 * Service to orchestrate Multi-Agent Verification Flows.
 * Ensures that high-value actions are verified by at least two distinct AI identities.
 */
export class MultiAgentVerificationService {
    private static instance: MultiAgentVerificationService;

    private constructor() { }

    public static getInstance(): MultiAgentVerificationService {
        if (!MultiAgentVerificationService.instance) {
            MultiAgentVerificationService.instance = new MultiAgentVerificationService();
        }
        return MultiAgentVerificationService.instance;
    }

    /**
     * Execute a verified task flow.
     * 1. Executor Agent performs the task.
     * 2. Verifier Agent audits the result.
     * 3. If verified, both sign the result.
     */
    public async executeVerifiedFlow(
        taskName: string,
        executorParams: any,
        verifierParams: any,
        userId?: string
    ): Promise<{
        success: boolean;
        result: any;
        signatures: string[];
        evidenceId: string;
        passportState?: PassportState;
    }> {
        omniLogger.info(LogCategory.AI, `🚀 Starting Verified Flow: ${taskName}`);

        // 1. Mint/Retrieve Agents (In a real scenario, these would be long-lived)
        const executor = await digitalTwinService.mintAgentTwin('AlphaExecutor', 'TaskRunner', ['Execution']);
        const verifier = await digitalTwinService.mintAgentTwin('BetaVerifier', 'Auditor', ['Verification']);

        // 2. Execution Phase
        const executionResult = await this.mockAgentExecution(executor, taskName, executorParams);
        omniLogger.info(LogCategory.AI, `📝 Execution Complete by ${executor.displayName}`);

        // 3. Verification Phase
        const verificationResult = await this.mockAgentVerification(verifier, executionResult, verifierParams);
        omniLogger.info(LogCategory.AI, `🔍 Verification Complete by ${verifier.displayName}: ${verificationResult.passed ? 'PASSED' : 'FAILED'}`);

        if (!verificationResult.passed) {
            omniLogger.warn(LogCategory.AI, `❌ Verification Failed for ${taskName}`);
            return {
                success: false,
                result: null,
                signatures: [],
                evidenceId: ''
            };
        }

        // 4. Sealing (Multi-Sig)
        const evidenceId = uuidv4();
        const signatures = [
            this.signEvidence(executor, evidenceId, 'EXECUTED'),
            this.signEvidence(verifier, evidenceId, 'VERIFIED')
        ];

        omniLogger.info(LogCategory.AI, `🔐 Flow Sealed with Multi-Sig on Evidence ${evidenceId}`);

        // 5. Seal Crystal to Passport (if userId provided)
        let passportState: PassportState | undefined;
        if (userId) {
            try {
                const crystal = this.mintVerificationCrystal(
                    taskName,
                    evidenceId,
                    executor,
                    verifier,
                    verificationResult.score
                );
                const verifierUuids = [executor.uuid, verifier.uuid];
                passportState = IntegrityPassportService.sealCrystalToPassport(
                    userId,
                    crystal,
                    signatures,
                    verifierUuids
                );
                omniLogger.info(LogCategory.BUSINESS,
                    `🏛️ Crystal sealed to Passport for ${userId}. ` +
                    `Score: ${passportState.score} | Rank: ${passportState.rank}`
                );
            } catch (err: any) {
                omniLogger.error(LogCategory.BUSINESS,
                    `[MultiAgent] Failed to seal to passport: ${err.message}`
                );
            }
        }

        return {
            success: true,
            result: executionResult,
            signatures,
            evidenceId,
            passportState
        };
    }

    /**
     * Mint a Crystal DNA from a verified multi-agent flow result.
     * This Crystal represents the verified work product as an immutable knowledge asset.
     */
    private mintVerificationCrystal(
        taskName: string,
        evidenceId: string,
        executor: IPersonalTwin,
        verifier: IPersonalTwin,
        verificationScore: number
    ): ICrystalDNA {
        const crystal: ICrystalDNA = {
            uuid: uuidv4(),
            genesis_timestamp: Date.now(),
            nature: {
                intent: 'EVIDENCE',
                domain: 'GOVERNANCE',
                dnaMarkers: ['multi-agent-verified', taskName, 'dual-sig']
            },
            resonance: {
                visibility: 'OMNI',
                integrityLevel: verificationScore,
                isLocked: true,
                resonanceLevel: Math.min(100, verificationScore + 5)
            },
            payload: {
                narrative: `Multi-Agent Verified: "${taskName}" executed by ${executor.displayName}, audited by ${verifier.displayName}.`,
                quantitative: verificationScore,
                evidenceVault: JSON.stringify([evidenceId]),
                tangibleLabel: `Dual-Sig Verification (Score: ${verificationScore})`
            },
            hashLock: ''
        };

        // Compute self-integrity hash
        const raw = JSON.stringify({
            uuid: crystal.uuid,
            nature: crystal.nature,
            resonance: crystal.resonance,
            payload: crystal.payload,
            genesis_timestamp: crystal.genesis_timestamp,
        });
        crystal.hashLock = crypto.createHash('sha256').update(raw).digest('hex');

        return crystal;
    }

    private async mockAgentExecution(agent: IPersonalTwin, task: string, params: any): Promise<any> {
        // Mocking complex agent work
        return {
            task,
            executedBy: agent.uuid,
            timestamp: Date.now(),
            data: params
        };
    }

    private async mockAgentVerification(agent: IPersonalTwin, result: any, criteria: any): Promise<{ passed: boolean; score: number }> {
        // Mocking verification logic
        return {
            passed: true,
            score: 95
        };
    }

    private signEvidence(agent: IPersonalTwin, contentId: string, action: string): string {
        // Simplified signature simulation
        return `SIG_${agent.uuid}_${action}_${contentId.substring(0, 8)}`;
    }
}

export const multiAgentVerificationService = MultiAgentVerificationService.getInstance();
