/**
 * AIDecisionService.ts
 * AI 決策引擎：處理 AI 戰鬥決策、學習、策略調整
 * 
 * 核心功能：
 * - AI 動作決策（基於性格）
 * - 戰鬥後學習
 * - 策略優化
 * - 難度調整
 */

import { BattleState, BattleAction, Card, Player } from '../../types/game.js';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabase: SupabaseClient = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
);

export interface AICompanion {
    id: string;
    aiType: 'GUARDIAN' | 'SCHOLAR' | 'WARRIOR' | 'SAGE';
    personality: 'AGGRESSIVE' | 'DEFENSIVE' | 'BALANCED' | 'ADAPTIVE';
    level: number;
    virtues: {
        intelligence: number;
        benevolence: number;
        integrity: number;
        courage: number;
        temperance: number;
        harmony: number;
    };
    battleStrategy: {
        aggressionLevel: number;
        defensePriority: number;
        cardPreference: string[];
    };
}

export class AIDecisionService {
    /**
     * AI 決定下一步動作
     */
    static async decideAction(
        battleState: BattleState,
        aiPlayer: Player,
        aiCompanion: AICompanion
    ): Promise<BattleAction> {
        const personality = aiCompanion.personality;

        switch (personality) {
            case 'AGGRESSIVE':
                return this.aggressiveStrategy(battleState, aiPlayer);
            case 'DEFENSIVE':
                return this.defensiveStrategy(battleState, aiPlayer);
            case 'BALANCED':
                return this.balancedStrategy(battleState, aiPlayer);
            case 'ADAPTIVE':
                return this.adaptiveStrategy(battleState, aiPlayer, aiCompanion);
            default:
                return this.balancedStrategy(battleState, aiPlayer);
        }
    }

    /**
     * 進攻型策略
     */
    private static aggressiveStrategy(state: BattleState, aiPlayer: Player): BattleAction {
        // 優先出攻擊力最高的卡
        if (aiPlayer.hand.length > 0 && aiPlayer.energy >= 1) {
            const bestCard = aiPlayer.hand
                .filter((card) => card.energy_cost <= aiPlayer.energy)
                .sort((a, b) => b.attack_power - a.attack_power)[0];

            if (bestCard) {
                return {
                    actionType: 'PLAY_CARD',
                    cardId: bestCard.id,
                };
            }
        }

        // 如果場上有卡，直接攻擊
        if (aiPlayer.field.length > 0) {
            return {
                actionType: 'ATTACK',
                target: 'opponent',
            };
        }

        // 否則結束回合
        return { actionType: 'END_TURN' };
    }

    /**
     * 防守型策略
     */
    private static defensiveStrategy(state: BattleState, aiPlayer: Player): BattleAction {
        const opponent = aiPlayer.id === state.player1.id ? state.player2 : state.player1;

        // 如果對手場上有卡且自己防禦不足，優先出防禦卡
        if (opponent.field.length > 0 && aiPlayer.field.length < 3) {
            const bestDefenseCard = aiPlayer.hand
                .filter((card) => card.energy_cost <= aiPlayer.energy)
                .sort((a, b) => b.defense_power - a.defense_power)[0];

            if (bestDefenseCard) {
                return {
                    actionType: 'PLAY_CARD',
                    cardId: bestDefenseCard.id,
                };
            }
        }

        // 如果血量低於 50，保守策略
        if (aiPlayer.health < 50) {
            return { actionType: 'END_TURN' };
        }

        // 否則正常攻擊
        if (aiPlayer.field.length > 0) {
            return {
                actionType: 'ATTACK',
                target: 'opponent',
            };
        }

        return { actionType: 'END_TURN' };
    }

    /**
     * 平衡型策略
     */
    private static balancedStrategy(state: BattleState, aiPlayer: Player): BattleAction {
        const opponent = aiPlayer.id === state.player1.id ? state.player2 : state.player1;

        // 評估局勢
        const myPower = this.evaluatePower(aiPlayer);
        const opponentPower = this.evaluatePower(opponent);

        // 如果優勢，進攻
        if (myPower > opponentPower * 1.2) {
            return this.aggressiveStrategy(state, aiPlayer);
        }

        // 如果劣勢，防守
        if (myPower < opponentPower * 0.8) {
            return this.defensiveStrategy(state, aiPlayer);
        }

        // 平衡狀態：優先出性價比最高的卡
        if (aiPlayer.hand.length > 0 && aiPlayer.energy >= 1) {
            const bestCard = aiPlayer.hand
                .filter((card) => card.energy_cost <= aiPlayer.energy)
                .sort((a, b) => {
                    const aValue = (a.attack_power + a.defense_power) / a.energy_cost;
                    const bValue = (b.attack_power + b.defense_power) / b.energy_cost;
                    return bValue - aValue;
                })[0];

            if (bestCard) {
                return {
                    actionType: 'PLAY_CARD',
                    cardId: bestCard.id,
                };
            }
        }

        // 如果場上有足夠的卡，攻擊
        if (aiPlayer.field.length >= 2) {
            return {
                actionType: 'ATTACK',
                target: 'opponent',
            };
        }

        return { actionType: 'END_TURN' };
    }

