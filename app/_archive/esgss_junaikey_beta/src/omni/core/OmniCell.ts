import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ?�� OmniCell: The Sovereign Cell (Unit/Life)
 * 
 * Concept: "?�能細�?" (Universal Cell) / "主�?細�?" (Sovereign Cell)
 * 
 * Role:
 * - The fundamental living unit of the system.
 * - Carries DNA (OmniConcept) and Energy (OmniOrb).
 * - Can differentiate into specialized forms (OmniESGCell).
 * - Self-contained, self-replicating, and self-governing on a micro scale.
 * 
 * 5T Protocol Level: Traceable (Source of Life)
 */
export class OmniCell {
    private static instance: OmniCell;
    private core: OmniCore;

    private constructor() {
        this.core = OmniCore.getInstance();
    }

    public static getInstance(): OmniCell {
        if (!OmniCell.instance) {
            OmniCell.instance = new OmniCell();
        }
        return OmniCell.instance;
    }

    /**
     * ?�� Metabolize: Process energy and information
     * @param input.nutrient Data or Energy source
     * @param input.type Cell type (generic or esg)
     */
    public async metabolize(input: { nutrient: string, type?: string }): Promise<IVerifiedResponse> {
        const timestamp = Date.now();
        const { nutrient, type } = input;

        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND', // or PROCESS/METABOLIZE
            content: `CELL_METABOLIZE:[${type || 'generic'}] ${nutrient}`,
            timestamp,
            source: 'OmniCell',
            tags: ['cell', 'metabolism', 'life', 'unit'],
            payload: input
        };

        // 1. Verify Request (Micro-Governance)
        if (!nutrient) {
            return {
                core: manifest,
                verified: false,
                message: 'Nutrient (data/energy) required for metabolism.',
                source_origin: 'OmniCell',
                five_t_ref: 'FAIL_STARVATION',
                payload: { error: 'Nutrient required' }
            };
        }

        // 2. Metabolize (Process)
        let product;
        const cellType = type || 'generic';

        if (cellType === 'esg' || cellType === 'OmniESGCell') {
            product = `ESG_Vitality[${nutrient}]`; // e.g., Carbon Credit, Social Impact
        } else {
            product = `Cellular_Energy[${nutrient}]`;
        }

        console.log(`[OmniCell] ?�� Metabolizing [${cellType}]: ${nutrient} -> ${product}`);

        // 3. Return Verified Output (Vitality)
        const validRequest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: 'OmniCell Metabolize',
            timestamp: Date.now(),
            source: 'OmniCell',
            tags: [],
            payload: { nutrient, type }
        };

        return {
            core: validRequest,
            message: 'Metabolism Complete',
            verified: true,
            payload: { // Changed 'data' to 'payload' to match IVerifiedResponse interface
                output: product,
                health: '100%'
            },
            source_origin: 'OmniCell',
            five_t_ref: `CELL-${Date.now()}`
        };
    }
}
