/**
 * ✨ OmniAura: Dimensional Manifestation (Beauty / Tasteful)
 * --------------------------------------------------
 * Visualizing the health and integrity of an Atom.
 */

import { IOmniAtom } from './omni-types';
import { OmniCoreVerifier } from './omni-verifier';

export enum AuraState {
    LIQUID_GOLD = 'Liquid_Gold',     // Perfect (Genesis level)
    LIQUID_GLASS = 'Liquid_Glass',   // Healthy
    FROZEN = 'Frozen',               // Archived/Static
    SHATTERED = 'Shattered',         // Corrupted/Invalid
    GLITCH = 'Glitch'                // Unverified/Entropy
}

export class OmniAura {
    /**
     * 🔮 Project Aura: Calculate the visual manifestation of an Atom
     */
    static project(atom: IOmniAtom<any>): AuraState {
        const isIntegrityValid = OmniCoreVerifier.verifyIntegrity(atom);

        if (!isIntegrityValid) return AuraState.SHATTERED;

        if (atom.status === "Trustworthy") {
            if (atom.uuid.startsWith("GENESIS")) return AuraState.LIQUID_GOLD;
            return AuraState.LIQUID_GLASS;
        }

        if (atom.status === "Archived") return AuraState.FROZEN;

        return AuraState.GLITCH;
    }

    /**
     * 🎨 Get Style metadata for UI Rendering
     */
    static getStyle(state: AuraState) {
        switch (state) {
            case AuraState.LIQUID_GOLD: return { color: '#ffd700', opacity: 1.0, animation: 'pulse-glow' };
            case AuraState.LIQUID_GLASS: return { color: '#63a6b0', opacity: 0.8, animation: 'fluid-wave' };
            case AuraState.SHATTERED: return { color: '#ff4d4d', opacity: 0.5, animation: 'glitch-static' };
            default: return { color: '#cccccc', opacity: 0.3, animation: 'none' };
        }
    }
}
