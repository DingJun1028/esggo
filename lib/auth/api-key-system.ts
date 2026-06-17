/**
 * ESGGO API Key & Token System - API 金鑰與令牌系統
 * 用於 API 驗證、授權與使用追蹤
 */

import { supabase } from '../db/supabase';
import { sha256 } from '../crypto-proof';
import { NextRequest, NextResponse } from 'next/server';

export interface ESGApiKey {
  id: string;
  userId: string;
  keyName: string;
  apiKey: string;
  scopes: string[];
  rateLimit: number;
  expiresAt?: string;
  lastUsedAt?: string;
  active: boolean;
}

// 產生 API Key
export const generateApiKey = async (
  userId: string,
  keyName: string,
  scopes: string[] = ['read', 'write']
): Promise<ESGApiKey | null> => {
  const prefix = 'esggo_sk_';
  const randomPart = crypto.randomUUID().replace(/-/g, '');
  const apiKey = `${prefix}${randomPart}`;
  const hashedKey = sha256(apiKey);

  const { data, error } = await supabase
    .from('esg_api_keys')
    .insert({
      user_id: userId,
      key_name: keyName,
      api_key: hashedKey,
      scopes,
      rate_limit: 1000,
      active: true,
    })
    .select()
    .single();

  return error ? null : { ...data, apiKey };
};

// 驗證 API Key
export const validateApiKey = async (apiKey: string): Promise<ESGApiKey | null> => {
  const hashedKey = sha256(apiKey);
  const { data, error } = await supabase
    .from('esg_api_keys')
    .select('*')
    .eq('api_key', hashedKey)
    .eq('active', true)
    .single();

  if (error || !data) return null;

  const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
  if (expiresAt && expiresAt < new Date()) return null;

  return data;
};

// API Key 中介軟體
export const apiKeyMiddleware = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
  }

  const apiKey = authHeader.slice(7);
  const validated = await validateApiKey(apiKey);

  if (!validated) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 403 });
  }

  // 更新使用時間
  await supabase
    .from('esg_api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', validated.id);

  request.headers.set('x-user-id', validated.userId);
  return null;
};

// API Key 管理端點
export const handleApiKeyApi = async (request: NextRequest) => {
  const { action, userId, keyName, scopes } = await request.json();

  if (action === 'create') {
    const result = await generateApiKey(userId, keyName, scopes);
    return NextResponse.json(result);
  }

  if (action === 'list') {
    const { data } = await supabase
      .from('esg_api_keys')
      .select('id, key_name, scopes, rate_limit, last_used_at, expires_at')
      .eq('user_id', userId);
    return NextResponse.json({ keys: data });
  }

  if (action === 'revoke') {
    const { keyId } = await request.json();
    await supabase.from('esg_api_keys').update({ active: false }).eq('id', keyId);
    return NextResponse.json({ revoked: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
};
