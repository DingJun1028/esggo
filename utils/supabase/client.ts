import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const createClient = () =>
  createBrowserClient<Database>(supabaseUrl, supabaseKey);