/**
 * 📜 Omni Constitution Service (The Sentient Constitution)
 * --------------------------------------------------
 * [系列] V6.50.Eternal - Phase 65
 * [TC] 系統憲法服務。定義不可違背的核心準則與自動熔斷機制。
 * [EN] System Constitution Service. Defines immutable core principles 
 *      and automated circuit-breaker mechanisms.
 */

import { omniLogger, LogCategory } from './omni/infrastructure/logging/OmniLogger.js';
import { IComponentCore } from './OmniComponentCore.js';

export enum ConstitutionalPrinciple {
    ESG_INTEGRITY = 'ESG_INTEGRITY',
    HUMAN_AI_ALIGNMENT = 'HUMAN_AI_ALIGNMENT',
    QUANTUM_SOVEREIGNTY = 'QUANTUM_SOVEREIGNTY',
    ENTROPY_REDUCTION = 'ENTROPY_REDUCTION',
    ETERNAL_RESONANCE = 'ETERNAL_RESONANCE'
}

export interface ConstitutionalAuditResult {
    isValid: boolean;
    score: number; // 0 to 1
    violations: string[];
    resonancePattern: string;
}

export class OmniConstitutionService {
    private static instance: OmniConstitutionService;
    private isLocked: boolean = false;

    private constructor() {
        omniLogger.info(LogCategory.SOVEREIGN, 'Omni Constitution Service Initialized.');
    }

    public static getInstance(): OmniConstitutionService {
        if (!this.instance) {
            this.instance = new OmniConstitutionService();
        }
        return this.instance;
    }

    /**
     * Audit an action or state against the Sentient Constitution.
     */
    public auditCore(core: IComponentCore): ConstitutionalAuditResult {
        const violations: string[] = [];
        let score = 1.0;

        // Rule 1: ESG Integrity - No Calculated status without evidence
        if (core.status === 'Calculated' && !core.evidence.tangible) {
            violations.push('ESG_INTEGRITY_VIOLATION: Tangible evidence missing for calculated state.');
            score -= 0.5;
        }

        // Rule 2: Quantum Sovereignty - V12.0 Cores must be quantum-anchored
        if (core.version.startsWith('12.0') && !(core.evidence.trustworthy as any)?.quantum_anchor) {
            violations.push('QUANTUM_SOVEREIGNTY_VIOLATION: Eternal cores must be quantum-anchored.');
            score -= 0.5;
        }

        // Rule 3: Entropy Check
        if (core.status === 'Violated' && score > 0.5) {
            score = 0.5; // Cap score on violations
        }

        const isValid = score > 0.6;

        if (!isValid) {
            omniLogger.critical(LogCategory.SOVEREIGN, 'CONSTITUTIONAL BREACH DETECTED', {
                uuid: core.uuid,
                score,
                violations
            });
            this.triggerCircuitBreaker(core.uuid);
        }

        return {
            isValid,
            score,
            violations,
            resonancePattern: isValid ? 'HARMONY' : 'DISSONANCE'
        };
    }

    /**
     * Automated circuit-breaker logic to prevent systemic collapse.
     */
    private triggerCircuitBreaker(targetId: string): void {
        omniLogger.critical(LogCategory.SOVEREIGN, `🛑 CIRCUIT BREAKER TRIGGERED for ${targetId}. System in Restricted Sovereignty Mode.`);
        this.isLocked = true;
    }

    public isSystemLocked(): boolean {
        return this.isLocked;
    }

    public resetSovereignty(): void {
        omniLogger.info(LogCategory.SOVEREIGN, '🔄 Sovereignty Reset - Constitution Re-verified.');
        this.isLocked = false;
    }
}

export const omniConstitutionService = OmniConstitutionService.getInstance();
