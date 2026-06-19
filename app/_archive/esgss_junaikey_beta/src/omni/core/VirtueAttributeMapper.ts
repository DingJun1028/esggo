/**
 * 💡 Omni Core: Virtue to Attribute Mapper (Deep Symbiosis Layer 1)
 * ----------------------------------------------------------------
 * Maps User Virtues (IMeritProfile10) to Logic-Game Attributes (PartnerAttributes).
 * Implements the "Logic to Senses" philosophy of the OMNI_ARCH_DEEP_SYMBIOSIS.
 */

import { IMeritProfile10 } from '../../types/core.ts';
import { PartnerAttributes, IAttributeConverter } from '../../0-domain/contracts/IVirtueEngine.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';

import { IInfoOneKernel, InfoOneKernel } from './InfoOneKernel.ts';

export class VirtueAttributeMapper implements IAttributeConverter {
    private infoOneKernel: IInfoOneKernel;

    constructor(kernel?: IInfoOneKernel) {
        // [Deep Penetration] Inject Kernel or use default instance
        this.infoOneKernel = kernel || new InfoOneKernel();
    }

    /**
     * Converts 10-tier Virtues into 7-tier Game Attributes
     * @param virtues The user's virtue profile (1-10)
     */
    public convert(virtues: IMeritProfile10): PartnerAttributes {
        let sourceVirtues = { ...virtues };

        // 1. InfoOne Integrity Check (Deep Symbiosis Layer 2 Interceptor)
        const verification = this.infoOneKernel.verifyVirtueData(sourceVirtues);
        if (!verification.verified) {
            omniLogger.warn(LogCategory.VALIDATION, `[VirtueMapper] ⚠️ InfoOne detected anomalies: ${verification.reason} (Confidence: ${verification.confidence})`);
            // If InfoOne provides "Threat Truth" adjusted values, use them
            if (verification.adjustedVirtues) {
                sourceVirtues = verification.adjustedVirtues;
            }
        }

        // 2. Core Mapping Logic (The "Logic to Senses" translation)

        // HP (Vitality/Resonance) -> Benevolence (Social Impact)
        // The capacity to sustain and resonate with stakeholders.
        const hp = Math.min(10, Math.max(1, sourceVirtues.benevolence));

        // MP (Cognition/Strategy) -> Intelligence (AI/Reform)
        // The capacity for complex reasoning and strategic planning.
        const mp = Math.min(10, Math.max(1, sourceVirtues.intelligence));

        // ATK (Execution/Transformation) -> Courage (Action)
        // The power to execute change and break through barriers.
        const atk = Math.min(10, Math.max(1, sourceVirtues.courage));

        // DEF (Trust/Stability) -> Integrity (Data Faith)
        // The structural integrity to resist tampering and risk.
        const def = Math.min(10, Math.max(1, sourceVirtues.integrity));

        // Speed (Adaptability/Flow) -> Harmony + Courage
        // Speed requires both the courage to move and the harmony to flow without friction.
        const speed = Math.min(10, Math.max(1, Math.round((sourceVirtues.harmony + sourceVirtues.courage) / 2)));

        // Luck (Serendipity/Efficiency) -> Temperance + Harmony
        // Luck is often efficiency (Temperance) meeting opportunity (Harmony).
        // "Resource conversion rate" (Temperance) is a key factor in RPG drop rates (Luck).
        const luck = Math.min(10, Math.max(1, Math.round((sourceVirtues.temperance * 0.7) + (sourceVirtues.harmony * 0.3))));

        // Focus (Precision/Will) -> Intelligence + Integrity
        // Unwavering adherence to logic (Intelligence) and principle (Integrity).
        const focus = Math.min(10, Math.max(1, Math.round((sourceVirtues.intelligence + sourceVirtues.integrity) / 2)));

        return {
            hp,
            mp,
            atk,
            def,
            speed,
            luck,
            focus
        };
    }

    /**
     * Static helper for direct usage without kernel injection
     */
    static map(virtues: IMeritProfile10): PartnerAttributes {
        return new VirtueAttributeMapper().convert(virtues);
    }
}
