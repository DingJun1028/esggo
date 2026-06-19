import { omniLogger, LogCategory } from './omni/infrastructure/logging/OmniLogger.js';

export interface ValueVector {
    environmental: number;
    social: number;
    governance: number;
    innovation: number;
}

/**
 * Phase 46: 我的北極星 (My North Star)
 * Maps personal ESG values to corporate goals using "Optical Mapping" logic.
 */
export class NorthStarService {

    /**
     * Calculates the "North Star Consistency Score".
     * @param personal User's value preferences
     * @param corporate Organization's target vectors
     */
    public calculateConsistency(personal: ValueVector, corporate: ValueVector): number {
        omniLogger.info(LogCategory.SYSTEM, '[NorthStar] Performing optical mapping and alignment...');

        // Vector alignment using cosine similarity (simplified)
        const dotProduct =
            (personal.environmental * corporate.environmental) +
            (personal.social * corporate.social) +
            (personal.governance * corporate.governance) +
            (personal.innovation * corporate.innovation);

        const magPersonal = Math.sqrt(
            Math.pow(personal.environmental, 2) +
            Math.pow(personal.social, 2) +
            Math.pow(personal.governance, 2) +
            Math.pow(personal.innovation, 2)
        );

        const magCorporate = Math.sqrt(
            Math.pow(corporate.environmental, 2) +
            Math.pow(corporate.social, 2) +
            Math.pow(corporate.governance, 2) +
            Math.pow(corporate.innovation, 2)
        );

        if (magPersonal === 0 || magCorporate === 0) return 0;

        const score = (dotProduct / (magPersonal * magCorporate)) * 100;

        omniLogger.info(LogCategory.SYSTEM, `[NorthStar] Alignment Score: ${score.toFixed(2)}%`);
        return score;
    }

    public getDefaultCorporateVector(): ValueVector {
        return {
            environmental: 0.8,
            social: 0.7,
            governance: 0.9,
            innovation: 0.85
        };
    }
}

export const northStarService = new NorthStarService();
