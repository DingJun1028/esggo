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

export const oaStore = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function saveOACredentials(
  credentials: OmniAgentCredentials,
  profile: string = 'system_default'
) {
  if (!oaStore) return { error: { message: 'OmniStore not configured' } };

  const data = { ...credentials, profile, created_at: new Date().toISOString() };

  const existing = await oaStore
    .from('oa_credentials')
    .select('id')
    .eq('profile', profile)
    .single();

  if (existing.data) {
    return oaStore.from('oa_credentials').update(data).eq('id', existing.data.id);
  }

  return oaStore.from('oa_credentials').insert(data);
}

export async function getOACredentials(profile: string = 'system_default') {
  if (!oaStore) return { data: null, error: { message: 'OmniStore not configured' } };

  return oaStore
    .from('oa_credentials')
    .select('access_token, refresh_token, expires_in, token_type, scope, profile, created_at')
    .eq('profile', profile)
    .single();
}
