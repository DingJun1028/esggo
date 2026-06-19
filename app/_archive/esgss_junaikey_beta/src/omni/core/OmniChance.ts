import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';
import { omniFortune } from './OmniFortune.ts';

/**
 * 🎲 OmniChance: The Sovereign Chance (Probability/Luck)
 * --------------------------------------------------
 * [核心] "萬能機緣" (Universal Chance) / "主權運氣" (Sovereign Luck)
 * 5T Alignment: Transparent (Odds), Traceable (Outcome)
 * Role: Manages random number generation, probability calculations, and "fate" mechanics.
 */
export class OmniChance {
    private static instance: OmniChance;

    private constructor() {
        omniLogger.info(LogCategory.SYSTEM, '🎲 OmniChance Initialized');
    }

    public static getInstance(): OmniChance {
        if (!OmniChance.instance) {
            OmniChance.instance = new OmniChance();
        }
        return OmniChance.instance;
    }

    /**
     * 🎲 Roll/Cast with "斯福氣" (Sovereign Fortune) influence
     * @param range Range or type of roll (e.g., 'd20', '1-100')
     */
    public async roll(range: string = '1-100'): Promise<IVerifiedResponse> {
        const timestamp = Date.now();
        const fortuneBonus = omniFortune.calculateBonus();

        // Simulation logic
        let rawResult = 0;
        if (range === 'd20') rawResult = Math.floor(Math.random() * 20) + 1;
        else rawResult = Math.floor(Math.random() * 100) + 1;

        // Apply Fortune Bonus (斯福氣加成)
        const finalResult = rawResult + fortuneBonus;
        const isLucky = finalResult > (range === 'd20' ? 18 : 90);

        // "際遇" (Encounter) Trigger Logic - 10% base chance + fortune influence
        const encounterTrigger = Math.random() * 100;
        const hasEncounter = encounterTrigger < (10 + fortuneBonus);

        const validRequest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `CHANCE:ROLL:${range}`,
            timestamp,
            source: 'OmniChance',
            tags: ['chance', 'probability', 'roll', 'fortune_influenced'],
            payload: {
                range,
                rawResult,
                fortuneBonus,
                finalResult,
                hasEncounter
            }
        };

        return {
            core: validRequest,
            message: `Rolled ${finalResult} (Raw: ${rawResult}, Bonus: +${fortuneBonus.toFixed(1)}) on ${range}`,
            verified: true,
            data: {
                roll: finalResult,
                raw: rawResult,
                bonus: fortuneBonus,
                range,
                lucky: isLucky,
                triggeredEncounter: hasEncounter
            },
            source_origin: 'OmniChance',
            five_t_ref: `LUCK-${timestamp}`
        };
    }
}

export const omniChance = OmniChance.getInstance();
