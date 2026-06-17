import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

interface HermesCredentials {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export const hermesStore =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function saveHermesCredentials(credentials: HermesCredentials) {
  if (!hermesStore) return { error: { message: 'Supabase not configured' } };
  return hermesStore.from('hermes_credentials').insert(credentials);
}

export async function getHermesCredentials(_profile?: string) {
  if (!hermesStore) return { data: null, error: { message: 'Supabase not configured' } };
  return hermesStore.from('hermes_credentials').select('*').single();
}
