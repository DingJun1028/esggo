/**
 * Reading Room Store - 萬能書櫃
 * 標準文件、報告樣本、比較實驗室資料
 */

import { supabase } from '../db/supabase';
import { dcListScrapedArticles } from '../dataconnect-services';

export interface ReadingRoomDocument {
  id: string;
  title: string;
  description?: string;
  category: 'standard' | 'template' | 'case-study' | 'regulation' | 'industry-report';
  fileUrl?: string;
  griReference?: string;
  esgCategory?: 'Environmental' | 'Social' | 'Governance';
  tags?: string[];
  source?: string;
  publishedDate?: string;
  createdAt?: string;
}

// 獲取書櫃文件列表
export const getReadingRoomDocuments = async (
  category?: ReadingRoomDocument['category']
): Promise<ReadingRoomDocument[]> => {
  try {
    let query = supabase.from('reading_room_documents').select('*');
    if (category) query = query.eq('category', category);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as ReadingRoomDocument[];
  } catch {
    return [];
  }
};

// 獲取單一文檔
export const getReadingRoomDocument = async (id: string): Promise<ReadingRoomDocument | null> => {
  try {
    const { data, error } = await supabase
      .from('reading_room_documents')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as ReadingRoomDocument;
  } catch {
    return null;
  }
};

// 獲取每日 ESG 新聞
export const getDailyESGNews = async (): Promise<any[]> => {
  try {
    const articles = await dcListScrapedArticles();
    return articles || [];
  } catch {
    return [];
  }
};

// 比較實驗室 - 跨企業指標對比
export const getComparativeLabData = async (metric: string, year?: number): Promise<any[]> => {
  try {
    let query = supabase.from('esg_benchmark_enterprises').select('*').eq('category', metric);
    if (year) query = query.eq('year', year);
    const { data } = await query;
    return data || [];
  } catch {
    return [];
  }
};

// 標準文件搜尋 (支援 GRI code)
export const searchReadingRoom = async (query: string): Promise<ReadingRoomDocument[]> => {
  const { data, error } = await supabase
    .from('reading_room_documents')
    .select('*')
    .or(`title.ilike.%${query}%,tags.cs.${JSON.stringify([query])},gri_reference.eq.${query}`);
  if (error) return [];
  return (data || []) as ReadingRoomDocument[];
};
