/**
 * GRI Standards Database Store
 * 全球報告初始化組織 GRI 標準參考框架
 */

import { supabase } from '../db/supabase';

export interface GRIStandard {
  id: string;
  material_topic: string;
  disclosure_requirements: string[];
  esg_category: 'Environmental' | 'Social' | 'Governance';
  gri_code: string; // e.g., GRI 302-1
  sub_metrics?: string[]; // 子指標
  guidance_reference?: string; // 指南連結
}

// GRI 2021 標準核心參考
const GRI_STANDARDS_2021: GRIStandard[] = [
  {
    id: 'gri-302-1',
    gri_code: 'GRI 302-1',
    material_topic: '能源消耗 (Energy Consumption)',
    esg_category: 'Environmental',
    disclosure_requirements: [
      '報告期間能源消耗量',
      '能源消耗單位轉換為標準單位',
      '能源消耗趨勢分析',
    ],
    sub_metrics: ['能源消耗總量', '能源強度', '再生能源占比'],
  },
  {
    id: 'gri-305-1',
    gri_code: 'GRI 305-1',
    material_topic: '溫室氣體排放 (GHG Emissions)',
    esg_category: 'Environmental',
    disclosure_requirements: [
      '範疇一直接排放',
      '範疇二間接排放',
      '範疇三其他間接排放',
      '排放密度與趨勢',
    ],
    sub_metrics: ['CO2e總量', '能源強度', '碳盤查方法學'],
  },
  {
    id: 'gri-401-1',
    gri_code: 'GRI 401-1',
    material_topic: '就業人數 (Employment)',
    esg_category: 'Social',
    disclosure_requirements: ['員工總數', '新進員工數', '離職員數', '員工流動率'],
  },
  {
    id: 'gri-405-1',
    gri_code: 'GRI 405-1',
    material_topic: '性別平等 (Gender Equality)',
    esg_category: 'Social',
    disclosure_requirements: ['按性別劃分的員工數', '男女薪酬差異', '推廣措施'],
  },
  {
    id: 'gri-205-1',
    gri_code: 'GRI 205-1',
    material_topic: '反貪腐政策 (Anti-Corruption)',
    esg_category: 'Governance',
    disclosure_requirements: ['反貪腐政策內容', '員工訓練情況', '查訪舉報案件數'],
  },
];

// 獲取 GRI 標準列表
export const getGRIStandards = async (): Promise<GRIStandard[]> => {
  try {
    const { data } = await supabase.from('gri_standards').select('*');
    return data || GRI_STANDARDS_2021;
  } catch {
    return GRI_STANDARDS_2021;
  }
};

// 根據類別篩選
export const getGRIByCategory = async (
  category: 'Environmental' | 'Social' | 'Governance'
): Promise<GRIStandard[]> => {
  try {
    const { data } = await supabase.from('gri_standards').select('*').eq('esg_category', category);
    return data || [];
  } catch {
    return GRI_STANDARDS_2021.filter((s) => s.esg_category === category);
  }
};

// 獲取單一 GRI 標準
export const getGRIStandard = async (code: string): Promise<GRIStandard | null> => {
  try {
    const { data } = await supabase.from('gri_standards').select('*').eq('gri_code', code).single();
    return data || null;
  } catch {
    return GRI_STANDARDS_2021.find((s) => s.gri_code === code) || null;
  }
};

// 初始化 GRI 標準表
export const initializeGRITable = async () => {
  const { error } = await supabase.from('gri_standards').upsert(GRI_STANDARDS_2021);
  return !error;
};
