import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

interface OmniAgentCredentials {
  id?: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  profile?: string;
  created_at?: string;
}

export const omniStore = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function saveOmniCredentials(
  credentials: OmniAgentCredentials,
  profile: string = 'system_default'
) {
  if (!omniStore) return { error: { message: 'OmniStore not configured' } };

  const data = { ...credentials, profile, created_at: new Date().toISOString() };

  const existing = await omniStore
    .from('omni_credentials')
    .select('id')
    .eq('profile', profile)
    .single();

  if (existing.data) {
    return omniStore.from('omni_credentials').update(data).eq('id', existing.data.id);
  }

  return omniStore.from('omni_credentials').insert(data);
}

export async function getOmniCredentials(profile: string = 'system_default') {
  if (!omniStore) return { data: null, error: { message: 'OmniStore not configured' } };

  return omniStore
    .from('omni_credentials')
    .select('access_token, refresh_token, expires_in, token_type, scope, profile, created_at')
    .eq('profile', profile)
    .single();
}
