
import { IDebateCard, IDebateEntity, DebateStrategy, ARVOState } from '@/types/omni-mechanics.ts';
import { AIPartner } from '@/types/aiPartner.ts';

/**
 * ⚖️ 辯論裁判引擎 (DebateJudgeEngine)
 * 負責計算每一輪辯論的邏輯衝擊與結果
 */
export class DebateJudgeEngine {
    /**
     * 執行一輪辯論動作
     * @param action The card played
     * @param actor The entity playing the card (converted to AIPartner for stats Access)
     * @param defender The target entity
     * @param truthScore ARVO/RAG verified truth score (0.0 - 1.0)
     */
    public static calculateTurn(
        action: IDebateCard,
        actor: AIPartner,
        defender: IDebateEntity,
        truthScore: number
    ): { credibilityDamage: number; focusCost: number; isHallucinated: boolean; log: string } {

        // 1. 檢測幻覺 (Zero-Hallucination Guard)
        // 如果真相分數低於閾值，視為「胡言亂語」，動作失敗並反噬自身
        if (truthScore < 0.6) {
            const penaltyCost = Math.floor(action.cost * 1.5);
            return {
                credibilityDamage: 0,
                focusCost: penaltyCost,
                isHallucinated: true,
                log: `⚠️ Hallucination Detected (Score: ${truthScore}). Action failed. Focus drained by ${penaltyCost}.`
            };
        }

        // 2. 計算德行加成 (Virtue Modifiers)
        // 智 (Intelligence) 提升攻擊力；誠 (Integrity) 減少自身消耗
        // Accessing attributes directly or assuming they are at root if AIPartner interface differs
        const intelligence = actor.attributes?.intelligence || 5;
        const integrity = actor.attributes?.integrity || 5;

        const intelligenceBonus = 1 + (intelligence / 20);
        const integrityReduction = integrity * 0.5;

        // 3. 策略克制倍率 (Strategy Multiplier)
        const defenderStrategy = defender.argumentChain.length > 0
            ? defender.argumentChain[defender.argumentChain.length - 1]
            : 'LOGIC_FALLACY'; // Default fallback

        const strategyMultiplier = this.getStrategyMultiplier(action.strategy, defenderStrategy);

        // 4. 最終傷害公式 (LaTeX 邏輯)
        // Damage = BaseValue * IntelligenceBonus * StrategyMultiplier * TruthScore
        const finalDamage = Math.floor(
            action.value * intelligenceBonus * strategyMultiplier * truthScore
        );

        const finalFocusCost = Math.max(1, action.cost - integrityReduction);

        return {
            credibilityDamage: finalDamage,
            focusCost: finalFocusCost,
            isHallucinated: false,
            log: `Action Valid. Dealt ${finalDamage} Credibility Dmg. (Strat Mult: ${strategyMultiplier}x)`
        };
    }

    private static getStrategyMultiplier(attacker: DebateStrategy, defender: DebateStrategy): number {
        const counterMap: Record<DebateStrategy, DebateStrategy> = {
            LOGIC_FALLACY: 'ETHICAL_SUPERIORITY', // 邏輯謬誤被倫理優勢克制
            EMOTIONAL_APPEAL: 'LOGIC_FALLACY',    // 感性訴求被邏輯謬誤拆解
            EVIDENCE_CRUSH: 'EMOTIONAL_APPEAL',   // 證據碾壓被感性訴求規避
            ETHICAL_SUPERIORITY: 'EVIDENCE_CRUSH' // 倫理優勢被硬證據擊碎
        };

        // If attacker strategy COUNTERS defender strategy
        if (counterMap[attacker] === defender) {
            return 1.5;
        }

        // Reverse check: Does defender counter attacker? (Resistance) - Optional logic, keeping it simple 1.0
        return 1.0;
    }
}
