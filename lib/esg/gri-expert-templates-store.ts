/**
 * GRI Expert Templates Store - GRI 章節零算力專家模版
 * 預存儲存的版型資料，企業可直接套用
 */

import { supabase } from '../db/supabase';

export interface GRIExpertTemplate {
  id: string;
  griCode: string;
  templateName: string;
  industry?: string;
  section: number;
  content: string;
  placeholders?: string[];
  complianceChecklist?: string[];
  disclosureHints?: string[];
}

export interface GRIChapter {
  id: string;
  griCode: string;
  chapterTitle: string;
  sections: number;
  templateIds: string[];
  sectorSpecific?: boolean;
}

const GRI_EXPERT_TEMPLATES: GRIExpertTemplate[] = [
  {
    id: 'template-302-1-1',
    griCode: 'GRI 302-1',
    templateName: '能源消耗報告範本',
    industry: 'general',
    section: 1,
    content: `## 能源消耗報告 (Energy Consumption Disclosure)

### 報告期間能源消耗量
| 能源類型 | 數量 (GJ) | 單位轉換 (MWh) | 佔比 (%) |
|---------|----------|----------------|---------|
| [ENERGY_TYPE] | [CONSUMPTION] | [MWH_VALUE] | [PERCENTAGE] |

### 能源消耗趨勢分析
- 與去年同期比較: [CHANGE_PERCENT]%
- 主要消耗活動: [MAIN_ACTIVITY]

### 再生能源使用情況
- 再生能源百分比: [RENEWABLE_PERCENT]%
- 再生能源認證: [CERTIFICATION]
`,
    placeholders: [
      'ENERGY_TYPE',
      'CONSUMPTION',
      'MWH_VALUE',
      'PERCENTAGE',
      'CHANGE_PERCENT',
      'MAIN_ACTIVITY',
      'RENEWABLE_PERCENT',
      'CERTIFICATION',
    ],
    complianceChecklist: [
      '報告期間能源消耗量',
      '能源消耗單位轉換為標準單位',
      '能源消耗趨勢分析',
      '再生能源占比',
    ],
    disclosureHints: [
      '參考 ISO 50001 標準',
      '使用 GHG Protocol 能源計算方法',
      '提供能源使用強度指標 (Energy Intensity)',
    ],
  },
  {
    id: 'template-305-1-1',
    griCode: 'GRI 305-1',
    templateName: '溫室氣體排放範本',
    industry: 'general',
    section: 1,
    content: `## 溫室氣體排放 (GHG Emissions)

### 範疇一直接排放
| 活動 | 洗產量 | 活動數據 | 排放係數 | CO2e (t) |
|------|-------|---------|---------|---------|
| [ACTIVITY] | [PRODUCTION] | [DATA] | [FACTOR] | [EMISSION] |

### 範疇二間接排放
- 購買電力: [ELECTRICITY_EMISSION] tCO2e
- 購買蒸汽: [STEAM_EMISSION] tCO2e

### 範疇三其他間接排放
| 範疇類別 | 排放量 (tCO2e) |
|---------|----------------|
| 上下游運輸 | [UPSTREAM_TRANSPORT] |
| 產品使用階段 | [PRODUCT_USE] |
| 廢棄物處理 | [WASTE_DISPOSAL] |

### 排放密度與趨勢
- 排放密度: [EMISSION_INTENSITY] tCO2e/百萬營收
- 年變化: [YEAR_OVER_YEAR_CHANGE]%
`,
    placeholders: [
      'ACTIVITY',
      'PRODUCTION',
      'DATA',
      'FACTOR',
      'EMISSION',
      'ELECTRICITY_EMISSION',
      'STEAM_EMISSION',
      'UPSTREAM_TRANSPORT',
      'PRODUCT_USE',
      'WASTE_DISPOSAL',
      'EMISSION_INTENSITY',
      'YEAR_OVER_YEAR_CHANGE',
    ],
    complianceChecklist: [
      '範疇一直接排放',
      '範疇二間接排放',
      '範疇三其他間接排放',
      '排放密度與趨勢',
    ],
    disclosureHints: ['遵循 GHG Protocol 企業標準', '提供碳盤查報告連結', '標註使用之排放係數來源'],
  },
  {
    id: 'template-401-1-1',
    griCode: 'GRI 401-1',
    templateName: '就業人數報告範本',
    industry: 'general',
    section: 1,
    content: `## 就業人數 (Employment)

### 員工總數
- 全球員工總數: [TOTAL_EMPLOYEES] 人
- 男女比例: [MALE_FEMALE_RATIO]
- 按職能分類:
  - 管理層: [MANAGEMENT_COUNT]
  - 專業人員: [PROFESSIONAL_COUNT]
  - 技術員: [TECHNICAL_COUNT]

### 入雇與離職情況
- 新進員工數: [NEW_HIRE_COUNT]
- 離職員數: [TURNOVER_COUNT]
- 員工流動率: [TURNOVER_RATE]%

### 員工發展與訓練
- 訓練時數: [TRAINING_HOURS] 小時/人
- 訓練經費: [TRAINING_BUDGET] USD
`,
    placeholders: [
      'TOTAL_EMPLOYEES',
      'MALE_FEMALE_RATIO',
      'MANAGEMENT_COUNT',
      'PROFESSIONAL_COUNT',
      'TECHNICAL_COUNT',
      'NEW_HIRE_COUNT',
      'TURNOVER_COUNT',
      'TURNOVER_RATE',
      'TRAINING_HOURS',
      'TRAINING_BUDGET',
    ],
    complianceChecklist: ['員工總數', '新進員工數', '離職員數', '員工流動率'],
  },
];

