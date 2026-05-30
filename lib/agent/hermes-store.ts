import { createClient } from '@supabase/supabase-js';

// ── Supabase Setup ────────────────────────────────────────────────────────
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export interface HermesCredentials {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  timestamp: number;
}

/**
 * 將 Hermes Agent (Google Workspace) 的憑證安全地存儲至 Supabase Vault
 */
export async function saveHermesCredentials(
  userId: string = 'system_default',
  credentials: Omit<HermesCredentials, 'timestamp'>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  if (!supabase) {
    console.warn('[HermesStore] 未設定 Supabase 服務金鑰，跳過憑證儲存');
    return { success: false, error: 'No Supabase configuration' };
  }

  const payload: HermesCredentials = {
    ...credentials,
    timestamp: Date.now(),
  };

  const secretName = `hermes_google_oauth_${userId}`;

  try {
    // We use Supabase Vault to store the credentials securely.
    // Using the existing create_evidence_seal RPC for encrypted storage:
    const { error } = await supabase.rpc('create_evidence_seal', {
      p_secret: JSON.stringify(payload),
      p_name: secretName,
      p_description: `Google Workspace OAuth tokens for Hermes Agent (${userId})`
    });

    if (error) throw error;
    
    console.log(`[HermesStore] Successfully secured Hermes credentials for ${userId} in Vault.`);
    return { success: true };
  } catch (err: unknown) {
    console.error('[HermesStore] Failed to save credentials:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 取得 Hermes Agent 的 Google Workspace 憑證 (需要解密)
 */
export async function getHermesCredentials(
  userId: string = 'system_default'
): Promise<HermesCredentials | null> {
  const supabase = getServiceClient();
  if (!supabase) return null;

  const secretName = `hermes_google_oauth_${userId}`;

  try {
    // In a real environment, reading from vault.secrets requires appropriate permissions
    // Here we assume the service role has access, and we query the decrypted secret from the view
    const { data, error } = await supabase
      .from('vault_secrets') // or decrypted_secrets view depending on Supabase setup
      .select('secret')
      .eq('name', secretName)
      .single();

    if (error || !data) return null;

    return JSON.parse(data.secret) as HermesCredentials;
  } catch (err) {
    console.error('[HermesStore] Failed to retrieve credentials:', err);
    return null;
  }
}
