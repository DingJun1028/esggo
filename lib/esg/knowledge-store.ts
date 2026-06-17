/**
 * ESG Knowledge Library Store - 萬能知識庫
 * 企業永續知識、ESG 筆記、策略建議儲存
 */

import { supabase } from '../db/supabase';

export interface ESGNote {
  id?: string;
  userId: string;
  title: string;
  content: string;
  category: 'knowledge' | 'strategy' | 'benchmark' | 'regulation' | 'insight';
  tags?: string[];
  cardUuid?: string; // 關聯矩陀元件
  pinned?: boolean;
  createdAt?: string;
}

// 儲存 ESG 知識筆記
export const storeESGNote = async (note: ESGNote): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('omni_notes')
      .insert({
        user_id: note.userId,
        content: note.content,
        type: note.category,
        card_uuid: note.cardUuid,
        tags: note.tags || [],
        pinned: note.pinned || false,
      })
      .select('id')
      .single();
    if (error) throw error;
    return data?.id || null;
  } catch {
    return null;
  }
};

// 獲取用戶知識筆記
export const getUserESGNotes = async (
  userId: string,
  category?: ESGNote['category']
): Promise<ESGNote[]> => {
  try {
    let query = supabase.from('omni_notes').select('*').eq('user_id', userId);
    if (category) query = query.eq('type', category);
    const { data, error } = await query.order('last_edited_time', { ascending: false });
    if (error) throw error;
    return (data || []) as ESGNote[];
  } catch {
    return [];
  }
};

// 搜尋知識庫 (全文搜尋)
export const searchESGNotes = async (userId: string, query: string): Promise<ESGNote[]> => {
  try {
    const { data, error } = await supabase
      .from('omni_notes')
      .select('*')
      .eq('user_id', userId)
      .textSearch('content', query);
    if (error) throw error;
    return (data || []) as ESGNote[];
  } catch {
    return [];
  }
};

// 更新筆記
export const updateESGNote = async (id: string, updates: Partial<ESGNote>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('omni_notes')
      .update({
        ...updates,
        last_edited_time: new Date().toISOString(),
      })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
};

// 刪除筆記
export const deleteESGNote = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('omni_notes').delete().eq('id', id);
  return !error;
};

// 獲取知識庫統計
export const getKnowledgeStats = async (
  userId: string
): Promise<{
  totalNotes: number;
  pinnedCount: number;
  byCategory: Record<string, number>;
}> => {
  try {
    const { data, error } = await supabase
      .from('omni_notes')
      .select('type, pinned')
      .eq('user_id', userId);
    if (error) throw error;

    const byCategory: Record<string, number> = {};
    data?.forEach((note: any) => {
      byCategory[note.type] = (byCategory[note.type] || 0) + 1;
    });

    return {
      totalNotes: data?.length || 0,
      pinnedCount: data?.filter((n: any) => n.pinned).length || 0,
      byCategory,
    };
  } catch {
    return { totalNotes: 0, pinnedCount: 0, byCategory: {} };
  }
};
