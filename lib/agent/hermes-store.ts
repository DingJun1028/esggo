import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const hermesStore =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function saveHermesCredentials(credentials: any) {
  if (!hermesStore) return { error: { message: 'Supabase not configured' } };
  return hermesStore.from('hermes_credentials').insert(credentials);
}

export async function getHermesCredentials() {
  if (!hermesStore) return { data: null, error: { message: 'Supabase not configured' } };
  return hermesStore.from('hermes_credentials').select('*').single();
}
