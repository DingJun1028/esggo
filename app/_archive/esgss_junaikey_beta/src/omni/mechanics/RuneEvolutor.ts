
import { IRuneEvolution } from '@/types/omni-mechanics.ts';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';

import { AIPartner, PartnerAttributes } from '@/types/aiPartner.ts';
import { Rune } from '@/types/core.ts'; // Assuming Rune definition exists

export interface MutationResult {
    trait: string;
    effect: string;
    powerBonus: number;
}

/**
 * 🧪 符文演化器 (RuneEvolutor)
 * Handles experience gain and random mutation events for Runes.
 */
export class RuneEvolutor {
    private static readonly BASE_MUTATION_CHANCE = 0.02; // 2% 基礎變異率

    /**
     * 嘗試觸發符文變異
     * @param rune The rune being used
     * @param partner The partner using the rune
     */
    public static attemptMutation(rune: IRuneEvolution, partner: AIPartner): MutationResult | null {
        const complexity = rune.complexity;
        // Assuming usageCount corresponds to experience or a separate counter in adaptationStats
        const adaptiveRate = (rune.adaptiveStats.focusEfficiency * 10) || 1;

        // 計算變異機率 Formula: P_m = P_b + ln(C * A + 1) * 0.01
        const mutationChance = this.BASE_MUTATION_CHANCE + Math.log(complexity * adaptiveRate + 1) * 0.01;
        const roll = Math.random();

        omniLogger.info(LogCategory.SYSTEM, '[RuneEvolutor] Info', { data: `[RuneEvolutor] Rolling for mutation: ${roll.toFixed(4)} vs Chance: ${mutationChance.toFixed(4)}` });

        if (roll < mutationChance) {
            // 觸發變異：根據夥伴最強屬性決定變異方向
            return this.generateMutation(partner.attributes);
        }

        return null;
    }

    private static generateMutation(attrs: PartnerAttributes): MutationResult {
        if ((attrs.creativity || 0) > 8) {
            return { trait: 'EMERGENT_CREATIVITY', effect: '解鎖非線性推理路徑', powerBonus: 1.2 };
        }
        if ((attrs.wisdom || 0) > 8) {
            return { trait: 'DEEP_SYNERGY', effect: '降低 30% 符文共鳴冷卻', powerBonus: 1.1 };
        }
        if ((attrs.courage || 0) > 8) {
            return { trait: 'INSTANT_EMERGENCE', effect: '符文冷卻時間縮短為 0，但消耗雙倍 Focus', powerBonus: 1.3 };
        }
        if ((attrs.integrity || 0) > 8) {
            return { trait: 'IMMUTABLE_TRUTH', effect: '免疫任何「邏輯謬誤」類型的負面狀態', powerBonus: 1.05 };
        }
        if ((attrs.benevolence || 0) > 8) {
            return { trait: 'EMPATHIC_FIELD', effect: '將造成的 Credibility 傷害按 20% 轉化為自身 HP', powerBonus: 1.0 };
        }

        return { trait: 'STABLE_STRUCTURE', effect: '提升 15% 基礎成功率', powerBonus: 1.05 };
    }
}

/** 📈 符文升級演算法 */
export const RuneProficiencyFormula = {
    // 核心公式：NextLevelExp = Base * (CurrentLevel ^ Complexity)
    calculateExpToNext: (level: number, complexity: number): number => {
        const base = 500;
        return Math.floor(base * Math.pow(level, 1.5) * complexity);
        // From text: E = B . (L^1.5 . C)
        // Wait, text said: E = B . (L1.5 . C) which is L^1.5 or L*1.5 ? 
        // Text: "E=B⋅（L1.5⋅C ）" -> Usually means L^1.5 in gaming formulas.
    },

    // 成功率受「誠 (Integrity)」與「智 (Intelligence)」加權
    calculateSuccessRate: (baseRate: number, partner: PartnerAttributes): number => {
        return (baseRate + ((partner.intelligence || 0) * 0.02) + ((partner.integrity || 0) * 0.01));
    }
};
