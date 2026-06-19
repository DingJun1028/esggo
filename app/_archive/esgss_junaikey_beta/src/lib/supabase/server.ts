// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';

// ⚠️ We'll use process.env directly since we are in a mixed environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createServerClient() {
    return createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}

// 檢查使用者認證 (Simplified for now or can be expanded if auth is implemented)
export async function getAuthenticatedUser() {
    const supabase = createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error('未授權訪問');
    }

    return user;
}
