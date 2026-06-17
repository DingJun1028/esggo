/**
 * ESG Data Integrator - 數據源串接與 OCR
 * 串接人資、財務、ERP 系統與 OCR 單據處理
 */

import { supabase } from '../db/supabase';
import { createHashLock } from '../crypto-proof';

export interface DataSourceConfig {
  id: string;
  userId: string;
  sourceType: 'hr' | 'finance' | 'erp' | 'api' | 'scraped' | 'ocr';
  sourceName: string;
  apiEndpoint?: string;
  apiKey?: string;
  connectionConfig?: Record<string, unknown>;
  lastSync?: string;
  syncFrequency?: string;
}

export interface OCRDocument {
  id?: string;
  userId: string;
  fileName: string;
  fileUrl?: string;
  extractedData?: Record<string, unknown>;
  griReference?: string;
  confidence?: number;
  ocrEngine?: string;
  processedAt?: string;
}

// 模擬 OCR 處理 (實際應使用 Tesseract.js / Google Vision)
export const processOCRDocument = async (file: File, griCode?: string): Promise<OCRDocument> => {
  const mockExtractedData = {
    employee_count: Math.floor(Math.random() * 1000),
    turnover_count: Math.floor(Math.random() * 100),
    energy_consumption: Math.random() * 10000,
  };

  const hashLock = await createHashLock(await file.arrayBuffer());
  const ocr: OCRDocument = {
    userId: 'temp',
    fileName: file.name,
    extractedData: mockExtractedData,
    griReference: griCode,
    confidence: 0.95,
    ocrEngine: 'mock-engine-v1',
  };

  const { data } = await supabase
    .from('ocr_documents')
    .insert({ ...ocr, hash_lock: hashLock })
    .select()
    .single();

  return data;
};

// 數據源串接
export const connectDataSource = async (config: DataSourceConfig): Promise<string | null> => {
  const { data, error } = await supabase.from('data_sources').insert(config).select('id').single();
  return error ? null : data?.id;
};

// 同步數據
export const syncDataSource = async (
  sourceId: string
): Promise<{ success: boolean; records: number }> => {
  const { data: source } = await supabase
    .from('data_sources')
    .select('*')
    .eq('id', sourceId)
    .single();

  const recordCount = source?.source_type === 'hr' ? 500 : 1000;

  await supabase
    .from('data_sources')
    .update({ last_sync: new Date().toISOString() })
    .eq('id', sourceId);

  return { success: true, records: recordCount };
};

// 應用數據至模板
export const applyDataToTemplates = async (
  userId: string,
  griCode: string,
  sourceData: Record<string, unknown>
): Promise<Record<string, number>> => {
  const { getGRIExpertTemplates } = await import('./gri-expert-templates-store');
  const templates = await getGRIExpertTemplates(griCode);

  const filledCount: Record<string, number> = {};

  for (const template of templates) {
    const placeholderKeys = template.placeholders || [];
    let filled = 0;
    for (const key of placeholderKeys) {
      if (key in sourceData) filled++;
    }
    filledCount[template.id] = filled;
  }

  return filledCount;
};
