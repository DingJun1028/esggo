import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let _supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey || supabaseUrl === '' || supabaseKey === '') {
    return null;
  }
  if (!_supabase) {
    try {
      _supabase = createClient(supabaseUrl, supabaseKey);
    } catch {
      return null;
    }
  }
  return _supabase;
}

export const supabase = (() => {
  try {
    if (supabaseUrl && supabaseKey) {
      return createClient(supabaseUrl, supabaseKey);
    }
  } catch {}
  return null;
})();

export const createBrowserClient = () => {
  if (supabaseUrl && supabaseKey) {
    return createClient(supabaseUrl, supabaseKey);
  }
  return null;
};

export default supabase;