/**
 * supabase.ts
 * Supabase 客戶端配置
 * 
 * 用途：
 * - 統一資料庫連接（取代 MongoDB）
 * - 提供類型安全的資料庫操作
 * - 支援 RLS（Row Level Security）
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

// Supabase 配置
// [SENTINEL] Fallback to mock values to prevent CI/Startup crash if secrets are missing
// This allows the server to start even if Supabase is not configured (degraded mode)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.warn('CRITICAL', '⚠️ Supabase 配置缺失！使用 Mock 模式運行。請檢查環境變數：SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
}

/**
 * Supabase 客戶端實例
 * 使用 Service Role Key 以繞過 RLS（後端服務器使用）
 */
export const supabase: SupabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
        db: {
            schema: 'public',
        },
    }
);

/**
 * 測試 Supabase 連接
 */
export async function testSupabaseConnection(): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('sustainability_sources')
            .select('count')
            .limit(1);

        if (error) {
            logger.error('DATABASE', '❌ Supabase 連接測試失敗', { error: error.message });
            return false;
        }

        logger.info('DATABASE', '✅ Supabase 連接成功');
        return true;
    } catch (error) {
        logger.error('DATABASE', '❌ Supabase 連接異常', { error });
        return false;
    }
}

/**
 * 獲取資料庫統計資訊
 */
export async function getDatabaseStats() {
    try {
        const tables = [
            'sustainability_sources',
            'user_digital_avatars',
            'user_source_subscriptions',
            'user_knowledge_items',
            'game_cards',
            'user_card_collection',
            'user_decks',
            'battle_records',
            'ai_companions',
        ];

        const stats: Record<string, number> = {};

        for (const table of tables) {
            const { count, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });

            if (!error) {
                stats[table] = count || 0;
            }
        }

        return stats;
    } catch (error) {
        logger.error('DATABASE', '獲取資料庫統計失敗', { error });
        return {};
    }
}

export default supabase;
