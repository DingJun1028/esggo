import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// Singleton instance
let supabaseInstance = null;
export const supabase = (() => {
    if (supabaseInstance)
        return supabaseInstance;
    if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase URL or Key missing');
        return null;
    }
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseKey);
        return supabaseInstance;
    }
    catch (error) {
        console.error('Supabase initialization error:', error);
        return null;
    }
})();
export function getSupabaseClient() {
    return supabase;
}
export const createBrowserClient = () => {
    return supabase;
};
export default supabase;
//# sourceMappingURL=supabase.js.map