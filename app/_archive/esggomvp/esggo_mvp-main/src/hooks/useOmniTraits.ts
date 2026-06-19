import { useMemo } from 'react';
import { EvolutionaryTrait } from '../components/omni/cards/OmniEsgCell';

interface SentientState {
    entropy: number;  // 0-1
    harmony: number;  // 0-1
    resonance: number; // 0-100
    phase: string;
}

/**
 * useOmniTraits Hook
 * Automatically derives evolutionary traits and visual effects from the Atom's sentient state.
 */
export const useOmniTraits = (state?: SentientState, baseTraits: EvolutionaryTrait[] = []) => {
    return useMemo(() => {
        if (!state) return { traits: baseTraits, auraEffect: 'none', glowColor: 'transparent' };

        const derivedTraits = new Set<EvolutionaryTrait>(baseTraits);

        // 1. Logic for trait evolution based on resonance
        if (state.resonance > 90) derivedTraits.add('evolution');
        if (state.resonance > 70) derivedTraits.add('optimization');

        // 2. Logic for entropy (disorder)
        if (state.entropy > 0.5) derivedTraits.add('gap-filling');

        // 3. Logic for harmony (order)
        if (state.harmony > 0.8) derivedTraits.add('seamless');

        // 4. Fluidity & Sentiment Logic (Principle 1: Sentient)
        const fluidity = Math.min(1, (state.resonance / 100) * (1 - state.entropy));

        // Visual Morphing Effects
        let auraEffect = 'none';
        let glowColor = 'transparent';

        if (state.entropy > 0.7) {
            auraEffect = 'flicker';
            glowColor = 'rgba(245, 34, 45, 0.3)'; // Red alert
        } else if (state.resonance > 85) {
            auraEffect = 'pulse-gold';
            glowColor = 'rgba(255, 215, 0, 0.4)'; // Eternal Gold glow
        } else if (fluidity > 0.6 || state.harmony > 0.7) {
            auraEffect = 'breathe-aqua';
            glowColor = 'rgba(99, 166, 176, 0.3)'; // Aqua Flow
        }

        return {
            traits: Array.from(derivedTraits),
            auraEffect,
            glowColor,
            fluidity // [NEW] Fluidity for sentient animation
        };
    }, [state, baseTraits]);
};
