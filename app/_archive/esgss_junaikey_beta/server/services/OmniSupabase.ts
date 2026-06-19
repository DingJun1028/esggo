/**
 * OmniSupabase - 奧秘數據庫服務
 * --------------------------------------------------
 * [核心] Supabase Client Wrapper
 * [功能] 提供統一的資料庫存取介面，支援 Vector Search。
 * 
 * @version 1.0.0
 * @date 2026-02-14
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { omniLogger, LogCategory } from '../../src/omni/infrastructure/logging/OmniLogger.js';

export class OmniSupabase {
    private static instance: OmniSupabase;
    public client: SupabaseClient | null = null;
    private isInitialized = false;

    private constructor() { }

    public static getInstance(): OmniSupabase {
        if (!OmniSupabase.instance) {
            OmniSupabase.instance = new OmniSupabase();
        }
        return OmniSupabase.instance;
    }

    public initialize(): void {
        if (this.isInitialized) return;

        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Use Service Role Key for backend if available, but ANON for now based on env vars typical usage in this project

        if (!supabaseUrl || !supabaseKey) {
            omniLogger.warn(LogCategory.SYSTEM, '⚠️ Supabase credentials missing. Persistence disabled.');
            return;
        }

        try {
            this.client = createClient(supabaseUrl, supabaseKey);
            this.isInitialized = true;
            omniLogger.info(LogCategory.SYSTEM, '✅ OmniSupabase initialized.');
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '❌ Failed to initialize Supabase client', { error });
        }
    }

    public getClient(): SupabaseClient | null {
        if (!this.isInitialized) {
            this.initialize();
        }
        return this.client;
    }
}

export const omniSupabase = OmniSupabase.getInstance();
