/**
 * Vault Store - 萬能典藏
 * 加密文件、佐證鎖檔、永久封存
 */

import { supabase } from '../db/supabase';
import { applyDataMasking, type MaskingLevel } from '../crypto-proof';

export interface VaultItem {
  id?: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  filePath?: string;
  encryptionLevel: MaskingLevel;
  hashLock: string;
  tag?: string;
  category?: 'evidence' | 'report' | 'template' | 'archive';
  createdAt?: string;
  expiresAt?: string;
}

const createHashLock = async (data: unknown): Promise<string> => {
  const timestamp = new Date().toISOString();
  const content = JSON.stringify(data) + timestamp;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

// 儲存檔案至典藏庫
export const storeVaultItem = async (item: VaultItem): Promise<string | null> => {
  try {
    const hashLock = await createHashLock(item.fileName + item.fileType);
    const { data, error } = await supabase
      .from('omni_vault')
      .insert({ ...item, hash_lock: hashLock })
      .select('id')
      .single();
    if (error) throw error;
    return data?.id || null;
  } catch {
    return null;
  }
};

// 獲取用戶典藏列表
export const getUserVaultItems = async (userId: string): Promise<VaultItem[]> => {
  try {
    const { data, error } = await supabase
      .from('omni_vault')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
};

// 套用加密遮罩
export const encryptVaultItem = (value: string | number, level: MaskingLevel): string => {
  return applyDataMasking(value, level);
};

// 驗證典藏完整性
export const verifyVaultItem = async (id: string, expectedHash: string): Promise<boolean> => {
  const { data } = await supabase.from('omni_vault').select('hash_lock').eq('id', id).single();
  return data?.hash_lock === expectedHash;
};

// 刪除典藏項目
export const deleteVaultItem = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('omni_vault').delete().eq('id', id);
  return !error;
};
