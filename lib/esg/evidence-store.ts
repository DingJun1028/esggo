/**
 * Evidence Store - 佐證資料庫
 * 企業永續報告、碳盤查、審計證據儲存
 */

import { supabase } from '../db/supabase';

// 內聯 hashLock 函式 (與 crypto-proof 保持一致)
const createHashLock = async (data: unknown): Promise<string> => {
  const timestamp = new Date().toISOString();
  const content = JSON.stringify(data) + timestamp;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return (
    Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('') +
    '::' +
    timestamp
  );
};

export interface EvidenceItem {
  id?: string;
  reportId?: string;
  fileName: string;
  fileUrl?: string;
  hashLock: string;
  dataType: string;
  griReference?: string;
  uploadedAt?: string;
}

// 獲取報告佐證
export const getEvidenceByReport = async (reportId: string): Promise<EvidenceItem[]> => {
  try {
    const { data, error } = await supabase
      .from('omni_evidence')
      .select('*')
      .eq('report_id', reportId)
      .order('uploaded_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
};

// 上傳佐證
export const uploadEvidence = async (
  file: File,
  reportId: string,
  griCode?: string
): Promise<EvidenceItem | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const hashBuffer = await crypto.subtle.digest('SHA-256', uint8Array);
    const hashLock = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const { data, error } = await supabase
      .from('omni_evidence')
      .insert({
        report_id: reportId,
        file_name: file.name,
        hash_lock: hashLock,
        data_type: 'EVIDENCE',
        gri_reference: griCode,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

// 驗證佐證完整性
export const verifyEvidence = async (id: string, originalHash: string): Promise<boolean> => {
  try {
    const { data } = await supabase.from('omni_evidence').select('hash_lock').eq('id', id).single();
    return data?.hash_lock === originalHash;
  } catch {
    return false;
  }
};

// 按 GRI 代碼篩選佐證
export const getEvidenceByGRI = async (griCode: string): Promise<EvidenceItem[]> => {
  try {
    const { data, error } = await supabase
      .from('omni_evidence')
      .select('*')
      .eq('gri_reference', griCode);
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
};
