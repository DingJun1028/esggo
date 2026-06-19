/**
 * ESG數位平台申報系統
 * ======================
 * 模擬證交所/櫃買中心「公開資訊觀測站申報系統(SII)」
 * 包含97項ESG指標申報與永續報告書申報
 */

export interface ESGIndicator {
  id: string;
  category: 'governance' | 'environment' | 'social' | 'climate' | 'industry_specific';
  subcategory: string;
  name: string;
  description: string;
  unit?: string;
  isMandatory: boolean; // 是否為必要揭露
  applicableIndustries?: string[]; // 適用產業（若為產業別指標）
  dataType: 'number' | 'text' | 'percentage' | 'boolean' | 'date';
  requiresVerification?: boolean; // 是否需要第三方驗證
  relatedGRI?: string[]; // 對應的GRI準則
  calculationMethod?: string;
  exampleValue?: string;
}

/**
 * 97項ESG指標定義
 * 包含「2021年起申報之ESG指標」、「年報附表氣候相關議題管理指標」、「社會及治理面指標」共49項必要揭露指標
 * 及按產業別申報之必要或鼓勵揭露指標共48項
 */
export const ESG_97_INDICATORS: ESGIndicator[] = [
  // === 必要揭露指標（49項）===

  // 治理面指標
  {
    id: 'G001',
    category: 'governance',
    subcategory: '董事會組成',
    name: '董事會席次',
    description: '董事會總席次數',
    unit: '席',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 2-9'],
    exampleValue: '9',
  },
  {
    id: 'G002',
    category: 'governance',
    subcategory: '董事會組成',
    name: '獨立董事席次',
    description: '獨立董事席次數',
    unit: '席',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 2-9'],
    exampleValue: '3',
  },
  {
    id: 'G003',
    category: 'governance',
    subcategory: '董事會組成',
    name: '女性董事席次',
    description: '女性董事席次數',
    unit: '席',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 405-1'],
    exampleValue: '2',
  },
  {
    id: 'G004',
    category: 'governance',
    subcategory: '董事會多元化',
    name: '董事平均年齡',
    description: '全體董事平均年齡',
    unit: '歲',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 2-9'],
    exampleValue: '58.5',
  },
  {
    id: 'G005',
    category: 'governance',
    subcategory: '董事會運作',
    name: '董事會開會次數',
    description: '當年度董事會開會次數',
    unit: '次',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 2-9'],
    exampleValue: '12',
  },
  {
    id: 'G006',
    category: 'governance',
    subcategory: '董事會運作',
    name: '董事平均出席率',
    description: '董事會平均出席率',
    unit: '%',
    isMandatory: true,
    dataType: 'percentage',
    relatedGRI: ['GRI 2-9'],
    exampleValue: '95.5',
  },

  // 環境面指標
  {
    id: 'E001',
    category: 'environment',
    subcategory: '能源管理',
    name: '總能源消耗量',
    description: '公司總能源消耗量（含電力、燃料等）',
    unit: 'GJ',
    isMandatory: true,
    dataType: 'number',
    requiresVerification: true,
    relatedGRI: ['GRI 302-1'],
    calculationMethod: '依ISO 50001或GRI 302標準計算',
    exampleValue: '450000',
  },
  {
    id: 'E002',
    category: 'environment',
    subcategory: '能源管理',
    name: '能源密集度',
    description: '單位營收或產品的能源消耗',
    unit: 'GJ/百萬元營收',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 302-3'],
    exampleValue: '12.5',
  },
  {
    id: 'E003',
    category: 'environment',
    subcategory: '水資源管理',
    name: '總取水量',
    description: '公司總取水量',
    unit: '公噸',
    isMandatory: true,
    dataType: 'number',
    requiresVerification: true,
    relatedGRI: ['GRI 303-3'],
    exampleValue: '250000',
  },
  {
    id: 'E004',
    category: 'environment',
    subcategory: '水資源管理',
    name: '用水密集度',
    description: '單位營收或產品的用水量',
    unit: '公噸/百萬元營收',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 303-3'],
    exampleValue: '7.8',
  },
  {
    id: 'E005',
    category: 'environment',
    subcategory: '廢棄物管理',
    name: '總廢棄物產生量',
    description: '公司總廢棄物產生量',
    unit: '公噸',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 306-3'],
    exampleValue: '3500',
  },
  {
    id: 'E006',
    category: 'environment',
    subcategory: '廢棄物管理',
    name: '廢棄物回收率',
    description: '廢棄物回收利用比例',
    unit: '%',
    isMandatory: true,
    dataType: 'percentage',
    relatedGRI: ['GRI 306-4', 'GRI 306-5'],
    exampleValue: '78.5',
  },

  // 氣候相關指標
  {
    id: 'C001',
    category: 'climate',
    subcategory: '溫室氣體排放',
    name: 'Scope 1排放量',
    description: '直接溫室氣體排放（範疇一）',
    unit: 'tCO2e',
    isMandatory: true,
    dataType: 'number',
    requiresVerification: true,
    relatedGRI: ['GRI 305-1'],
    calculationMethod: '依GHG Protocol或ISO 14064-1計算',
    exampleValue: '12500',
  },
  {
    id: 'C002',
    category: 'climate',
    subcategory: '溫室氣體排放',
    name: 'Scope 2排放量（位置基礎）',
    description: '能源間接溫室氣體排放-位置基礎（範疇二）',
    unit: 'tCO2e',
    isMandatory: true,
    dataType: 'number',
    requiresVerification: true,
    relatedGRI: ['GRI 305-2'],
    exampleValue: '35000',
  },
  {
    id: 'C003',
    category: 'climate',
    subcategory: '溫室氣體排放',
    name: 'Scope 2排放量（市場基礎）',
    description: '能源間接溫室氣體排放-市場基礎（範疇二）',
    unit: 'tCO2e',
    isMandatory: false,
    dataType: 'number',
    relatedGRI: ['GRI 305-2'],
    exampleValue: '32000',
  },
  {
    id: 'C004',
    category: 'climate',
    subcategory: '溫室氣體排放',
    name: '碳排放密集度',
    description: '單位營收的溫室氣體排放',
    unit: 'tCO2e/百萬元營收',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 305-4'],
    exampleValue: '1.58',
  },
  {
    id: 'C005',
    category: 'climate',
    subcategory: '氣候治理',
    name: '董事會氣候監督',
    description: '董事會是否監督氣候相關風險與機會',
    isMandatory: true,
    dataType: 'boolean',
    relatedGRI: ['TCFD治理'],
    exampleValue: 'true',
  },
  {
    id: 'C006',
    category: 'climate',
    subcategory: '氣候策略',
    name: '是否設定減碳目標',
    description: '是否設定短中長期減碳目標',
    isMandatory: true,
    dataType: 'boolean',
    relatedGRI: ['GRI 305-5', 'TCFD策略'],
    exampleValue: 'true',
  },
  {
    id: 'C007',
    category: 'climate',
    subcategory: '氣候策略',
    name: '減碳目標年度',
    description: '減碳目標達成年度',
    isMandatory: false,
    dataType: 'number',
    relatedGRI: ['GRI 305-5'],
    exampleValue: '2030',
  },
  {
    id: 'C008',
    category: 'climate',
    subcategory: '氣候策略',
    name: '減碳目標幅度',
    description: '相較基準年的減碳目標幅度',
    unit: '%',
    isMandatory: false,
    dataType: 'percentage',
    relatedGRI: ['GRI 305-5'],
    exampleValue: '42',
  },

  // 社會面指標
  {
    id: 'S001',
    category: 'social',
    subcategory: '員工概況',
    name: '員工總數',
    description: '公司員工總人數',
    unit: '人',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 2-7'],
    exampleValue: '3500',
  },
  {
    id: 'S002',
    category: 'social',
    subcategory: '員工概況',
    name: '女性員工比例',
    description: '女性員工佔總員工比例',
    unit: '%',
    isMandatory: true,
    dataType: 'percentage',
    relatedGRI: ['GRI 405-1'],
    exampleValue: '45.5',
  },
  {
    id: 'S003',
    category: 'social',
    subcategory: '員工概況',
    name: '主管職女性比例',
    description: '主管職位女性佔比',
    unit: '%',
    isMandatory: true,
    dataType: 'percentage',
    relatedGRI: ['GRI 405-1'],
    exampleValue: '32.8',
  },
  {
    id: 'S004',
    category: 'social',
    subcategory: '員工薪酬',
    name: '非主管全時員工薪資平均數',
    description: '非擔任主管職務之全時員工薪資平均數',
    unit: '千元',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 2-21'],
    exampleValue: '850',
  },
  {
    id: 'S005',
    category: 'social',
    subcategory: '員工薪酬',
    name: '非主管全時員工薪資中位數',
    description: '非擔任主管職務之全時員工薪資中位數',
    unit: '千元',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 2-21'],
    exampleValue: '780',
  },
  {
    id: 'S006',
    category: 'social',
    subcategory: '員工薪酬',
    name: '薪資平均數成長率',
    description: '與前一年度薪資平均數比較之變動情形',
    unit: '%',
    isMandatory: true,
    dataType: 'percentage',
    relatedGRI: ['第4-2條'],
    exampleValue: '3.5',
  },
  {
    id: 'S007',
    category: 'social',
    subcategory: '員工薪酬',
    name: '薪資中位數成長率',
    description: '與前一年度薪資中位數比較之變動情形',
    unit: '%',
    isMandatory: true,
    dataType: 'percentage',
    relatedGRI: ['第4-2條'],
    exampleValue: '2.8',
  },
  {
    id: 'S008',
    category: 'social',
    subcategory: '員工薪酬',
    name: '年度總薪酬比率',
    description: '最高個人年度總薪酬與所有員工年度總薪酬中位數之比率',
    unit: '倍',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 2-21'],
    exampleValue: '35.6',
  },
  {
    id: 'S009',
    category: 'social',
    subcategory: '勞資關係',
    name: '是否有團體協約',
    description: '是否與員工簽訂團體協約',
    isMandatory: true,
    dataType: 'boolean',
    relatedGRI: ['GRI 2-30'],
    exampleValue: 'false',
  },
  {
    id: 'S010',
    category: 'social',
    subcategory: '勞資關係',
    name: '團體協約涵蓋率',
    description: '團體協約涵蓋之員工比例',
    unit: '%',
    isMandatory: false,
    dataType: 'percentage',
    relatedGRI: ['GRI 2-30'],
    exampleValue: '0',
  },
  {
    id: 'S011',
    category: 'social',
    subcategory: '職業安全',
    name: '職業災害人數',
    description: '當年度職業災害人數',
    unit: '人',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 403-9'],
    exampleValue: '2',
  },
  {
    id: 'S012',
    category: 'social',
    subcategory: '職業安全',
    name: '失能傷害頻率(FR)',
    description: '每百萬工時失能傷害次數',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 403-9'],
    calculationMethod: '(失能傷害次數 × 1,000,000) / 總經歷工時',
    exampleValue: '0.28',
  },
  {
    id: 'S013',
    category: 'social',
    subcategory: '職業安全',
    name: '失能傷害嚴重率(SR)',
    description: '每百萬工時損失日數',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 403-9'],
    calculationMethod: '(總損失日數 × 1,000,000) / 總經歷工時',
    exampleValue: '15.6',
  },
  {
    id: 'S014',
    category: 'social',
    subcategory: '員工培訓',
    name: '員工訓練總時數',
    description: '當年度員工訓練總時數',
    unit: '小時',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 404-1'],
    exampleValue: '28000',
  },
  {
    id: 'S015',
    category: 'social',
    subcategory: '員工培訓',
    name: '每名員工平均訓練時數',
    description: '平均每名員工接受訓練時數',
    unit: '小時/人',
    isMandatory: true,
    dataType: 'number',
    relatedGRI: ['GRI 404-1'],
    exampleValue: '8',
  },

  // === 產業別指標（48項，依產業適用）===

  // 食品業指標
  {
    id: 'IF001',
    category: 'industry_specific',
    subcategory: '食品安全',
    name: '食品安全管理系統認證',
    description: '是否取得ISO 22000、FSSC 22000或HACCP認證',
    isMandatory: false,
    applicableIndustries: ['食品工業', '餐飲業'],
    dataType: 'boolean',
    requiresVerification: true,
    relatedGRI: ['附表一之一'],
    exampleValue: 'true',
  },
  {
    id: 'IF002',
    category: 'industry_specific',
    subcategory: '食品安全',
    name: '產品召回次數',
    description: '當年度因食品安全問題召回產品次數',
    unit: '次',
    isMandatory: false,
    applicableIndustries: ['食品工業', '餐飲業'],
    dataType: 'number',
    requiresVerification: true,
    relatedGRI: ['附表一之一'],
    exampleValue: '0',
  },

  // 化學業指標
  {
    id: 'IC001',
    category: 'industry_specific',
    subcategory: '化學品管理',
    name: '化學品管理系統',
    description: '是否建立化學品管理系統',
    isMandatory: false,
    applicableIndustries: ['化學工業'],
    dataType: 'boolean',
    requiresVerification: true,
    relatedGRI: ['附表一之二'],
    exampleValue: 'true',
  },
  {
    id: 'IC002',
    category: 'industry_specific',
    subcategory: '製程安全',
    name: '製程安全事件數',
    description: '當年度製程安全事件（PSI）數量',
    unit: '件',
    isMandatory: false,
    applicableIndustries: ['化學工業'],
    dataType: 'number',
    requiresVerification: true,
    relatedGRI: ['附表一之二'],
    exampleValue: '1',
  },

  // 金融業指標
  {
    id: 'IFI001',
    category: 'industry_specific',
    subcategory: '責任投資',
    name: 'ESG投資金額',
    description: 'ESG相關投資金額',
    unit: '百萬元',
    isMandatory: false,
    applicableIndustries: ['金融保險業'],
    dataType: 'number',
    requiresVerification: true,
    relatedGRI: ['附表一之三'],
    exampleValue: '5000',
  },
  {
    id: 'IFI002',
    category: 'industry_specific',
    subcategory: '綠色金融',
    name: '綠色授信或投資占比',
    description: '綠色授信或投資占總授信/投資比例',
    unit: '%',
    isMandatory: false,
    applicableIndustries: ['金融保險業'],
    dataType: 'percentage',
    requiresVerification: true,
    relatedGRI: ['附表一之三'],
    exampleValue: '12.5',
  },

  // 半導體業指標
  {
    id: 'IS001',
    category: 'industry_specific',
    subcategory: '用水管理',
    name: '用水回收率',
    description: '製程用水回收再利用比例',
    unit: '%',
    isMandatory: false,
    applicableIndustries: ['半導體業'],
    dataType: 'percentage',
    requiresVerification: true,
    relatedGRI: ['附表一之八'],
    exampleValue: '85.5',
  },
  {
    id: 'IS002',
    category: 'industry_specific',
    subcategory: '化學品管理',
    name: '製程化學品使用量',
    description: '製程化學品總使用量',
    unit: '公噸',
    isMandatory: false,
    applicableIndustries: ['半導體業'],
    dataType: 'number',
    requiresVerification: true,
    relatedGRI: ['附表一之八'],
    exampleValue: '1500',
  },
];

