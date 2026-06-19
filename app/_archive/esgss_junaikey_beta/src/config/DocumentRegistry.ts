/**
 * ESG 單據登記冊
 * ===============
 * 預定義所有必要的 ESG 數據單據
 */

import { DocumentDefinition } from '../types/DocumentChecklist';

/**
 * 環境類 (E) 單據
 */
export const ENVIRONMENT_DOCUMENTS: DocumentDefinition[] = [
  {
    id: 'ENV_001',
    name: '溫室氣體排放清冊',
    nameEn: 'GHG Emissions Inventory',
    category: 'Environment',
    subcategory: '氣候變遷',
    description: 'Scope 1, 2, 3 完整溫室氣體排放數據',
    requiredBy: ['GRI', 'TCFD', 'CDP', 'ESRS'],
    acceptedFormats: ['.xlsx', '.csv', '.pdf'],
    maxSizeMB: 50,
    required: true,
    urgency: 'critical',
    validationRules: [],
    notes: '需包含排放源、活動數據、排放係數、計算結果',
  },
  {
    id: 'ENV_002',
    name: '能源耗用明細表',
    nameEn: 'Energy Consumption Detail',
    category: 'Environment',
    subcategory: '能源管理',
    description: '各類能源（電力、天然氣、汽油等）月度耗用數據',
    requiredBy: ['GRI', 'SASB', 'CDP'],
    acceptedFormats: ['.xlsx', '.csv'],
    maxSizeMB: 20,
    required: true,
    urgency: 'high',
    validationRules: [],
    notes: '需按據點、部門、能源類型分類',
  },
  {
    id: 'ENV_003',
    name: '用水量統計表',
    nameEn: 'Water Consumption Statistics',
    category: 'Environment',
    subcategory: '水資源',
    description: '取水量、耗水量、回收水量統計',
    requiredBy: ['GRI', 'CDP'],
    acceptedFormats: ['.xlsx', '.csv'],
    maxSizeMB: 10,
    required: true,
    urgency: 'high',
    validationRules: [],
  },
  {
    id: 'ENV_004',
    name: '廢棄物產生與處理記錄',
    nameEn: 'Waste Generation & Treatment Record',
    category: 'Environment',
    subcategory: '循環經濟',
    description: '一般廢棄物、有害廢棄物產生量、處理方式、去向',
    requiredBy: ['GRI', 'SASB'],
    acceptedFormats: ['.xlsx', '.csv', '.pdf'],
    maxSizeMB: 20,
    required: true,
    urgency: 'medium',
    validationRules: [],
  },
  {
    id: 'ENV_005',
    name: '再生能源使用證明',
    nameEn: 'Renewable Energy Certificate',
    category: 'Environment',
    subcategory: '能源管理',
    description: '綠電購買合約、憑證、自發自用證明',
    requiredBy: ['GRI', 'CDP'],
    acceptedFormats: ['.pdf', '.jpg', '.png'],
    maxSizeMB: 30,
    required: false,
    urgency: 'medium',
    validationRules: [],
  },
];

/**
 * 社會類 (S) 單據
 */
export const SOCIAL_DOCUMENTS: DocumentDefinition[] = [
  {
    id: 'SOC_001',
    name: '員工人數統計表',
    nameEn: 'Employee Headcount Statistics',
    category: 'Social',
    subcategory: '員工概況',
    description: '按性別、年齡、職級、部門、地區分類的員工數',
    requiredBy: ['GRI', 'SASB', 'ESRS'],
    acceptedFormats: ['.xlsx', '.csv'],
    maxSizeMB: 10,
    required: true,
    urgency: 'critical',
    validationRules: [],
  },
  {
    id: 'SOC_002',
    name: '員工培訓記錄',
    nameEn: 'Employee Training Record',
    category: 'Social',
    subcategory: '人才發展',
    description: '培訓課程、時數、參與人數、滿意度',
    requiredBy: ['GRI', 'SASB'],
    acceptedFormats: ['.xlsx', '.csv'],
    maxSizeMB: 20,
    required: true,
    urgency: 'high',
    validationRules: [],
  },
  {
    id: 'SOC_003',
    name: '職業安全衛生統計',
    nameEn: 'Occupational Health & Safety Statistics',
    category: 'Social',
    subcategory: '職業安全',
    description: '工傷率、損失工時率、職業病統計',
    requiredBy: ['GRI', 'SASB'],
    acceptedFormats: ['.xlsx', '.csv', '.pdf'],
    maxSizeMB: 15,
    required: true,
    urgency: 'critical',
    validationRules: [],
    notes: '需符合當地法規報告格式',
  },
  {
    id: 'SOC_004',
    name: '多元平等指標',
    nameEn: 'Diversity & Inclusion Metrics',
    category: 'Social',
    subcategory: 'DEI',
    description: '女性主管比例、薪酬平等、少數族群僱用',
    requiredBy: ['GRI', 'SASB', 'ESRS'],
    acceptedFormats: ['.xlsx', '.csv'],
    maxSizeMB: 10,
    required: true,
    urgency: 'high',
    validationRules: [],
  },
  {
    id: 'SOC_005',
    name: '社區投資記錄',
    nameEn: 'Community Investment Record',
    category: 'Social',
    subcategory: '社區參與',
    description: '公益捐款、志工時數、社區專案',
    requiredBy: ['GRI'],
    acceptedFormats: ['.xlsx', '.csv', '.pdf'],
    maxSizeMB: 20,
    required: false,
    urgency: 'medium',
    validationRules: [],
  },
];

