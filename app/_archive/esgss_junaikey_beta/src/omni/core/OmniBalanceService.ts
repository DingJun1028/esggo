import { IBalanceFulcrum, BalanceDynamics, BalanceState } from '../../0-domain/contracts/IBalanceFulcrum.ts';
import { IMeritProfile10 } from '../../0-domain/contracts/IComponentCore.ts';

/**
 * ☯️ Omni Balance Service (The Fulcrum)
 * --------------------------------------------------
 * Implements the MECE logic to determine the system's "Middle Path" state.
 * 
 * MECE Logic:
 * 1. Accumulation (Yin): Low Energy or High Stress -> Focus Inward.
 * 2. Expression (Yang): High Energy and Stability -> Focus Outward.
 * 3. Equilibrium (Taiji): Optimal Balance -> Unimpeded Flow.
 */
export class OmniBalanceService implements IBalanceFulcrum {

    public calculateBalance(virtues: IMeritProfile10): BalanceDynamics {
        // 1. Calculate Core Energies
        // Vitality (HP-source) maps to Benevolence
        const vitality = virtues.benevolence;

        // Stability (DEF-source) maps to Integrity
        const stability = virtues.integrity;

        // Drive (ATK-source) maps to Courage
        const drive = virtues.courage;

        // Control (Efficiency) maps to Temperance
        const control = virtues.temperance;

        // 2. Determine State via MECE Analysis
        let state: BalanceState;

        // Condition A: Needs Accumulation? (Low Vitality OR Low Stability)
        // If the foundation is weak, we must turn inward.
        if (vitality < 5 || stability < 4) {
            state = 'ACCUMULATION';
        }
        // Condition B: Ready for Expression? (High Vitality AND High Drive AND Moderate Control)
        // If we have energy and drive, and enough control to not crash, we express.
        else if (vitality >= 7 && drive >= 7 && control >= 3) {
            state = 'EXPRESSION';
        }
        // Condition C: Equilibrium (The Middle Path)
        // Not critical, but not necessarily explosive. Steady state.
        else {
            state = 'EQUILIBRIUM';
        }

        // 3. Calculate Gains based on State
        let inputGain = 1.0;
        let outputGain = 1.0;
        let resonance = 0.5;

        switch (state) {
            case 'ACCUMULATION':
                // Amplify Inward (Self-Repair), Dampen Outward (Conservation)
                inputGain = 1.5;
                outputGain = 0.5;
                resonance = 0.4;
                break;

            case 'EXPRESSION':
                // Amplify Outward (Impact), Dampen Inward (Consumption)
                inputGain = 0.8;
                outputGain = 1.4;
                resonance = 0.8;
                break;

            case 'EQUILIBRIUM':
                // Perfect 1:1 Flow (Golden Mean)
                inputGain = 1.1; // Slight positive bias for growth
                outputGain = 1.1;
                resonance = 1.0;
                break;
        }

        return {
            state,
            inputGain,
            outputGain,
            resonance
        };
    }
}