/**
 * 申報狀態
 */
export interface FilingStatus {
  indicatorId: string;
  reportYear: number;
  value: string | number | boolean;
  unit?: string;
  filedDate?: Date;
  status: 'draft' | 'filed' | 'correction_requested' | 'corrected';
  correctionReason?: string;
  verificationStatus?: 'not_required' | 'pending' | 'verified';
  verificationDocument?: string;
  notes?: string;
}

/**
 * 常見缺失定義
 */
export interface CommonDeficiency {
  category: 'GRI' | 'climate' | 'industry_metrics';
  code: string;
  description: string;
  frequency: 'high' | 'medium' | 'low'; // 發生頻率
  relatedIndicators: string[];
  solution: string;
  reference?: string;
}

/**
 * 2023年度永續報告書常見缺失（依審閱報告）
 */
export const COMMON_DEFICIENCIES: CommonDeficiency[] = [
  {
    category: 'GRI',
    code: 'GRI-2-21',
    description: 'GRI 2-21年度總薪酬比率缺失佔比最高',
    frequency: 'high',
    relatedIndicators: ['S008'],
    solution:
      '揭露組織最高薪酬者的年度總薪酬與所有員工（不包括該最高薪酬者）年度總薪酬中位數之比率',
    reference: 'GRI 2-21: Annual total compensation ratio',
  },
  {
    category: 'GRI',
    code: 'GRI-2-30',
    description: 'GRI 2-30團體協約缺失比率超過10%',
    frequency: 'high',
    relatedIndicators: ['S009', 'S010'],
    solution: '揭露受團體協約保障之員工百分比。如無團體協約，應明確說明原因及替代措施',
    reference: 'GRI 2-30: Collective bargaining agreements',
  },
  {
    category: 'GRI',
    code: 'GRI-2-19',
    description: 'GRI 2-19薪酬政策缺失比率超過10%',
    frequency: 'high',
    relatedIndicators: ['S004', 'S005', 'S006', 'S007'],
    solution: '完整揭露薪酬政策，包括固定薪資與變動薪資、簽約獎金、招聘獎勵金等的關聯',
    reference: 'GRI 2-19: Remuneration policies',
  },
  {
    category: 'climate',
    code: 'TCFD-INCOMPLETE',
    description: '氣候及溫室氣體揭露資訊不完整',
    frequency: 'high',
    relatedIndicators: ['C001', 'C002', 'C005', 'C006', 'C007', 'C008'],
    solution:
      '依「上市公司編製與申報永續報告書作業辦法」附表二格式揭露：治理、策略、風險管理、指標與目標四大支柱',
    reference: '作業辦法第4-1條、附表二',
  },
  {
    category: 'climate',
    code: 'GHG-SCOPE-MISSING',
    description: '溫室氣體範疇盤查不完整或未經確信',
    frequency: 'medium',
    relatedIndicators: ['C001', 'C002'],
    solution: '依GHG Protocol或ISO 14064-1標準完成Scope 1/2盤查，並依時程取得第三方確信',
    reference: '作業辦法第4-1條第2-3項',
  },
  {
    category: 'industry_metrics',
    code: 'INDUSTRY-NO-ASSURANCE',
    description: '產業永續指標未依作業辦法附表規定揭露完整資訊並取得會計師確信意見',
    frequency: 'high',
    relatedIndicators: ['IF001', 'IF002', 'IC001', 'IC002', 'IFI001', 'IFI002', 'IS001', 'IS002'],
    solution: '依產業別完整揭露附表一規定之永續指標，並取得會計師確信意見',
    reference: '作業辦法第4條第2項',
  },
  {
    category: 'climate',
    code: 'REDUCTION-TARGET-MISSING',
    description: '未揭露減碳目標、策略及具體行動計畫',
    frequency: 'medium',
    relatedIndicators: ['C006', 'C007', 'C008'],
    solution: '依時程揭露短中長期減碳目標（建議通過SBTi認證）、減碳策略及具體行動計畫',
    reference: '作業辦法第4-1條第4項',
  },
  {
    category: 'GRI',
    code: 'GRI-INDEX-INCOMPLETE',
    description: 'GRI內容索引表不完整或未註明確信狀態',
    frequency: 'medium',
    relatedIndicators: [],
    solution: '完整揭露GRI內容索引表，並於報告書內註明各揭露項目是否取得第三方確信或保證',
    reference: '作業辦法第3條第3項',
  },
];

