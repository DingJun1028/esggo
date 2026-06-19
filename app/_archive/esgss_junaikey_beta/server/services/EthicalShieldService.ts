import { EventEmitter } from 'events';
import { complianceService } from './ComplianceService.js';
import { predictiveGovernanceService } from './PredictiveGovernanceService.js';
import { omniLogger, LogCategory } from './omni/infrastructure/logging/OmniLogger.js';
import { type IComponentCore } from './OmniComponentCore.js';
import crypto from 'crypto';

export enum ShieldState {
    NORMAL = 'NORMAL',
    GUARDED = 'GUARDED',
    LOCKDOWN = 'LOCKDOWN'
}

import { consensusGovernanceService, ProposalStatus } from './ConsensusGovernanceService.js';

/**
 * Phase 58: Dynamic Ethical Shielding Service
 * Protects system integrity by enforcing sovereignty states based on ESG risks.
 */
export class EthicalShieldService extends EventEmitter {
    private currentState: ShieldState = ShieldState.NORMAL;
    private stateHistory: { state: ShieldState, core: IComponentCore }[] = [];

    constructor() {
        super();
        this.initializeSubscribers();
        omniLogger.info(LogCategory.SYSTEM, `[SYSTEM] Ethical Shielding Service v10.1 Initialized. Initial State: ${this.currentState}`);
    }

    private initializeSubscribers() {
        // Listen for GRC Violations
        complianceService.on('violation', (v) => {
            omniLogger.warn(LogCategory.SECURITY, `[Shield-Sensor] Breach Detected: ${v.ruleId}. Evaluating escalation...`);
            this.evaluateEscalation('VIOLATION', v);
        });

        // Listen for AI Prophecies
        predictiveGovernanceService.on('alert', (a) => {
            if (a.type === 'RISK' && a.confidence > 0.6) {
                omniLogger.info(LogCategory.SECURITY, `[Shield-Sensor] AI Risk Alert: ${a.description} (Conf: ${a.confidence}). Evaluating guard...`);
                this.evaluateEscalation('AI_RISK', a);
            }
        });
    }

    private evaluateEscalation(trigger: string, data: any) {
        let targetState = this.currentState;

        if (trigger === 'VIOLATION') {
            targetState = ShieldState.LOCKDOWN;
        } else if (trigger === 'AI_RISK') {
            if (data.confidence > 0.9) {
                targetState = ShieldState.LOCKDOWN;
            } else if (data.confidence > 0.6) {
                targetState = ShieldState.GUARDED;
            }
        }

        if (targetState !== this.currentState) {
            this.transitionTo(targetState, `Triggered by ${trigger}: ${data.description || data.ruleId}`);
        }
    }

    private transitionTo(newState: ShieldState, reason: string) {
        const oldState = this.currentState;
        this.currentState = newState;

        const traceId = `shield-${crypto.randomUUID()}`;

        // 5T v10.1 Core for the State Transition
        const core: IComponentCore = {
            uuid: traceId,
            version: '10.1.0-sentient',
            timestamp: Date.now(),
            status: newState === ShieldState.LOCKDOWN ? 'Violated' : 'Calculated', // Mapping Shield states to Core statuses
            evidence: {
                tangible: {
                    metric: `Shield Transition: ${oldState} -> ${newState}`,
                    verified_at: Date.now(),
                    visual_grade: newState === ShieldState.NORMAL ? 'GOLD' : (newState === ShieldState.GUARDED ? 'PLATINUM' : 'SOVEREIGN')
                },
                traceable: {
                    source_origin: 'EthicalShieldService:Sovereignty_Engine',
                    verification_links: [`/vault/sovereignty/shield-${traceId}.event`]
                },
                transparent: {
                    formula: 'Dynamic_Ethical_Enforcement_V1',
                    validation_standard: reason
                },
                trustworthy: {
                    hash_lock: crypto.createHash('sha256').update(JSON.stringify({ oldState, newState, reason, timestamp: Date.now() })).digest('hex'),
                    is_frozen: true
                }
            }
        };

        this.stateHistory.push({ state: newState, core });
        if (this.stateHistory.length > 20) this.stateHistory.shift();

        omniLogger.critical(LogCategory.SECURITY, `[Shield-Transition] ${oldState} => ${newState} | Reason: ${reason}`);
        this.emit('shieldChange', { oldState, newState, core });
    }

    public getState(): ShieldState {
        return this.currentState;
    }

    public getHistory() {
        return this.stateHistory;
    }

    /**
     * Consensus-based reset
     * --------------------
     * Phase 59: Requires an approved consensus proposal to restore sovereignty.
     */
    public async resetShield(proposalId: string): Promise<boolean> {
        const proposal = consensusGovernanceService.getProposal(proposalId);

        if (!proposal || proposal.type !== 'SHIELD_RESET' || proposal.status !== ProposalStatus.APPROVED) {
            omniLogger.error(LogCategory.SECURITY, `Shield Reset Rejected: Proposal ${proposalId} is invalid or not approved by consensus.`);
            return false;
        }

        omniLogger.info(LogCategory.SECURITY, `🛡️ Verified Consensus for Shield Reset. Proposal: ${proposalId}`);
        this.transitionTo(ShieldState.NORMAL, `Sovereignty restored via Consensus Proposal: ${proposalId}`);

        // Mark proposal as executed
        proposal.status = ProposalStatus.EXECUTED;
        return true;
    }
}

export const ethicalShieldService = new EthicalShieldService();
