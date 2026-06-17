/**
 * CBAM Calculator Store - 歐盟碳邊境調整機制計算器
 */

import { supabase } from '../db/supabase';

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

export interface CBAmEmissionsFactor {
  id: string;
  productCategory: string;
  hsCode?: string;
  defaultEmissionFactor: number;
  unit: string;
  source?: string;
  updatedAt?: string;
}

export interface CBamCalculation {
  id?: string;
  productName: string;
  productCategory: string;
  importValueUsd?: number;
  quantity: number;
  emissionFactor: number;
  calculatedEmissions: number;
  currency?: string;
  countryOfOrigin?: string;
  hashLock?: string;
  metadata?: Record<string, unknown>;
}

// 歐盟 CBAM 標準排放因子 (2024)
const CBAM_FACTORS: CBAmEmissionsFactor[] = [
  {
    id: 'cbam-iron',
    productCategory: 'Iron and steel',
    hsCode: '7208',
    defaultEmissionFactor: 2.0,
    unit: 'tCO2e/t',
  },
  {
    id: 'cbam-cement',
    productCategory: 'Cement',
    hsCode: '2523',
    defaultEmissionFactor: 0.9,
    unit: 'tCO2e/t',
  },
  {
    id: 'cbam-fertilizer',
    productCategory: 'Fertilizers',
    hsCode: '2712',
    defaultEmissionFactor: 1.8,
    unit: 'tCO2e/t',
  },
  {
    id: 'cbam-aluminum',
    productCategory: 'Aluminium',
    hsCode: '7601',
    defaultEmissionFactor: 12.0,
    unit: 'tCO2e/t',
  },
  {
    id: 'cbam-electricity',
    productCategory: 'Electricity/energy',
    hsCode: '2711',
    defaultEmissionFactor: 0.5,
    unit: 'tCO2e/MWh',
  },
  {
    id: 'cbam-hydrogen',
    productCategory: 'Hydrogen',
    hsCode: '2804',
    defaultEmissionFactor: 20.0,
    unit: 'tCO2e/t',
  },
];

// 獲取 CBAM 排放因子
export const getCBAmFactors = async (): Promise<CBAmEmissionsFactor[]> => {
  try {
    const { data } = await supabase.from('cbam_emissions_factors').select('*');
    return data || CBAM_FACTORS;
  } catch {
    return CBAM_FACTORS;
  }
};

// 依產品類別獲取因子
export const getFactorByCategory = async (
  category: string
): Promise<CBAmEmissionsFactor | null> => {
  const factors = await getCBAmFactors();
  return factors.find((f) => f.productCategory === category) || null;
};

// 儲存 CBAM 計算結果
export const saveCBamCalculation = async (calc: CBamCalculation): Promise<string | null> => {
  try {
    const hashLock = await createHashLock(JSON.stringify(calc));
    const { data, error } = await supabase
      .from('cbam_calculations')
      .insert({ ...calc, hash_lock: hashLock })
      .select('id')
      .single();
    if (error) throw error;
    return data?.id || null;
  } catch {
    return null;
  }
};

// 獲取用戶 CBAM 計算歷史
export const getUserCBamCalculations = async (userId: string): Promise<CBamCalculation[]> => {
  try {
    const { data, error } = await supabase
      .from('cbam_calculations')
      .select('*')
      .eq('user_id', userId)
      .order('calculation_date', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
};

// 計算碳邊境稅款
export const calculateCBamTax = (
  emissions: number,
  carbonPrice: number = 80 // 歐盟 ETS 價格 (EUR/tCO2e)
): number => {
  return emissions * carbonPrice;
};