/**
 * 治理類 (G) 單據
 */
export const GOVERNANCE_DOCUMENTS: DocumentDefinition[] = [
  {
    id: 'GOV_001',
    name: '董事會組成與運作',
    nameEn: 'Board Composition & Operation',
    category: 'Governance',
    subcategory: '公司治理',
    description: '董事名單、獨立董事比例、會議次數、出席率',
    requiredBy: ['GRI', 'SASB', 'ESRS'],
    acceptedFormats: ['.xlsx', '.pdf'],
    maxSizeMB: 10,
    required: true,
    urgency: 'critical',
    validationRules: [],
  },
  {
    id: 'GOV_002',
    name: '供應商ESG評估結果',
    nameEn: 'Supplier ESG Assessment',
    category: 'Governance',
    subcategory: '供應鏈管理',
    description: '供應商ESG評分、稽核報告、改善計畫',
    requiredBy: ['GRI', 'ESRS'],
    acceptedFormats: ['.xlsx', '.csv', '.pdf'],
    maxSizeMB: 50,
    required: true,
    urgency: 'high',
    validationRules: [],
  },
  {
    id: 'GOV_003',
    name: '法規遵循聲明',
    nameEn: 'Compliance Declaration',
    category: 'Governance',
    subcategory: '合規管理',
    description: '重大違規事件、罰款、訴訟案件',
    requiredBy: ['GRI', 'SASB'],
    acceptedFormats: ['.pdf'],
    maxSizeMB: 10,
    required: true,
    urgency: 'critical',
    validationRules: [],
    notes: '需法務部門簽核',
  },
  {
    id: 'GOV_004',
    name: '風險評估報告',
    nameEn: 'Risk Assessment Report',
    category: 'Governance',
    subcategory: '風險管理',
    description: 'ESG風險識別、評級、緩解措施',
    requiredBy: ['TCFD', 'ESRS'],
    acceptedFormats: ['.pdf', '.docx'],
    maxSizeMB: 30,
    required: true,
    urgency: 'high',
    validationRules: [],
  },
  {
    id: 'GOV_005',
    name: '利害關係人溝通記錄',
    nameEn: 'Stakeholder Engagement Record',
    category: 'Governance',
    subcategory: '利害關係人',
    description: '問卷調查、訪談記錄、會議紀錄',
    requiredBy: ['GRI', 'ESRS'],
    acceptedFormats: ['.xlsx', '.pdf', '.docx'],
    maxSizeMB: 40,
    required: true,
    urgency: 'medium',
    validationRules: [],
  },
];

/**
 * 所有單據清單
 */
export const ALL_DOCUMENTS: DocumentDefinition[] = [
  ...ENVIRONMENT_DOCUMENTS,
  ...SOCIAL_DOCUMENTS,
  ...GOVERNANCE_DOCUMENTS,
];

/**
 * 按框架篩選單據
 */
export function getDocumentsByFramework(framework: string): DocumentDefinition[] {
  return ALL_DOCUMENTS.filter(doc => doc.requiredBy.includes(framework as any));
}

/**
 * 按類別篩選單據
 */
export function getDocumentsByCategory(category: string): DocumentDefinition[] {
  return ALL_DOCUMENTS.filter(doc => doc.category === category);
}

/**
 * 獲取必要單據
 */
export function getRequiredDocuments(): DocumentDefinition[] {
  return ALL_DOCUMENTS.filter(doc => doc.required);
}

/**
 * 獲取關鍵單據（緊急程度：critical）
 */
export function getCriticalDocuments(): DocumentDefinition[] {
  return ALL_DOCUMENTS.filter(doc => doc.urgency === 'critical');
}
