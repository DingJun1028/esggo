import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { AugmentedDatabase as Database } from '../types/supabase-augmented.js';

const getEnvVar = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

let supabase: SupabaseClient<Database> | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(' Supabase URL or Key missing. Resilient mode active.');
} else {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export { supabase };
export const getSupabase = (): SupabaseClient<Database> => {
  if (!supabase) throw new Error('Supabase client not initialized');
  return supabase;
};
export type { Database };
export const isSupabaseConfigured = !!supabase;
