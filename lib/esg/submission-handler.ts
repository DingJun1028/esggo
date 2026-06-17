/**
 * Document Submission Handler - 數據單據填寫與映射
 * 整合 OCR 提取數據、API 串接數據、手動填寫數據至 GRI 樣板
 */

import { supabase } from '../db/supabase';
import { applyGRIExpertTemplate } from './gri-expert-templates-store';
import { processOCRDocument } from './data-integrator';

export interface SubmissionField {
  id: string;
  griCode: string;
  templateId: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: 'text' | 'number' | 'date' | 'select' | 'file';
  required: boolean;
  source: 'manual' | 'ocr' | 'api' | 'calculated';
  dataSource?: {
    type: 'numeric' | 'string' | 'array';
    path?: string;
  };
}

// 預定義單據欄位映射 (橋接 GRI 樣板與數據來源)
const SUBMISSION_FIELD_MAPPINGS: SubmissionField[] = [
  // GRI 302-1 能源消耗
  {
    id: 'field-302-1-energy-type',
    griCode: 'GRI 302-1',
    templateId: 'template-302-1-1',
    fieldName: 'ENERGY_TYPE',
    fieldLabel: '能源類型',
    fieldType: 'text',
    required: true,
    source: 'api',
    dataSource: { type: 'string', path: 'energy.type' },
  },
  {
    id: 'field-302-1-consumption',
    griCode: 'GRI 302-1',
    templateId: 'template-302-1-1',
    fieldName: 'CONSUMPTION',
    fieldLabel: '消耗量 (GJ)',
    fieldType: 'number',
    required: true,
    source: 'ocr',
    dataSource: { type: 'numeric', path: 'utility.bill.amount' },
  },
  // GRI 305-1 碳排放
  {
    id: 'field-305-1-scope1',
    griCode: 'GRI 305-1',
    templateId: 'template-305-1-1',
    fieldName: 'EMISSION',
    fieldLabel: '範疇一排放 (tCO2e)',
    fieldType: 'number',
    required: true,
    source: 'calculated',
  },
];

// 處理單據填寫流程
export const processSubmission = async (
  userId: string,
  griCode: string,
  values: Record<string, unknown>
): Promise<{ success: boolean; filledContent?: string; errors?: string[] }> => {
  const errors: string[] = [];
  const { getGRIExpertTemplate } = await import('./gri-expert-templates-store');
  const template = await getGRIExpertTemplate(`template-${griCode}-1`);

  if (!template) {
    return { success: false, errors: ['Template not found'] };
  }

  const result = applyGRIExpertTemplate(template, values as Record<string, string | number>);

  // 儲存填寫結果
  await supabase.from('submission_filled').insert({
    user_id: userId,
    gri_code: griCode,
    filled_content: result,
    data_values: values,
  });

  return { success: true, filledContent: result };
};

// OCR 自動填入
export const autoFillFromOCR = async (
  userId: string,
  file: File,
  griCode: string
): Promise<Record<string, unknown>> => {
  const ocrData = await processOCRDocument(file, griCode);
  const extracted = ocrData.extractedData || {};

  // 映射 OCR 結果至單據欄位
  const mapped: Record<string, unknown> = {};
  SUBMISSION_FIELD_MAPPINGS.filter((f) => f.griCode === griCode).forEach((field) => {
    if (field.fieldName in extracted) {
      mapped[field.fieldName] = extracted[field.fieldName];
    }
  });

  return mapped;
};

// 獲取單據填寫 UI 配置
export const getSubmissionFields = async (griCode: string): Promise<SubmissionField[]> => {
  return SUBMISSION_FIELD_MAPPINGS.filter((f) => f.griCode === griCode);
};

// 驗證單據完整性
export const validateSubmission = (griCode: string, values: Record<string, unknown>): string[] => {
  const requiredFields = SUBMISSION_FIELD_MAPPINGS.filter(
    (f) => f.griCode === griCode && f.required
  ).map((f) => f.fieldName);

  const missing = requiredFields.filter((field) => !(field in values));
  return missing.map((m) => `Missing required field: ${m}`);
};
