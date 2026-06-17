/**
 * OmniTag System - 萬能標籤系統
 * MECE 標籤分類、自動標記、查詢與聚類
 */

import { supabase } from '../db/supabase';

export interface OmniTag {
  id: string;
  name: string;
  category: 'environmental' | 'social' | 'governance' | 'compliance' | 'benchmark' | 'risk';
  color: string;
  description?: string;
}

export interface TaggedItem {
  itemId: string;
  itemType: 'report' | 'document' | 'evidence' | 'note' | 'calculation';
  tags: string[];
}

// 預定義標籤
const DEFAULT_TAGS: OmniTag[] = [
  // 環境 (Environmental)
  {
    id: 'tag-env-energy',
    name: 'energy',
    category: 'environmental',
    color: '#10B981',
    description: '能源相關',
  },
  {
    id: 'tag-env-carbon',
    name: 'carbon',
    category: 'environmental',
    color: '#EF4444',
    description: '碳排放',
  },
  {
    id: 'tag-env-water',
    name: 'water',
    category: 'environmental',
    color: '#3B82F6',
    description: '水資源',
  },
  {
    id: 'tag-env-waste',
    name: 'waste',
    category: 'environmental',
    color: '#F59E0B',
    description: '廢棄物',
  },

  // 社會 (Social)
  {
    id: 'tag-social-diversity',
    name: 'diversity',
    category: 'social',
    color: '#8B5CF6',
    description: '多元性',
  },
  {
    id: 'tag-social-safety',
    name: 'safety',
    category: 'social',
    color: '#EC4899',
    description: '職場安全',
  },
  {
    id: 'tag-social-training',
    name: 'training',
    category: 'social',
    color: '#06B6D4',
    description: '員工訓練',
  },

  // 治理 (Governance)
  {
    id: 'tag-gov-anti',
    name: 'anti-corruption',
    category: 'governance',
    color: '#6366F1',
    description: '反貪腐',
  },
  {
    id: 'tag-gov-board',
    name: 'board',
    category: 'governance',
    color: '#818CF8',
    description: '董事會',
  },

  // 合規 (Compliance)
  {
    id: 'tag-comp-gri',
    name: 'gri',
    category: 'compliance',
    color: '#14B8A6',
    description: 'GRI 標準',
  },
  {
    id: 'tag-comp-tcfd',
    name: 'tcfd',
    category: 'compliance',
    color: '#0D9488',
    description: 'TCFD 框架',
  },

  // 標竿 (Benchmark)
  {
    id: 'tag-benchmark-top',
    name: 'benchmark',
    category: 'benchmark',
    color: '#FACC15',
    description: '業界標竿',
  },

  // 風險 (Risk)
  {
    id: 'tag-risk-climate',
    name: 'climate-risk',
    category: 'risk',
    color: '#F87171',
    description: '氣候風險',
  },
];

// 獲取所有標籤
export const getAllTags = async (): Promise<OmniTag[]> => {
  try {
    const { data } = await supabase.from('omni_tags').select('*');
    return data || DEFAULT_TAGS;
  } catch {
    return DEFAULT_TAGS;
  }
};

export { DEFAULT_TAGS };

// 建立標籤
export const createTag = async (tag: OmniTag): Promise<string | null> => {
  const { data, error } = await supabase.from('omni_tags').insert(tag).select('id').single();
  return error ? null : data?.id;
};

// 為項目加上標籤
export const tagItem = async (item: TaggedItem): Promise<boolean> => {
  const { error } = await supabase.from('tagged_items').upsert({
    item_id: item.itemId,
    item_type: item.itemType,
    tags: item.tags,
  });
  return !error;
};

// 查詢標籤下的項目
export const getItemsByTag = async (tagName: string): Promise<TaggedItem[]> => {
  const { data, error } = await supabase
    .from('tagged_items')
    .select('*')
    .contains('tags', [tagName]);
  if (error) return [];
  return data.map((d: any) => ({
    itemId: d.item_id,
    itemType: d.item_type,
    tags: d.tags,
  }));
};

// 標籤聚類
export const getClassifiedTags = async (itemId: string): Promise<OmniTag[]> => {
  const { data } = await supabase
    .from('tagged_items')
    .select('tags')
    .eq('item_id', itemId)
    .single();

  const allTags = await getAllTags();
  return allTags.filter((t) => (data?.tags || []).includes(t.name));
};

// 初始化標籤表
export const initializeTags = async () => {
  const { error } = await supabase.from('omni_tags').upsert(DEFAULT_TAGS);
  return !error;
};
