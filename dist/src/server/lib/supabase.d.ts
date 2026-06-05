/**
 * Supabase 客戶端配置
 * 後端專用的資料庫連線
 */
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';
export declare const supabase: SupabaseClient<Database>;
export declare const supabaseAdmin: SupabaseClient<Database>;
export declare class SupabaseError extends Error {
    code: string;
    details?: unknown | undefined;
    constructor(message: string, code: string, details?: unknown | undefined);
}
export declare function handleSupabaseError(error: unknown): never;
export declare function testConnection(): Promise<boolean>;
//# sourceMappingURL=supabase.d.ts.map