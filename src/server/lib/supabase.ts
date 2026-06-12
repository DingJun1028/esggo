/**
 * Supabase 客戶端配置
 * 後端專用的資料庫連線
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// ============================================
// 環境變數檢查
// ============================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// ============================================
// 客戶端實例
// ============================================

// 一般客戶端（RLS 限制）
export const supabase: SupabaseClient<any> = createClient<any>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  }
);

// 管理員客戶端（繞過 RLS）
export const supabaseAdmin: SupabaseClient<any> = createClient<any>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
  }
);

// ============================================
// 輔助函數：錯誤處理
// ============================================

export class SupabaseError extends Error {
  constructor(message: string, public code: string, public details?: unknown) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export function handleSupabaseError(error: unknown): never {
  if (error && typeof error === 'object' && 'message' in error) {
    const supabaseError = error as { message: string; code?: string; details?: unknown };
    throw new SupabaseError(
      supabaseError.message,
      supabaseError.code || 'UNKNOWN_ERROR',
      supabaseError.details
    );
  }

  throw new SupabaseError('An unknown database error occurred', 'UNKNOWN_ERROR');
}

// ============================================
// 連線測試
// ============================================

export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('evidences' as any)
      .select('id')
      .limit(1);
    return !error;
  } catch {
    return false;
  }
}
