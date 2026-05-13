import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL.');
  }

  if (!supabaseKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return { supabaseUrl, supabaseKey };
}

export const createClient = async () => {
  const cookieStore = await cookies();
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // Called from Server Component — safe to ignore
        }
      },
      remove(name, options) {
        try {
          cookieStore.set(name, '', options);
        } catch {
          // Called from Server Component — safe to ignore
        }
      },
    },
  });
};