    /**
     * 自適應策略（學習型）
     */
    private static adaptiveStrategy(
        state: BattleState,
        aiPlayer: Player,
        aiCompanion: AICompanion
    ): BattleAction {
        // 根據歷史戰鬥數據調整策略
        const strategy = aiCompanion.battleStrategy;

        // 使用學習到的偏好
        if (aiPlayer.hand.length > 0 && aiPlayer.energy >= 1) {
            const preferredCard = aiPlayer.hand
                .filter((card) => card.energy_cost <= aiPlayer.energy)
                .find((card) => strategy.cardPreference.includes(card.card_code));

            if (preferredCard) {
                return {
                    actionType: 'PLAY_CARD',
                    cardId: preferredCard.id,
                };
            }
        }

        // 根據進攻性等級決定
        if (strategy.aggressionLevel > 70) {
            return this.aggressiveStrategy(state, aiPlayer);
        } else if (strategy.defensePriority > 70) {
            return this.defensiveStrategy(state, aiPlayer);
        } else {
            return this.balancedStrategy(state, aiPlayer);
        }
    }

    /**
     * 評估戰力
     */
    private static evaluatePower(player: Player): number {
        const fieldPower = player.field.reduce(
            (sum, card) => sum + card.attack_power + card.defense_power,
            0
        );
        const handPotential = player.hand.reduce(
            (sum, card) => sum + (card.attack_power + card.defense_power) * 0.5,
            0
        );
        return fieldPower + handPotential + player.health * 0.5;
    }

    /**
     * 戰鬥後學習
     */
    static async learnFromBattle(
        battleRecord: any,
        aiCompanionId: string
    ): Promise<void> {
        const { data: aiCompanion } = await supabase
            .from('ai_companions')
            .select('*')
            .eq('id', aiCompanionId)
            .single();

        if (!aiCompanion) return;

        // 分析戰鬥記錄
        const battleLog = battleRecord.battle_log || [];
        const isWinner = battleRecord.winner_id === aiCompanion.user_id;

        // 提取使用的卡牌
        const usedCards = battleLog
            .filter((log: any) => log.action === 'PLAY_CARD')
            .map((log: any) => log.details.cardCode);

        // 更新策略
        const currentStrategy = aiCompanion.battle_strategy || {
            aggressionLevel: 50,
            defensePriority: 50,
            cardPreference: [],
        };

        // 如果獲勝，強化當前策略
        if (isWinner) {
            currentStrategy.cardPreference = [
                ...new Set([...currentStrategy.cardPreference, ...usedCards]),
            ].slice(0, 10);
        }

        // 更新經驗值
        const expGain = isWinner ? 100 : 50;
        const newExp = aiCompanion.experience + expGain;
        const newLevel = Math.floor(newExp / 1000) + 1;

        // 更新六德（隨機成長）
        const virtues = aiCompanion.virtues || {};
        const randomVirtue = ['intelligence', 'benevolence', 'integrity', 'courage', 'temperance', 'harmony'][
            Math.floor(Math.random() * 6)
        ];
        virtues[randomVirtue] = Math.min(100, (virtues[randomVirtue] || 5) + 1);

        // 儲存更新
        await supabase
            .from('ai_companions')
            .update({
                level: newLevel,
                experience: newExp,
                virtues,
                battle_strategy: currentStrategy,
                total_battles: aiCompanion.total_battles + 1,
                win_count: isWinner ? aiCompanion.win_count + 1 : aiCompanion.win_count,
            })
            .eq('id', aiCompanionId);
    }

    /**
     * 根據難度調整 AI
     */
    static adjustDifficulty(
        aiCompanion: AICompanion,
        difficulty: 'EASY' | 'NORMAL' | 'HARD' | 'EXPERT' | 'MASTER'
    ): AICompanion {
        const adjusted = { ...aiCompanion };

        switch (difficulty) {
            case 'EASY':
                adjusted.battleStrategy.aggressionLevel = 30;
                adjusted.battleStrategy.defensePriority = 30;
                break;
            case 'NORMAL':
                adjusted.battleStrategy.aggressionLevel = 50;
                adjusted.battleStrategy.defensePriority = 50;
                break;
            case 'HARD':
                adjusted.battleStrategy.aggressionLevel = 70;
                adjusted.battleStrategy.defensePriority = 60;
                break;
            case 'EXPERT':
                adjusted.battleStrategy.aggressionLevel = 85;
                adjusted.battleStrategy.defensePriority = 75;
                break;
            case 'MASTER':
                adjusted.battleStrategy.aggressionLevel = 95;
                adjusted.battleStrategy.defensePriority = 90;
                break;
        }

        return adjusted;
    }
}
