/**
 * OmniInfoNode - Governance and self-healing layer (For/4)
 */
import { OmniInfoOneCore } from './OmegaInfoOneCore';
export declare class OmniInfoNode {
    /**
     * Process core data applying zero-hallucination verification
     * @param core - The OmniInfoOneCore to process
     * @param options - Processing options (entropyControl, healing)
     * @returns Resonance value (Rs) representing alignment with developer intent
     */
    static process(core: OmniInfoOneCore, options?: {
        entropyControl?: number;
        healing?: boolean;
    }): Promise<number>;
}
//# sourceMappingURL=OmniInfoNode.d.ts.map