/**
 * Report Style & Brand Theme Store - 報告樣式與品牌設定
 * 客製化報告樣式、品牌色系應用
 */

import { supabase } from '../db/supabase';

export interface BrandTheme {
  id: string;
  userId: string;
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string;
  coverPage?: string;
}

export interface ReportStyle {
  id: string;
  userId: string;
  template: 'classic' | 'modern' | 'executive' | 'technical';
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  sections: {
    cover: boolean;
    toc: boolean;
    executive: boolean;
    compliance: boolean;
    references: boolean;
  };
  brandThemeId?: string;
}

const DEFAULT_BRAND: BrandTheme = {
  id: 'default-brand',
  userId: 'system',
  brandName: 'ESGGO',
  primaryColor: '#003262',
  secondaryColor: '#3B7EA1',
  accentColor: '#FDB515',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const DEFAULT_STYLES: Record<string, ReportStyle> = {
  classic: {
    id: 'classic',
    userId: 'system',
    template: 'classic',
    pageSize: 'A4',
    orientation: 'portrait',
    margins: { top: 25, right: 20, bottom: 25, left: 20 },
    sections: { cover: true, toc: true, executive: true, compliance: true, references: true },
  },
  modern: {
    id: 'modern',
    userId: 'system',
    template: 'modern',
    pageSize: 'A4',
    orientation: 'portrait',
    margins: { top: 30, right: 25, bottom: 30, left: 25 },
    sections: { cover: true, toc: true, executive: true, compliance: true, references: true },
  },
  executive: {
    id: 'executive',
    userId: 'system',
    template: 'executive',
    pageSize: 'Letter',
    orientation: 'portrait',
    margins: { top: 20, right: 15, bottom: 20, left: 15 },
    sections: { cover: true, toc: false, executive: true, compliance: false, references: true },
  },
};

// 獲取品牌設定
export const getBrandTheme = async (userId: string): Promise<BrandTheme> => {
  const { data } = await supabase.from('brand_themes').select('*').eq('user_id', userId).single();
  return data || DEFAULT_BRAND;
};

// 儲存品牌設定
export const saveBrandTheme = async (theme: BrandTheme): Promise<string | null> => {
  const { data, error } = await supabase.from('brand_themes').upsert(theme).select('id').single();
  return error ? null : data?.id;
};

// 獲取報告樣式
export const getReportStyle = async (userId: string): Promise<ReportStyle> => {
  const { data } = await supabase.from('report_styles').select('*').eq('user_id', userId).single();
  return data || DEFAULT_STYLES.classic;
};

// 儲存報告樣式
export const saveReportStyle = async (style: ReportStyle): Promise<string | null> => {
  const { data, error } = await supabase.from('report_styles').upsert(style).select('id').single();
  return error ? null : data?.id;
};

// 應用品牌樣式至報告
export const applyBrandToReport = (reportContent: string, brand: BrandTheme): string => {
  return `<style>
    :root {
      --brand-primary: ${brand.primaryColor};
      --brand-secondary: ${brand.secondaryColor};
      --brand-accent: ${brand.accentColor};
      --brand-font: ${brand.fontFamily};
    }
    .report-header { color: var(--brand-primary); }
    .report-accent { color: var(--brand-accent); }
  </style>
${reportContent}`;
};

// 初始化預設樣式
export const initializeReportStyles = async () => {
  const { error } = await supabase.from('report_styles').upsert(Object.values(DEFAULT_STYLES));
  return !error;
};
