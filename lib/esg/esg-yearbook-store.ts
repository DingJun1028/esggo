/**
 * ESG Yearbook & Benchmark Data Store
 * 歷年企業 ESG 年鑑、前10大標竿企業樣本
 */

import { supabase } from '../db/supabase';

// 標竿企業分類
export type BenchmarkCategory =
  | 'carbon'
  | 'renewable'
  | 'supply_chain'
  | 'diversity'
  | 'governance';

export interface BenchmarkEnterprise {
  id: string;
  name: string;
  year: number;
  category: BenchmarkCategory;
  esg_score: number;
  carbon_intensity?: number; // tCO2e/Revenue
  renewable_percentage?: number; // %
  diversity_score?: number; // %
  governance_rating?: number; // 1-5
  hash_lock?: string;
  source_url?: string;
  created_at?: string;
}

// ESG 年鑑樣本資料 (2020-2025)
const SAMPLE_BENCHMARK_ENTERPRISES: BenchmarkEnterprise[] = [
  {
    id: 'bench-1',
    name: '台積電',
    year: 2025,
    category: 'carbon',
    esg_score: 85,
    carbon_intensity: 0.85,
    source_url: 'https://www.tsmc.com',
  },
  {
    id: 'bench-2',
    name: '台積電',
    year: 2024,
    category: 'renewable',
    esg_score: 92,
    renewable_percentage: 85,
    source_url: 'https://www.tsmc.com',
  },
  {
    id: 'bench-3',
    name: '台積電',
    year: 2023,
    category: 'supply_chain',
    esg_score: 88,
    source_url: 'https://www.tsmc.com',
  },
  {
    id: 'bench-4',
    name: 'Apple',
    year: 2025,
    category: 'supply_chain',
    esg_score: 90,
    carbon_intensity: 1.2,
    source_url: 'https://www.apple.com',
  },
  {
    id: 'bench-5',
    name: 'Microsoft',
    year: 2025,
    category: 'carbon',
    esg_score: 88,
    carbon_intensity: 0.67,
    renewable_percentage: 100,
    source_url: 'https://www.microsoft.com',
  },
  {
    id: 'bench-6',
    name: 'Google',
    year: 2025,
    category: 'renewable',
    esg_score: 94,
    renewable_percentage: 100,
    source_url: 'https://www.google.com',
  },
  {
    id: 'bench-7',
    name: 'Samsung',
    year: 2024,
    category: 'carbon',
    esg_score: 78,
    carbon_intensity: 2.1,
    source_url: 'https://www.samsung.com',
  },
  {
    id: 'bench-8',
    name: 'UNIQLO (Fast Retailing)',
    year: 2025,
    category: 'supply_chain',
    esg_score: 82,
    source_url: 'https://www.uniqlo.com',
  },
  {
    id: 'bench-9',
    name: 'IKEA',
    year: 2024,
    category: 'renewable',
    esg_score: 89,
    renewable_percentage: 80,
    source_url: 'https://www.ikea.com',
  },
  {
    id: 'bench-10',
    name: 'Ørsted',
    year: 2025,
    category: 'carbon',
    esg_score: 95,
    carbon_intensity: 0,
    renewable_percentage: 100,
    source_url: 'https://www.orsted.com',
  },
];

// 獲取標竿企業列表
export const getBenchmarkEnterprises = async (
  category?: BenchmarkCategory
): Promise<BenchmarkEnterprise[]> => {
  try {
    let query = supabase.from('esg_benchmark_enterprises').select('*');
    if (category) query = query.eq('category', category);
    const { data, error } = await query.order('year', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return SAMPLE_BENCHMARK_ENTERPRISES.map((e, i) => ({ ...e, id: `bench-${i + 1}` }));
  }
};

// 獲取 ESG 企業年鑑 (按年份)
export const getEsxYearbook = async (year?: number): Promise<BenchmarkEnterprise[]> => {
  try {
    let query = supabase.from('esg_benchmark_enterprises').select('*');
    if (year) query = query.eq('year', year);
    const { data } = await query;
    return data || [];
  } catch {
    return SAMPLE_BENCHMARK_ENTERPRISES.filter((e) => !year || e.year === year);
  }
};

// 初始化標竿企業資料表
export const initializeBenchmarkTable = async () => {
  const { error } = await supabase.from('esg_benchmark_enterprises').upsert(
    SAMPLE_BENCHMARK_ENTERPRISES.map((e, i) => ({
      id: `bench-${i + 1}`,
      ...e,
    }))
  );
  return !error;
};
