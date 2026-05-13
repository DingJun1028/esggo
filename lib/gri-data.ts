/**
 * ESG GO | GRI 2026-2027 核心數據字典
 * 整合 GRI, SASB, TCFD 揭露準則與 5T 實證路徑
 */

export interface GRIDisclosure {
  code: string;
  title: string;
  description: string;
  category: 'General' | 'Economic' | 'Environmental' | 'Social';
  weight: number;
  evidence_required: string[];
  unit_mapping: string[];
}

export const griRegistry: GRIDisclosure[] = [
  {
    code: 'GRI 302-1',
    title: '組織內部的能源消耗量',
    description: '計算範疇一與範疇二的所有能源使用情況，包含電力、燃料與再生能源。',
    category: 'Environmental',
    weight: 0.9,
    evidence_required: ['台電帳單', '燃料採購單', '再生能源憑證 (T-REC)'],
    unit_mapping: ['kWh', 'GJ', 'm3']
  },
  {
    code: 'GRI 305-1',
    title: '直接 (範疇一) 溫室氣體排放',
    description: '來自組織擁有或控制的排放源的溫室氣體排放。',
    category: 'Environmental',
    weight: 1.0,
    evidence_required: ['ISO 14064-1 盤查清冊', '設備填充紀錄', '排放係數表'],
    unit_mapping: ['tCO2e']
  },
  {
    code: 'GRI 401-1',
    title: '新進員工僱用及員工離職',
    description: '按年齡組、性別及地區劃分的新進員工總數及比率。',
    category: 'Social',
    weight: 0.6,
    evidence_required: ['人資系統匯出報表', '員工名冊'],
    unit_mapping: ['\u4eba', '%']
  },
  {
    code: 'GRI 2-7',
    title: '員工資訊',
    description: '披露組織內所有受僱員工的總數及其分佈情形。',
    category: 'General',
    weight: 0.5,
    evidence_required: ['勞保投保明細', '組織架構圖'],
    unit_mapping: ['\u4eba']
  },
  {
    code: 'GRI 403-9',
    title: '工傷意外',
    description: '記錄職業傷害事故、頻率與嚴重率。',
    category: 'Social',
    weight: 0.8,
    evidence_required: ['職災申報單', '工安事件調查報告', 'ISO 45001 \u8b49\u66f8'],
    unit_mapping: ['\u6b21\u6578', 'FR', 'SR']
  }
];

export const getDisclosureByCode = (code: string) => griRegistry.find(d => d.code === code);