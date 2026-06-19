import { IMeritProfile10 } from './IComponentCore';

/**
 * ☯️ InfoOne Middle Path Fulcrum
 * --------------------------------------------------
 * The contract for the dynamic balancer that regulates the
 * ratio between Deep Penetration (Ren/Inward) and Broad Connectivity (Du/Outward).
 */

export type BalanceState = 'ACCUMULATION' | 'EXPRESSION' | 'EQUILIBRIUM';

export interface BalanceDynamics {
    state: BalanceState;
    inputGain: number;  // Multiplier for Virtue Strengthening (Inward)
    outputGain: number; // Multiplier for VFX/Sync Expression (Outward)
    resonance: number;  // The calculated "Middle Path" score (0.0 - 1.0)
}

export interface IBalanceFulcrum {
    /**
     * Calculates the current dynamic balance based on virtues.
     * Uses MECE analysis to determine the optimal state.
     */
    calculateBalance(virtues: IMeritProfile10): BalanceDynamics;
}
