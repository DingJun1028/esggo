import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

interface HermesCredentials {
  id?: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  profile?: string;
  created_at?: string;
}

export const hermesStore =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function saveHermesCredentials(credentials: HermesCredentials, profile: string = 'system_default') {
  if (!hermesStore) return { error: { message: 'Supabase not configured' } };
  
  const data = { ...credentials, profile, created_at: new Date().toISOString() };
  
  const existing = await hermesStore
    .from('hermes_credentials')
    .select('id')
    .eq('profile', profile)
    .single();
  
  if (existing.data) {
    return hermesStore
      .from('hermes_credentials')
      .update(data)
      .eq('id', existing.data.id);
  }
  
  return hermesStore.from('hermes_credentials').insert(data);
}

export async function getHermesCredentials(profile: string = 'system_default') {
  if (!hermesStore) return { data: null, error: { message: 'Supabase not configured' } };
  
  return hermesStore
    .from('hermes_credentials')
    .select('access_token, refresh_token, expires_in, token_type, scope, profile, created_at')
    .eq('profile', profile)
    .single();
}
