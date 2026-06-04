import { SupabaseClient } from '@supabase/supabase-js';
export declare const supabase: SupabaseClient | null;
export declare function getSupabaseClient(): SupabaseClient | null;
export declare const createBrowserClient: () => SupabaseClient<any, "public", "public", any, any> | null;
export default supabase;
//# sourceMappingURL=supabase.d.ts.map