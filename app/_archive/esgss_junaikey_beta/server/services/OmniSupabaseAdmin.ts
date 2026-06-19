
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { omniLogger, LogCategory } from '../../src/omni/infrastructure/logging/OmniLogger.js';

export class OmniSupabaseAdmin {
    private static instance: OmniSupabaseAdmin;
    public client: SupabaseClient;

    private constructor() {
        // Prefer Service Role Key for Admin operations, fall back to Anon key if necessary (but RLS might block)
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            omniLogger.error(LogCategory.SYSTEM, 'Missing Supabase credentials for OmniSupabaseAdmin');
            throw new Error('Missing Supabase credentials');
        }

        this.client = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            }
        });
    }

    public static getInstance(): OmniSupabaseAdmin {
        if (!OmniSupabaseAdmin.instance) {
            OmniSupabaseAdmin.instance = new OmniSupabaseAdmin();
        }
        return OmniSupabaseAdmin.instance;
    }
}

export const omniSupabaseAdmin = OmniSupabaseAdmin.getInstance();