// GRI 章節結構
const GRI_CHAPTERS: GRIChapter[] = [
  {
    id: 'chapter-302',
    griCode: 'GRI 302',
    chapterTitle: '能源消耗 (Energy)',
    sections: 4,
    templateIds: ['template-302-1-1', 'template-302-2-1', 'template-302-3-1', 'template-302-4-1'],
  },
  {
    id: 'chapter-305',
    griCode: 'GRI 305',
    chapterTitle: '排放與排放間接物質 (Emissions)',
    sections: 7,
    templateIds: [
      'template-305-1-1',
      'template-305-2-1',
      'template-305-3-1',
      'template-305-4-1',
      'template-305-5-1',
      'template-305-6-1',
      'template-305-7-1',
    ],
  },
  {
    id: 'chapter-401',
    griCode: 'GRI 401',
    chapterTitle: '就業 (Employment)',
    sections: 3,
    templateIds: ['template-401-1-1', 'template-401-2-1', 'template-401-3-1'],
  },
];

// 獲取 GRI 專家模板
export const getGRIExpertTemplates = async (
  griCode?: string,
  industry?: string
): Promise<GRIExpertTemplate[]> => {
  try {
    let query = supabase.from('gri_expert_templates').select('*');
    if (griCode) query = query.eq('gri_code', griCode);
    if (industry) query = query.eq('industry', industry);
    const { data, error } = await query;
    if (error) throw error;
    return data || GRI_EXPERT_TEMPLATES;
  } catch {
    return GRI_EXPERT_TEMPLATES.filter(
      (t) => (!griCode || t.griCode === griCode) && (!industry || t.industry === industry)
    );
  }
};

// 獲取單一模板
export const getGRIExpertTemplate = async (id: string): Promise<GRIExpertTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('gri_expert_templates')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  } catch {
    return GRI_EXPERT_TEMPLATES.find((t) => t.id === id) || null;
  }
};

// 套用模板並填入數據
export const applyGRIExpertTemplate = (
  template: GRIExpertTemplate,
  data: Record<string, string | number>
): string => {
  let content = template.content;
  template.placeholders?.forEach((placeholder) => {
    const value = data[placeholder] ?? `[${placeholder}]`;
    content = content.split(`[${placeholder}]`).join(String(value));
  });
  return content;
};

// 初始化 GRI 專家模板表
export const initializeGRIExpertTemplates = async () => {
  const { error } = await supabase.from('gri_expert_templates').upsert(GRI_EXPERT_TEMPLATES);
  return !error;
};
