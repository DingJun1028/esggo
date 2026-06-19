/**
 * DeckService.ts
 * 牌組管理服務：處理牌組 CRUD、驗證、啟用邏輯
 * 
 * 核心功能：
 * - 牌組創建與驗證
 * - 牌組更新與刪除
 * - 牌組啟用管理
 * - 牌組統計計算
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../ErrorHandler.js';

const supabase: SupabaseClient = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
);

export interface CreateDeckRequest {
    userId: string;
    deckName: string;
    description?: string;
    deckType: 'BALANCED' | 'AGGRESSIVE' | 'DEFENSIVE' | 'CONTROL' | 'COMBO';
    cards: Array<{
        cardId: string;
        quantity: number;
    }>;
}

export interface UpdateDeckRequest {
    userId: string;
    deckId: string;
    deckName?: string;
    description?: string;
    deckType?: string;
    cards?: Array<{
        cardId: string;
        quantity: number;
    }>;
}

export class DeckService {
    /**
     * 驗證牌組規則
     */
    private static async validateDeck(
        userId: string,
        cards: Array<{ cardId: string; quantity: number }>
    ): Promise<{ valid: boolean; errors: string[] }> {
        const errors: string[] = [];

        // 規則 1: 總卡數必須是 30 張
        const totalCards = cards.reduce((sum, card) => sum + card.quantity, 0);
        if (totalCards !== 30) {
            errors.push(`牌組必須包含 30 張卡牌，當前為 ${totalCards} 張`);
        }

        // 規則 2: 每張卡最多 3 張
        const invalidQuantities = cards.filter((card) => card.quantity > 3 || card.quantity < 1);
        if (invalidQuantities.length > 0) {
            errors.push('每張卡牌數量必須在 1-3 之間');
        }

        // 規則 3: 必須擁有這些卡牌
        const cardIds = cards.map((c) => c.cardId);
        const { data: ownedCards, error } = await supabase
            .from('user_card_collection')
            .select('card_id, quantity')
            .eq('user_id', userId)
            .in('card_id', cardIds);

        if (error) {
            throw new AppError(`驗證卡牌擁有權失敗: ${error.message}`, 500);
        }

        const ownedCardMap = new Map(
            ownedCards?.map((c: any) => [c.card_id, c.quantity]) || []
        );

        for (const card of cards) {
            const ownedQuantity = ownedCardMap.get(card.cardId);
            if (!ownedQuantity) {
                errors.push(`您尚未擁有卡牌 ${card.cardId}`);
            } else if (ownedQuantity < card.quantity) {
                errors.push(`卡牌 ${card.cardId} 數量不足（擁有 ${ownedQuantity}，需要 ${card.quantity}）`);
            }
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    /**
     * 獲取玩家所有牌組
     */
    static async getDecks(userId: string) {
        const { data, error } = await supabase
            .from('user_decks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new AppError(`獲取牌組失敗: ${error.message}`, 500);
        }

        // 計算勝率
        const decksWithStats = data?.map((deck: any) => ({
            ...deck,
            win_rate:
                deck.times_used > 0
                    ? ((deck.win_count / deck.times_used) * 100).toFixed(2)
                    : 0,
        }));

        return decksWithStats || [];
    }

    /**
     * 創建新牌組
     */
    static async createDeck(request: CreateDeckRequest) {
        const { userId, deckName, description, deckType, cards } = request;

        // 驗證牌組
        const validation = await this.validateDeck(userId, cards);
        if (!validation.valid) {
            throw new AppError(
                `牌組驗證失敗: ${validation.errors.join(', ')}`,
                400
            );
        }

        // 計算主要元素
        const { data: cardDetails } = await supabase
            .from('game_cards')
            .select('element')
            .in('id', cards.map((c) => c.cardId));

        const elementCounts: Record<string, number> = {};
        cardDetails?.forEach((card: any) => {
            if (card.element) {
                elementCounts[card.element] = (elementCounts[card.element] || 0) + 1;
            }
        });

        const primaryElement = Object.keys(elementCounts).reduce((a, b) =>
            elementCounts[a] > elementCounts[b] ? a : b
        );

        // 創建牌組
        const { data: newDeck, error } = await supabase
            .from('user_decks')
            .insert({
                user_id: userId,
                deck_name: deckName,
                description,
                deck_type: deckType,
                primary_element: primaryElement,
                cards: JSON.stringify(cards),
                total_cards: 30,
                is_active: false,
            })
            .select()
            .single();

        if (error) {
            throw new AppError(`創建牌組失敗: ${error.message}`, 500);
        }

        return newDeck;
    }

    /**
     * 更新牌組
     */
    static async updateDeck(request: UpdateDeckRequest) {
        const { userId, deckId, deckName, description, deckType, cards } = request;

        // 驗證牌組存在
        const { data: existingDeck } = await supabase
            .from('user_decks')
            .select('*')
            .eq('id', deckId)
            .eq('user_id', userId)
            .single();

        if (!existingDeck) {
            throw new AppError('牌組不存在', 404);
        }

        // 如果更新卡牌，需要驗證
        if (cards) {
            const validation = await this.validateDeck(userId, cards);
            if (!validation.valid) {
                throw new AppError(
                    `牌組驗證失敗: ${validation.errors.join(', ')}`,
                    400
                );
            }
        }

        const updateData: any = {};
        if (deckName) updateData.deck_name = deckName;
        if (description !== undefined) updateData.description = description;
        if (deckType) updateData.deck_type = deckType;
        if (cards) updateData.cards = JSON.stringify(cards);

        const { data: updatedDeck, error } = await supabase
            .from('user_decks')
            .update(updateData)
            .eq('id', deckId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw new AppError(`更新牌組失敗: ${error.message}`, 500);
        }

        return updatedDeck;
    }

    /**
     * 刪除牌組
     */
    static async deleteDeck(userId: string, deckId: string) {
        const { error } = await supabase
            .from('user_decks')
            .delete()
            .eq('id', deckId)
            .eq('user_id', userId);

        if (error) {
            throw new AppError(`刪除牌組失敗: ${error.message}`, 500);
        }

        return { success: true };
    }

    /**
     * 啟用牌組
     */
    static async activateDeck(userId: string, deckId: string) {
        // 先將所有牌組設為非啟用
        await supabase
            .from('user_decks')
            .update({ is_active: false })
            .eq('user_id', userId);

        // 啟用指定牌組
        const { data, error } = await supabase
            .from('user_decks')
            .update({ is_active: true })
            .eq('id', deckId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw new AppError(`啟用牌組失敗: ${error.message}`, 500);
        }

        return data;
    }

    /**
     * 獲取當前啟用的牌組
     */
    static async getActiveDeck(userId: string) {
        const { data, error } = await supabase
            .from('user_decks')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new AppError(`獲取啟用牌組失敗: ${error.message}`, 500);
        }

        return data || null;
    }

    /**
     * 獲取牌組詳情（包含完整卡牌資訊）
     */
    static async getDeckDetails(userId: string, deckId: string) {
        const { data: deck, error } = await supabase
            .from('user_decks')
            .select('*')
            .eq('id', deckId)
            .eq('user_id', userId)
            .single();

        if (error) {
            throw new AppError(`獲取牌組詳情失敗: ${error.message}`, 500);
        }

        if (!deck) {
            throw new AppError('牌組不存在', 404);
        }

        // 解析卡牌列表
        const cards = JSON.parse(deck.cards || '[]');
        const cardIds = cards.map((c: any) => c.cardId);

        // 獲取完整卡牌資訊
        const { data: cardDetails } = await supabase
            .from('game_cards')
            .select('*')
            .in('id', cardIds);

        const cardMap = new Map(cardDetails?.map((c: any) => [c.id, c]) || []);

        const enrichedCards = cards.map((c: any) => ({
            ...cardMap.get(c.cardId),
            quantity: c.quantity,
        }));

        return {
            ...deck,
            cards: enrichedCards,
        };
    }
}
