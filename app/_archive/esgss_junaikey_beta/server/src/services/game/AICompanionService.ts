/**
 * AICompanionService.ts
 * AI 數位分身管理服務：處理 AI 養成、訓練、策略調整
 * 
 * 核心功能：
 * - 獲取 AI 狀態
 * - 訓練 AI
 * - 更新策略
 * - AI 成長系統
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../ErrorHandler.js';

const supabase: SupabaseClient = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
);

export interface TrainAIRequest {
    userId: string;
    trainingType: 'BATTLE_SIMULATION' | 'STRATEGY_LEARNING' | 'VIRTUE_CULTIVATION';
    trainingData?: any;
}

export interface UpdateStrategyRequest {
    userId: string;
    strategy: {
        aggressionLevel: number;
        defensePriority: number;
        cardPreference: string[];
    };
}

export class AICompanionService {
    /**
     * 獲取 AI 數位分身
     */
    static async getAICompanion(userId: string) {
        const { data, error } = await supabase
            .from('ai_companions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new AppError(`獲取 AI 失敗: ${error.message}`, 500);
        }

        // 如果不存在，創建預設 AI
        if (!data) {
            return this.createDefaultAI(userId);
        }

        // 計算勝率
        const winRate =
            data.total_battles > 0
                ? ((data.win_count / data.total_battles) * 100).toFixed(2)
                : 0;

        return {
            ...data,
            win_rate: winRate,
        };
    }

    /**
     * 創建預設 AI
     */
    private static async createDefaultAI(userId: string) {
        const { data, error } = await supabase
            .from('ai_companions')
            .insert({
                user_id: userId,
                ai_name: '守護者',
                ai_type: 'GUARDIAN',
                personality: 'BALANCED',
                level: 1,
                experience: 0,
                virtue_intelligence: 5,
                virtue_benevolence: 5,
                virtue_integrity: 5,
                virtue_courage: 5,
                virtue_temperance: 5,
                virtue_harmony: 5,
                battle_strategy: {
                    aggressionLevel: 50,
                    defensePriority: 50,
                    cardPreference: [],
                },
            })
            .select()
            .single();

        if (error) {
            throw new AppError(`創建 AI 失敗: ${error.message}`, 500);
        }

        return data;
    }

    /**
     * 訓練 AI
     */
    static async trainAI(request: TrainAIRequest) {
        const { userId, trainingType, trainingData } = request;

        const aiCompanion = await this.getAICompanion(userId);

        let expGain = 0;
        let virtueGrowth: any = {};

        switch (trainingType) {
            case 'BATTLE_SIMULATION':
                // 戰鬥模擬訓練
                expGain = 50;
                virtueGrowth = {
                    virtue_courage: Math.min(100, aiCompanion.virtue_courage + 1),
                };
                break;

            case 'STRATEGY_LEARNING':
                // 策略學習
                expGain = 30;
                virtueGrowth = {
                    virtue_intelligence: Math.min(100, aiCompanion.virtue_intelligence + 1),
                };
                break;

            case 'VIRTUE_CULTIVATION':
                // 美德修煉
                expGain = 20;
                const randomVirtue = [
                    'virtue_benevolence',
                    'virtue_integrity',
                    'virtue_temperance',
                    'virtue_harmony',
                ][Math.floor(Math.random() * 4)];
                virtueGrowth = {
                    [randomVirtue]: Math.min(100, aiCompanion[randomVirtue] + 2),
                };
                break;
        }

        // 計算新等級
        const newExp = aiCompanion.experience + expGain;
        const newLevel = Math.floor(newExp / 1000) + 1;

        // 更新訓練數據
        const trainingDataUpdate = {
            ...aiCompanion.training_data,
            [trainingType]: (aiCompanion.training_data?.[trainingType] || 0) + 1,
            lastTraining: new Date().toISOString(),
        };

        // 執行更新
        const { data, error } = await supabase
            .from('ai_companions')
            .update({
                level: newLevel,
                experience: newExp,
                ...virtueGrowth,
                training_data: trainingDataUpdate,
            })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw new AppError(`訓練 AI 失敗: ${error.message}`, 500);
        }

        return {
            ...data,
            training_result: {
                expGained: expGain,
                levelUp: newLevel > aiCompanion.level,
                virtueGrowth,
            },
        };
    }

    /**
     * 更新 AI 策略
     */
    static async updateStrategy(request: UpdateStrategyRequest) {
        const { userId, strategy } = request;

        // 驗證策略參數
        if (
            strategy.aggressionLevel < 0 ||
            strategy.aggressionLevel > 100 ||
            strategy.defensePriority < 0 ||
            strategy.defensePriority > 100
        ) {
            throw new AppError('策略參數必須在 0-100 之間', 400);
        }

        const { data, error } = await supabase
            .from('ai_companions')
            .update({
                battle_strategy: strategy,
            })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw new AppError(`更新策略失敗: ${error.message}`, 500);
        }

        return data;
    }

    /**
     * 更新 AI 名稱
     */
    static async updateAIName(userId: string, aiName: string) {
        if (!aiName || aiName.length > 20) {
            throw new AppError('AI 名稱長度必須在 1-20 字元之間', 400);
        }

        const { data, error } = await supabase
            .from('ai_companions')
            .update({ ai_name: aiName })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw new AppError(`更新 AI 名稱失敗: ${error.message}`, 500);
        }

        return data;
    }

    /**
     * 更新 AI 性格
     */
    static async updatePersonality(
        userId: string,
        personality: 'AGGRESSIVE' | 'DEFENSIVE' | 'BALANCED' | 'ADAPTIVE'
    ) {
        const { data, error } = await supabase
            .from('ai_companions')
            .update({ personality })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw new AppError(`更新性格失敗: ${error.message}`, 500);
        }

        return data;
    }

    /**
     * 獲取 AI 成長建議
     */
    static async getGrowthSuggestions(userId: string) {
        const aiCompanion = await this.getAICompanion(userId);

        const suggestions: Array<{ type: string; message: string; priority: string }> = [];

        // 分析六德平衡度
        const virtues: number[] = [
            aiCompanion.virtue_intelligence,
            aiCompanion.virtue_benevolence,
            aiCompanion.virtue_integrity,
            aiCompanion.virtue_courage,
            aiCompanion.virtue_temperance,
            aiCompanion.virtue_harmony,
        ];

        const avgVirtue = virtues.reduce((a: number, b: number) => a + b, 0) / 6;
        const minVirtue = Math.min(...virtues);
        const maxVirtue = Math.max(...virtues);

        if (maxVirtue - minVirtue > 20) {
            suggestions.push({
                type: 'BALANCE',
                message: '您的 AI 六德發展不平衡，建議進行美德修煉以提升較弱的屬性',
                priority: 'HIGH',
            });
        }

        // 分析戰鬥經驗
        if (aiCompanion.total_battles < 10) {
            suggestions.push({
                type: 'BATTLE',
                message: '建議進行更多戰鬥模擬訓練以提升實戰經驗',
                priority: 'MEDIUM',
            });
        }

        // 分析勝率
        const winRate = aiCompanion.total_battles > 0
            ? aiCompanion.win_count / aiCompanion.total_battles
            : 0;

        if (winRate < 0.4 && aiCompanion.total_battles >= 5) {
            suggestions.push({
                type: 'STRATEGY',
                message: '勝率較低，建議調整戰鬥策略或進行策略學習訓練',
                priority: 'HIGH',
            });
        }

        return {
            aiLevel: aiCompanion.level,
            totalBattles: aiCompanion.total_battles,
            winRate: (winRate * 100).toFixed(2),
            virtueBalance: {
                average: avgVirtue.toFixed(1),
                min: minVirtue,
                max: maxVirtue,
                variance: (maxVirtue - minVirtue).toFixed(1),
            },
            suggestions,
        };
    }
}
