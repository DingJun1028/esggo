/**
 * BattleEngine.ts
 * 戰鬥引擎核心：處理戰鬥邏輯、回合制系統、傷害計算
 * 
 * 核心功能：
 * - 戰鬥初始化
 * - 回合執行
 * - 傷害計算（六德匹配度）
 * - 勝負判定
 * - 戰鬥結算
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../ErrorHandler.js';
import { createHash } from 'crypto';
import { AIDecisionService, AICompanion } from './AIDecisionService.js';
import { redisService } from '../RedisService.js';

const supabase: SupabaseClient = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
);

import { Card, Player, BattleState, BattleAction, BattleConfig } from '../../types/game.js';

export class BattleEngine {
    /**
     * 初始化戰鬥
     */
    static async initializeBattle(config: BattleConfig): Promise<BattleState> {
        const { player1Id, player2Id, deck1Id, deck2Id, battleType, difficulty } = config;

        // 獲取牌組資料
        const deck1 = await this.loadDeck(deck1Id);
        const deck2 = await this.loadDeck(deck2Id);

        // 獲取玩家六德屬性
        const player1Virtues = await this.getPlayerVirtues(player1Id);
        const player2Virtues = await this.getPlayerVirtues(player2Id);

        // 洗牌
        const shuffledDeck1 = this.shuffleDeck(deck1);
        const shuffledDeck2 = this.shuffleDeck(deck2);

        // 初始抽牌（5張）
        const player1Hand = shuffledDeck1.splice(0, 5);
        const player2Hand = shuffledDeck2.splice(0, 5);

        // 創建初始狀態
        const battleState: BattleState = {
            battleId: this.generateBattleId(),
            currentRound: 1,
            currentTurn: 'player1',
            player1: {
                id: player1Id,
                health: 100,
                energy: 3,
                hand: player1Hand,
                deck: shuffledDeck1,
                field: [],
                graveyard: [],
                virtues: player1Virtues,
            },
            player2: {
                id: player2Id,
                health: 100,
                energy: 3,
                hand: player2Hand,
                deck: shuffledDeck2,
                field: [],
                graveyard: [],
                virtues: player2Virtues,
            },
            battleLog: [
                {
                    round: 0,
                    action: 'BATTLE_START',
                    details: { battleType, difficulty },
                },
            ],
            status: 'ONGOING',
            battleType,
            difficulty: difficulty || 'NORMAL',
        };

        // 儲存到資料庫
        await this.saveBattleState(battleState, config);

        return battleState;
    }

    /**
     * 執行戰鬥動作
     */
    static async executeTurn(
        battleId: string,
        playerId: string,
        action: BattleAction
    ): Promise<BattleState> {
        // 載入戰鬥狀態
        const state = await this.loadBattleState(battleId);

        if (state.status !== 'ONGOING') {
            throw new AppError('戰鬥已結束', 400);
        }

        // 驗證回合
        const currentPlayer = state.currentTurn === 'player1' ? state.player1 : state.player2;
        if (currentPlayer.id !== playerId) {
            throw new AppError('不是您的回合', 400);
        }

        // 執行動作
        switch (action.actionType) {
            case 'PLAY_CARD':
                await this.playCard(state, currentPlayer, action.cardId!);
                break;
            case 'ATTACK':
                await this.executeAttack(state, currentPlayer, action.target!);
                break;
            case 'END_TURN':
                await this.endTurn(state);
                break;
        }

        // 如果切換到 AI 回合，自動執行
        if (state.status === 'ONGOING' && state.currentTurn === 'player2' && state.player2.id === 'ai_opponent') {
            await this.handleAITurn(state);
        }

        // 檢查勝負
        const winner = this.checkWinCondition(state);
        if (winner) {
            state.status = 'FINISHED';
            state.winner = winner;
            await this.settleBattle(state);
        }

        // 更新戰鬥狀態
        await this.updateBattleState(state);

        return state;
    }

    /**
     * 出牌
     */
    private static async playCard(state: BattleState, player: Player, cardId: string) {
        const cardIndex = player.hand.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) {
            throw new AppError('卡牌不在手牌中', 400);
        }

        const card = player.hand[cardIndex];

        // 檢查能量
        if (player.energy < card.energy_cost) {
            throw new AppError('能量不足', 400);
        }

        // 扣除能量
        player.energy -= card.energy_cost;

        // 移動卡牌到場上
        player.hand.splice(cardIndex, 1);
        player.field.push(card);

        // 記錄日誌
        state.battleLog.push({
            round: state.currentRound,
            action: 'PLAY_CARD',
            details: { playerId: player.id, cardId, cardName: card.name_tc },
        });
    }

    /**
     * 執行攻擊
     */
    private static async executeAttack(state: BattleState, attacker: Player, targetId: string) {
        const defender = attacker.id === state.player1.id ? state.player2 : state.player1;

        // 計算總攻擊力
        let totalDamage = 0;
        for (const card of attacker.field) {
            const virtueBonus = this.calculateVirtueMatch(card, attacker);
            const damage = this.calculateDamage(card, virtueBonus);
            totalDamage += damage;
        }

        // 計算防禦力
        const totalDefense = defender.field.reduce((sum, card) => sum + card.defense_power, 0);

        // 最終傷害
        const finalDamage = Math.max(0, totalDamage - totalDefense);
        defender.health -= finalDamage;

        // 記錄日誌
        state.battleLog.push({
            round: state.currentRound,
            action: 'ATTACK',
            details: {
                attackerId: attacker.id,
                defenderId: defender.id,
                totalDamage,
                totalDefense,
                finalDamage,
                remainingHealth: defender.health,
            },
        });
    }

    /**
     * 結束回合
     */
    private static async endTurn(state: BattleState) {
        const currentPlayer = state.currentTurn === 'player1' ? state.player1 : state.player2;

        // 抽一張牌
        if (currentPlayer.deck.length > 0) {
            const drawnCard = currentPlayer.deck.shift()!;
            currentPlayer.hand.push(drawnCard);
        }

        // 恢復能量
        currentPlayer.energy = Math.min(10, currentPlayer.energy + 1);

        // 切換回合
        state.currentTurn = state.currentTurn === 'player1' ? 'player2' : 'player1';

        // 如果回到 player1，增加回合數
        if (state.currentTurn === 'player1') {
            state.currentRound += 1;
        }

        state.battleLog.push({
            round: state.currentRound,
            action: 'END_TURN',
            details: { playerId: currentPlayer.id },
        });
    }

    /**
     * 計算六德匹配度
     */
    private static calculateVirtueMatch(card: Card, player: Player): number {
        const cardVirtues = card.virtues;
        const playerVirtues = player.virtues;

        // 計算六德相似度（餘弦相似度）
        let dotProduct = 0;
        let cardMagnitude = 0;
        let playerMagnitude = 0;

        const virtueKeys = ['intelligence', 'benevolence', 'integrity', 'courage', 'temperance', 'harmony'] as const;

        for (const key of virtueKeys) {
            dotProduct += cardVirtues[key] * playerVirtues[key];
            cardMagnitude += cardVirtues[key] ** 2;
            playerMagnitude += playerVirtues[key] ** 2;
        }

        const similarity =
            dotProduct / (Math.sqrt(cardMagnitude) * Math.sqrt(playerMagnitude));

        // 轉換為加成百分比 (0-50%)
        return similarity * 0.5;
    }

    /**
     * 計算傷害
     */
    private static calculateDamage(card: Card, virtueBonus: number): number {
        const baseDamage = card.attack_power;
        return Math.floor(baseDamage * (1 + virtueBonus));
    }

    /**
     * 檢查勝負
     */
    private static checkWinCondition(state: BattleState): string | null {
        if (state.player1.health <= 0) return state.player2.id;
        if (state.player2.health <= 0) return state.player1.id;
        if (state.player1.deck.length === 0 && state.player1.hand.length === 0) {
            return state.player2.id;
        }
        if (state.player2.deck.length === 0 && state.player2.hand.length === 0) {
            return state.player1.id;
        }
        return null;
    }

    /**
     * 結算戰鬥
     */
    private static async settleBattle(state: BattleState) {
        // 計算獎勵
        const rewards = {
            experience: 100,
            cards: [],
        };

        // 儲存戰鬥記錄
        const crystalHash = this.generateCrystalHash(state);

        await supabase.from('battle_records').insert({
            player1_id: state.player1.id,
            player2_id: state.player2.id,
            winner_id: state.winner,
            battle_duration_seconds: state.currentRound * 60,
            total_rounds: state.currentRound,
            battle_log: state.battleLog,
            rewards,
            crystal_hash: crystalHash,
            evidence: {
                tangible: { finalState: state },
                traceable: { battleId: state.battleId },
                trackable: { rounds: state.currentRound },
                transparent: { algorithm: 'virtue_match_v1' },
                trustworthy: { hash: crystalHash },
            },
        });
    }

    // ===== Redis 戰鬥狀態管理 =====
    private static readonly BATTLE_CACHE_TTL = 3600; // 1小時

    /**
     * 處理 AI 回合
     */
    private static async handleAITurn(state: BattleState): Promise<void> {
        const aiPlayer = state.player2;

        // 模擬 AI 夥伴 (未來可從資料庫讀取)
        const aiCompanion: AICompanion = {
            id: 'ai_companion_default',
            aiType: 'GUARDIAN',
            personality: 'BALANCED',
            level: 5,
            virtues: state.player2.virtues,
            battleStrategy: {
                aggressionLevel: 50,
                defensePriority: 50,
                cardPreference: [],
            }
        };

        const adjustedCompanion = AIDecisionService.adjustDifficulty(aiCompanion, state.difficulty);

        let turnEnded = false;
        let actionsCount = 0;
        const MAX_AI_ACTIONS = 10;

        while (!turnEnded && actionsCount < MAX_AI_ACTIONS && state.status === 'ONGOING') {
            const action = await AIDecisionService.decideAction(state, aiPlayer, adjustedCompanion);

            if (action.actionType === 'END_TURN') {
                await this.endTurn(state);
                turnEnded = true;
            } else if (action.actionType === 'PLAY_CARD') {
                if (action.cardId) await this.playCard(state, aiPlayer, action.cardId);
            } else if (action.actionType === 'ATTACK') {
                await this.executeAttack(state, aiPlayer, action.target || 'opponent');
            } else {
                await this.endTurn(state);
                turnEnded = true;
            }
            actionsCount++;

            // 每次 AI 動作後檢查是否有勝負，如果有則停止 AI 動作
            const winner = this.checkWinCondition(state);
            if (winner) {
                state.status = 'FINISHED';
                state.winner = winner;
                break;
            }
        }
    }

    private static async loadDeck(deckId: string): Promise<Card[]> {
        const { data } = await supabase
            .from('user_decks')
            .select('cards')
            .eq('id', deckId)
            .single();

        const cardIds = JSON.parse(data?.cards || '[]').map((c: any) => c.cardId);

        const { data: cards } = await supabase
            .from('game_cards')
            .select('*')
            .in('id', cardIds);

        return cards || [];
    }

    private static async getPlayerVirtues(userId: string) {
        const { data } = await supabase
            .from('user_digital_avatars')
            .select('omni_crystal')
            .eq('user_id', userId)
            .single();

        return data?.omni_crystal?.virtues || {
            intelligence: 5,
            benevolence: 5,
            integrity: 5,
            courage: 5,
            temperance: 5,
            harmony: 5,
        };
    }

    private static shuffleDeck(deck: Card[]): Card[] {
        const shuffled = [...deck];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    private static generateBattleId(): string {
        return `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private static generateCrystalHash(state: BattleState): string {
        const data = JSON.stringify({
            battleId: state.battleId,
            winner: state.winner,
            rounds: state.currentRound,
            finalHealth: [state.player1.health, state.player2.health],
        });
        return createHash('sha256').update(data).digest('hex');
    }

    private static async saveBattleState(state: BattleState, config: BattleConfig) {
        const cacheKey = `battle:${state.battleId}`;
        await redisService.set(cacheKey, state, this.BATTLE_CACHE_TTL);
    }

    public static async loadBattleState(battleId: string): Promise<BattleState> {
        const cacheKey = `battle:${battleId}`;
        const state = await redisService.get<BattleState>(cacheKey);
        if (!state) {
            throw new AppError('戰鬥狀態已過期或不存在', 404);
        }
        return state;
    }

    private static async updateBattleState(state: BattleState) {
        const cacheKey = `battle:${state.battleId}`;
        await redisService.set(cacheKey, state, this.BATTLE_CACHE_TTL);
    }
}
