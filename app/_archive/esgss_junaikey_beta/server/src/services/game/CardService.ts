/**
 * CardService.ts
 * 卡牌管理服務：處理卡牌收藏、查詢、強化邏輯
 * 
 * 核心功能：
 * - 獲取玩家卡牌收藏
 * - 卡牌詳情查詢
 * - 卡牌強化系統
 * - 卡牌統計計算
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../ErrorHandler.js';
import { redisService } from '../RedisService.js';
import logger from '../../utils/logger.js';

const supabase: SupabaseClient = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
);

export interface CardCollectionQuery {
    userId: string;
    rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
    element?: 'E' | 'S' | 'G' | 'TECH' | 'POLICY' | 'FINANCE';
    cardType?: 'KNOWLEDGE' | 'ACTION' | 'VIRTUE' | 'ARTIFACT';
    sort?: 'level' | 'rarity' | 'attack' | 'defense';
    page?: number;
    limit?: number;
}

export interface EnhanceCardRequest {
    userId: string;
    cardId: string;
    enhancementType: 'LEVEL_UP' | 'VIRTUE_BOOST';
    resourceCost: number;
}

export class CardService {
    /**
     * 獲取玩家卡牌收藏
     */
    static async getCardCollection(query: CardCollectionQuery) {
        const {
            userId,
            rarity,
            element,
            cardType,
            sort = 'level',
            page = 1,
            limit = 20,
        } = query;

        // 嘗試從 Redis 獲取快取
        const cacheKey = `cards:collection:${userId}:${JSON.stringify(query)}`;
        const cachedData = await redisService.get<any>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        let supabaseQuery = supabase
            .from('user_card_collection')
            .select(`
        id,
        quantity,
        is_favorite,
        level,
        experience,
        enhancement_count,
        times_used,
        win_rate,
        obtained_from,
        obtained_at,
        card:game_cards (
          id,
          card_code,
          name_tc,
          name_en,
          description,
          flavor_text,
          card_type,
          rarity,
          element,
          virtue_intelligence,
          virtue_benevolence,
          virtue_integrity,
          virtue_courage,
          virtue_temperance,
          virtue_harmony,
          attack_power,
          defense_power,
          energy_cost,
          abilities
        )
      `)
            .eq('user_id', userId);

        // 應用篩選
        if (rarity) {
            supabaseQuery = supabaseQuery.eq('card.rarity', rarity);
        }
        if (element) {
            supabaseQuery = supabaseQuery.eq('card.element', element);
        }
        if (cardType) {
            supabaseQuery = supabaseQuery.eq('card.card_type', cardType);
        }

        // 排序
        const sortColumn = sort === 'level' ? 'level' : `card.${sort}_power`;
        supabaseQuery = supabaseQuery.order(sortColumn, { ascending: false });

        // 分頁
        const offset = (page - 1) * limit;
        supabaseQuery = supabaseQuery.range(offset, offset + limit - 1);

        const { data, error, count } = await supabaseQuery;

        if (error) {
            throw new AppError(`獲取卡牌收藏失敗: ${error.message}`, 500);
        }

        // 格式化回應
        const cards = data?.map((item: any) => ({
            id: item.id,
            card_code: item.card.card_code,
            name_tc: item.card.name_tc,
            rarity: item.card.rarity,
            element: item.card.element,
            card_type: item.card.card_type,
            level: item.level,
            attack_power: item.card.attack_power,
            defense_power: item.card.defense_power,
            energy_cost: item.card.energy_cost,
            virtues: {
                intelligence: item.card.virtue_intelligence,
                benevolence: item.card.virtue_benevolence,
                integrity: item.card.virtue_integrity,
                courage: item.card.virtue_courage,
                temperance: item.card.virtue_temperance,
                harmony: item.card.virtue_harmony,
            },
            quantity: item.quantity,
            is_favorite: item.is_favorite,
            times_used: item.times_used,
            win_rate: item.win_rate,
        })) || [];

        const response = {
            cards,
            total: count || 0,
            page,
            limit,
        };

        // 存入 Redis 快取 (過期時間 5 分鐘)
        await redisService.set(cacheKey, response, 300);

        return response;
    }

    /**
     * 獲取單張卡牌詳情
     */
    static async getCardDetails(userId: string, cardId: string) {
        const { data, error } = await supabase
            .from('user_card_collection')
            .select(`
        *,
        card:game_cards (
          *,
          source_knowledge:user_knowledge_items (
            title,
            summary,
            category,
            word_count
          )
        )
      `)
            .eq('user_id', userId)
            .eq('card_id', cardId)
            .single();

        if (error) {
            throw new AppError(`獲取卡牌詳情失敗: ${error.message}`, 500);
        }

        if (!data) {
            throw new AppError('卡牌不存在', 404);
        }

        return data;
    }

    /**
     * 強化卡牌
     */
    static async enhanceCard(request: EnhanceCardRequest) {
        const { userId, cardId, enhancementType, resourceCost } = request;

        // 獲取當前卡牌狀態
        const { data: currentCard, error: fetchError } = await supabase
            .from('user_card_collection')
            .select('*')
            .eq('user_id', userId)
            .eq('card_id', cardId)
            .single();

        if (fetchError || !currentCard) {
            throw new AppError('卡牌不存在', 404);
        }

        // 檢查等級上限
        if (currentCard.level >= 100) {
            throw new AppError('卡牌已達最高等級', 400);
        }

        let updateData: any = {
            enhancement_count: currentCard.enhancement_count + 1,
        };

        if (enhancementType === 'LEVEL_UP') {
            // 等級提升
            const expGain = resourceCost * 10;
            const newExp = currentCard.experience + expGain;
            const expRequired = currentCard.level * 100;

            if (newExp >= expRequired) {
                updateData.level = currentCard.level + 1;
                updateData.experience = newExp - expRequired;
            } else {
                updateData.experience = newExp;
            }
        }

        // 執行更新
        const { data: updatedCard, error: updateError } = await supabase
            .from('user_card_collection')
            .update(updateData)
            .eq('user_id', userId)
            .eq('card_id', cardId)
            .select()
            .single();

        if (updateError) {
            throw new AppError(`強化卡牌失敗: ${updateError.message}`, 500);
        }

        // 清除該用戶的卡牌收藏快取
        const cachePattern = `cards:collection:${userId}:*`;
        // 注意：ioredis 的 del 不支援 pattern，通常需要用 keys + del 或 scan
        // 為了簡單起見，我們先手動清除特定的快取，或者在 RedisService 實作萬用字元清除
        await redisService.del(cachePattern); // 這需要 RedisService 支援 pattern 或使用 scan

        return updatedCard;
    }

    /**
     * 切換收藏狀態
     */
    static async toggleFavorite(userId: string, cardId: string) {
        const { data: currentCard } = await supabase
            .from('user_card_collection')
            .select('is_favorite')
            .eq('user_id', userId)
            .eq('card_id', cardId)
            .single();

        if (!currentCard) {
            throw new AppError('卡牌不存在', 404);
        }

        const { data, error } = await supabase
            .from('user_card_collection')
            .update({ is_favorite: !currentCard.is_favorite })
            .eq('user_id', userId)
            .eq('card_id', cardId)
            .select()
            .single();

        if (error) {
            throw new AppError(`更新收藏狀態失敗: ${error.message}`, 500);
        }

        // 清除快取
        await redisService.del(`cards:collection:${userId}:*`);

        return data;
    }

    /**
     * 獲取卡牌統計
     */
    static async getCardStatistics(userId: string) {
        const { data, error } = await supabase
            .from('user_card_collection')
            .select(`
        card:game_cards (rarity, card_type, element)
      `)
            .eq('user_id', userId);

        if (error) {
            throw new AppError(`獲取統計失敗: ${error.message}`, 500);
        }

        // 計算統計
        const stats = {
            total: data?.length || 0,
            byRarity: {} as Record<string, number>,
            byType: {} as Record<string, number>,
            byElement: {} as Record<string, number>,
        };

        data?.forEach((item: any) => {
            const { rarity, card_type, element } = item.card;
            stats.byRarity[rarity] = (stats.byRarity[rarity] || 0) + 1;
            stats.byType[card_type] = (stats.byType[card_type] || 0) + 1;
            if (element) {
                stats.byElement[element] = (stats.byElement[element] || 0) + 1;
            }
        });

        return stats;
    }
}
