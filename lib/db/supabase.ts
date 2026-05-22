import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton Supabase client for edge / serverless
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // For server-side and edge functions, usually better to not persist
  }
});