/**
 * 檢查申報資料的常見缺失
 */
export function checkCommonDeficiencies(
  filings: FilingStatus[],
  company: {
    industry: string;
    paidInCapital: number;
    reportYear: number;
  }
): {
  deficiency: CommonDeficiency;
  severity: 'critical' | 'high' | 'medium';
  affectedIndicators: string[];
  currentStatus: string;
  actionRequired: string;
}[] {
  const results: any[] = [];
  const minguo = company.reportYear - 1911;

  // 檢查 GRI 2-21 年度總薪酬比率
  const s008 = filings.find(f => f.indicatorId === 'S008');
  if (!s008 || !s008.value) {
    results.push({
      deficiency: COMMON_DEFICIENCIES.find(d => d.code === 'GRI-2-21')!,
      severity: 'high',
      affectedIndicators: ['S008'],
      currentStatus: '未揭露',
      actionRequired: '計算並揭露年度總薪酬比率',
    });
  }

  // 檢查 GRI 2-30 團體協約
  const s009 = filings.find(f => f.indicatorId === 'S009');
  const s010 = filings.find(f => f.indicatorId === 'S010');
  if (!s009 || s009.value === undefined) {
    results.push({
      deficiency: COMMON_DEFICIENCIES.find(d => d.code === 'GRI-2-30')!,
      severity: 'high',
      affectedIndicators: ['S009', 'S010'],
      currentStatus: '未揭露團體協約資訊',
      actionRequired: '說明是否有團體協約及涵蓋率',
    });
  }

  // 檢查溫室氣體揭露
  const c001 = filings.find(f => f.indicatorId === 'C001');
  const c002 = filings.find(f => f.indicatorId === 'C002');
  if (!c001 || !c002) {
    results.push({
      deficiency: COMMON_DEFICIENCIES.find(d => d.code === 'GHG-SCOPE-MISSING')!,
      severity: 'critical',
      affectedIndicators: ['C001', 'C002'],
      currentStatus: 'Scope 1/2未完整揭露',
      actionRequired: '完成溫室氣體盤查並依時程取得確信',
    });
  } else if (c001.verificationStatus !== 'verified' || c002.verificationStatus !== 'verified') {
    // 檢查是否需要確信
    const needsAssurance = checkGHGAssuranceRequirement(
      company.paidInCapital,
      company.industry,
      minguo
    );
    if (needsAssurance) {
      results.push({
        deficiency: COMMON_DEFICIENCIES.find(d => d.code === 'GHG-SCOPE-MISSING')!,
        severity: 'critical',
        affectedIndicators: ['C001', 'C002'],
        currentStatus: '已揭露但未確信',
        actionRequired: '取得第三方確信意見',
      });
    }
  }

  // 檢查減碳目標
  const needsReductionTarget = checkReductionTargetRequirement(
    company.paidInCapital,
    company.industry,
    minguo
  );
  if (needsReductionTarget) {
    const c006 = filings.find(f => f.indicatorId === 'C006');
    if (!c006 || !c006.value) {
      results.push({
        deficiency: COMMON_DEFICIENCIES.find(d => d.code === 'REDUCTION-TARGET-MISSING')!,
        severity: 'high',
        affectedIndicators: ['C006', 'C007', 'C008'],
        currentStatus: '未設定減碳目標',
        actionRequired: '依法規時程揭露減碳目標、策略及行動計畫',
      });
    }
  }

  // 檢查產業別指標
  const industryIndicators = ESG_97_INDICATORS.filter(
    ind =>
      ind.category === 'industry_specific' && ind.applicableIndustries?.includes(company.industry)
  );

  if (industryIndicators.length > 0) {
    const filedIndustryIndicators = filings.filter(f =>
      industryIndicators.some(ind => ind.id === f.indicatorId)
    );

    if (filedIndustryIndicators.length < industryIndicators.length) {
      results.push({
        deficiency: COMMON_DEFICIENCIES.find(d => d.code === 'INDUSTRY-NO-ASSURANCE')!,
        severity: 'critical',
        affectedIndicators: industryIndicators.map(ind => ind.id),
        currentStatus: `已揭露 ${filedIndustryIndicators.length}/${industryIndicators.length} 項`,
        actionRequired: '完整揭露產業永續指標並取得會計師確信',
      });
    } else {
      // 檢查是否都已確信
      const unverified = filedIndustryIndicators.filter(f => f.verificationStatus !== 'verified');
      if (unverified.length > 0) {
        results.push({
          deficiency: COMMON_DEFICIENCIES.find(d => d.code === 'INDUSTRY-NO-ASSURANCE')!,
          severity: 'critical',
          affectedIndicators: unverified.map(f => f.indicatorId),
          currentStatus: '已揭露但未確信',
          actionRequired: '取得會計師確信意見',
        });
      }
    }
  }

  return results;
}

