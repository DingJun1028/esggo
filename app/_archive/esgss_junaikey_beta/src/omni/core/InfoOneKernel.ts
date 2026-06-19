import { IMeritProfile10 } from '../../types/esgss_schema.ts';

/**
 * 🧠 InfoOne Kernel Interface
 * --------------------------------------------------
 * The deep logic core that validates "Sense Data" (Virtues) against "Truth" (Consensus).
 */
export interface IInfoOneKernel {
    verifyVirtueData(virtues: IMeritProfile10): {
        verified: boolean;
        confidence: number;
        adjustedVirtues?: IMeritProfile10;
        reason?: string;
    };
}

/**
 * 🧠 InfoOne Kernel Implementation
 * --------------------------------------------------
 * [TC] 奧秘內核，負責深度滲透邏輯檢查。
 * [EN] InfoOne Kernel, responsible for deep penetration logic checks.
 * 
 * [Logic]
 * - Verifies consistency between Intelligence (Ren) and Integrity (Du).
 * - Detects "Logic-Sense" conflicts.
 */
export class InfoOneKernel implements IInfoOneKernel {
    public verifyVirtueData(virtues: IMeritProfile10): {
        verified: boolean;
        confidence: number;
        adjustedVirtues?: IMeritProfile10;
        reason?: string;
    } {
        // 1. Consistency Check: Intelligence vs Integrity
        // High Intelligence needs at least Moderate Integrity to be "Safe"
        if (virtues.intelligence > 8 && virtues.integrity < 5) {
            return {
                verified: false,
                confidence: 0.4,
                reason: 'High Intelligence without sufficient Integrity detected.',
                adjustedVirtues: {
                    ...virtues,
                    intelligence: 8, // Cap intelligence until integrity improves
                }
            };
        }

        // 2. Harmony Check: Temperance vs Courage
        // Excessive Courage without Temperance = Recklessness
        if (virtues.courage > 9 && virtues.temperance < 3) {
            return {
                verified: false,
                confidence: 0.6,
                reason: 'Recklessness Detected (High Courage / Low Temperance).',
                adjustedVirtues: {
                    ...virtues,
                    courage: 7, // Dampen courage
                }
            };
        }

        // 3. Benevolence Baseline
        if (virtues.benevolence < 1) {
            return {
                verified: false,
                confidence: 0.1,
                reason: 'Zero Benevolence violates Omni-Core Principles.',
                adjustedVirtues: {
                    ...virtues,
                    benevolence: 1, // Minimum baseline
                }
            };
        }

        return {
            verified: true,
            confidence: 1.0,
            reason: 'Virtue Profile Resonates with Omni Truth.',
        };
    }
}
