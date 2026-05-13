/**
 * ESG GO | 專家零算力模板數據庫
 * 整合 GRI 2026, SASB 2.0 與 TCFD 核心揭露要求
 */

export interface ESGTemplate {
  id: string;
  code: string;
  title: string;
  standard: 'GRI' | 'SASB' | 'TCFD';
  category: 'Environment' | 'Social' | 'Governance' | 'Economic';
  requirements: string[];
  suggestedEvidence: string[];
  benchmark: string;
}

export const expertTemplates: ESGTemplate[] = [
  {
    id: 'T-GRI-302-1',
    code: 'GRI 302-1',
    title: '組織內部的能源消耗量',
    standard: 'GRI',
    category: 'Environment',
    requirements: [
      '非再生燃料消耗總量',
      '再生燃料消耗總量',
      '消耗的電、熱、冷、蒸汽總量',
      '出售的電、熱、冷、蒸汽總量'
    ],
    suggestedEvidence: ['能源帳單 PDF', '綠電採購憑證', '鍋爐運行日誌'],
    benchmark: '產業平均：每單位產值 4.2 kWh'
  },
  {
    id: 'T-GRI-405-1',
    code: 'GRI 405-1',
    title: '治理單位與員工的多元化',
    standard: 'GRI',
    category: 'Social',
    requirements: [
      '按性別劃分的治理單位成員百分比',
      '按年齡組劃分的治理單位成員百分比',
      '按員工類別劃分的多元化指標'
    ],
    suggestedEvidence: ['董事會名冊', 'HR 系統多元化報表'],
    benchmark: '理想指標：女性治理成員比率 > 30%'
  },
  {
    id: 'T-GRI-205-3',
    code: 'GRI 205-3',
    title: '確定的貪腐事件與採取的行動',
    standard: 'GRI',
    category: 'Governance',
    requirements: [
      '確定的貪腐事件總數',
      '因貪腐而解僱或受到紀律處分的員工總數',
      '因貪腐而終止與合作夥伴關係的次數'
    ],
    suggestedEvidence: ['內部稽核報告', '法務合規紀錄'],
    benchmark: '目標：零容忍 / 0 事件'
  }
];