/**
 * 檢查是否需要GHG確信
 */
function checkGHGAssuranceRequirement(capital: number, industry: string, minguo: number): boolean {
  if (capital >= 100 || ['鋼鐵工業', '水泥工業'].includes(industry)) {
    return minguo >= 113; // 2024年起
  } else if (capital >= 50) {
    return minguo >= 116; // 2027年起
  } else {
    return minguo >= 117; // 2028年起
  }
}

/**
 * 檢查是否需要揭露減碳目標
 */
function checkReductionTargetRequirement(
  capital: number,
  industry: string,
  minguo: number
): boolean {
  if (capital >= 100 || ['鋼鐵工業', '水泥工業'].includes(industry)) {
    return minguo >= 114; // 2025年起
  } else if (capital >= 50) {
    return minguo >= 115; // 2026年起
  } else {
    return minguo >= 116; // 2027年起
  }
}

/**
 * 生成批次匯入Excel模板
 */
export function generateExcelTemplate(company: { industry: string; paidInCapital: number }): {
  headers: string[];
  indicators: ESGIndicator[];
  instructions: string[];
} {
  // 過濾適用的指標
  const applicableIndicators = ESG_97_INDICATORS.filter(ind => {
    if (ind.isMandatory) return true;
    if (ind.applicableIndustries?.includes(company.industry)) return true;
    return false;
  });

  return {
    headers: ['指標編號', '指標名稱', '數值', '單位', '說明/備註', '是否已第三方驗證'],
    indicators: applicableIndicators,
    instructions: [
      '1. 請依序填寫各項指標數值',
      '2. 數值欄位請填入數字，勿包含單位',
      '3. 需第三方驗證的指標請於最後一欄註明驗證機構',
      '4. 完成後請於ESG數位平台選擇「批次匯入」功能',
      '5. 匯入後仍可透過編輯功能修改',
      '6. 填寫完成後務必點選「確認申報」',
    ],
  };
}
