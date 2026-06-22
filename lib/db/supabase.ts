import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build / SSR without env, use placeholder to avoid crash
  const safeUrl = url || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
  const safeKey = key || process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

  _supabase = createClient(safeUrl, safeKey, {
    auth: { persistSession: false },
  });

  return _supabase;
}

// Legacy export for backward compat — lazy getter
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseClient()[prop as keyof SupabaseClient];
  },
});
