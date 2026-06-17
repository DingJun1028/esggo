/**
 * Sustain Write Store - 永續撰寫資料室
 * 企業永續報告草稿、內容編輯、版本控制
 */

import { supabase } from '../db/supabase';

export interface SustainWriteDocument {
  id?: string;
  userId: string;
  title: string;
  content: string;
  documentType: 'sustainability' | 'carbon-accounting' | 'esg-disclosure' | 'transition-plan';
  griMappings?: string[]; // 關聯 GRI 標準
  evidenceIds?: string[]; // 關聯佐證檔案
  version: number;
  status: 'draft' | 'review' | 'published' | 'archived';
  collaborators?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// 儲存永續報告草稿
export const storeSustainWriteDocument = async (
  doc: SustainWriteDocument
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('sustain_write_documents')
      .insert({
        user_id: doc.userId,
        title: doc.title,
        content: doc.content,
        document_type: doc.documentType,
        gri_mappings: doc.griMappings,
        evidence_ids: doc.evidenceIds,
        version: doc.version || 1,
        status: doc.status || 'draft',
        collaborators: doc.collaborators || [],
      })
      .select('id')
      .single();
    if (error) throw error;
    return data?.id || null;
  } catch {
    return null;
  }
};

// 獲取用戶永續報告
export const getUserSustainWriteDocs = async (userId: string): Promise<SustainWriteDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('sustain_write_documents')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return (data || []) as SustainWriteDocument[];
  } catch {
    return [];
  }
};

// 更新草稿版本
export const updateSustainWriteDocument = async (
  id: string,
  updates: Partial<SustainWriteDocument>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sustain_write_documents')
      .update({
        ...updates,
        version: updates.version ? updates.version + 1 : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
};

// 關聯 GRI 標準至文件
export const linkGRIReferences = async (
  documentId: string,
  griCodes: string[]
): Promise<boolean> => {
  const { error } = await supabase
    .from('sustain_write_documents')
    .update({ gri_mappings: griCodes })
    .eq('id', documentId);
  return !error;
};

// 關聯佐證檔案至文件
export const linkEvidenceFiles = async (
  documentId: string,
  evidenceIds: string[]
): Promise<boolean> => {
  const { error } = await supabase
    .from('sustain_write_documents')
    .update({ evidence_ids: evidenceIds })
    .eq('id', documentId);
  return !error;
};

// 獲取文件版本歷史
export const getDocumentVersions = async (documentId: string): Promise<SustainWriteDocument[]> => {
  const { data } = await supabase
    .from('sustain_write_documents')
    .select('*')
    .eq('id', documentId)
    .order('version', { ascending: true });
  return (data || []) as SustainWriteDocument[];
};
