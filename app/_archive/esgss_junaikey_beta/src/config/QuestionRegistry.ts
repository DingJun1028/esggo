/**
 * 永續報告書必備問題總清單
 * ============================
 * 定義所有框架要求的關鍵問題
 */

export interface ESGQuestion {
  id: string;
  question: string;
  questionEn: string;
  category: 'Environment' | 'Social' | 'Governance';
  subcategory: string;
  framework: string[];
  required: boolean;
  responseType: 'text' | 'number' | 'boolean' | 'date' | 'table' | 'attachment';
  guidance: string;
  exampleAnswer?: string;
  relatedDocuments?: string[]; // 關聯的單據ID
}

/**
 * 環境類問題 (E)
 */
export const ENVIRONMENT_QUESTIONS: ESGQuestion[] = [
  {
    id: 'Q_ENV_001',
    question: '貴公司過去三年的溫室氣體排放總量（Scope 1, 2, 3）為何？',
    questionEn: 'What are your total GHG emissions (Scope 1, 2, 3) for the past three years?',
    category: 'Environment',
    subcategory: '氣候變遷',
    framework: ['GRI', 'TCFD', 'CDP', 'ESRS'],
    required: true,
    responseType: 'table',
    guidance: '請提供完整的溫室氣體盤查結果，包含各範疇排放量、計算方法、排放源分析',
    exampleAnswer: '2022年：Scope 1 (5,000tCO2e), Scope 2 (12,000tCO2e), Scope 3 (35,000tCO2e)',
    relatedDocuments: ['ENV_001'],
  },
  {
    id: 'Q_ENV_002',
    question: '貴公司是否設定碳中和或淨零排放目標？目標年份與減量路徑為何？',
    questionEn:
      'Have you set carbon neutrality or net-zero targets? What are the target years and reduction pathways?',
    category: 'Environment',
    subcategory: '氣候變遷',
    framework: ['GRI', 'TCFD', 'CDP', 'ESRS'],
    required: true,
    responseType: 'text',
    guidance: '說明短、中、長期減碳目標，以及達成策略（如能源轉型、製程改善、碳抵換等）',
    exampleAnswer: '承諾2030年減碳50%（基準年2020），2050年達成淨零排放',
    relatedDocuments: ['ENV_001'],
  },
  {
    id: 'Q_ENV_003',
    question: '貴公司的再生能源使用比例為何？未來三年的目標？',
    questionEn:
      'What is your renewable energy usage percentage? What are your targets for the next 3 years?',
    category: 'Environment',
    subcategory: '能源管理',
    framework: ['GRI', 'CDP', 'SASB'],
    required: true,
    responseType: 'number',
    guidance: '說明再生能源來源（自建、購買綠電憑證、PPA等）及未來規劃',
    exampleAnswer: '2024年再生能源占比35%，目標2027年達60%',
    relatedDocuments: ['ENV_002', 'ENV_005'],
  },
  {
    id: 'Q_ENV_004',
    question: '貴公司如何評估氣候變遷相關的實體風險與轉型風險？',
    questionEn: 'How do you assess climate-related physical and transition risks?',
    category: 'Environment',
    subcategory: '氣候風險',
    framework: ['TCFD', 'ESRS'],
    required: true,
    responseType: 'text',
    guidance: '說明風險識別方法、情境分析（如2°C/1.5°C情境）、財務影響評估',
    exampleAnswer: '採用TCFD框架進行情境分析，評估極端氣候對供應鏈的影響',
    relatedDocuments: ['GOV_004'],
  },
  {
    id: 'Q_ENV_005',
    question: '貴公司的水資源管理策略為何？用水效率改善目標？',
    questionEn: 'What is your water management strategy? Water efficiency improvement targets?',
    category: 'Environment',
    subcategory: '水資源',
    framework: ['GRI', 'CDP'],
    required: true,
    responseType: 'text',
    guidance: '說明水源使用、回收率、節水措施、水風險評估',
    exampleAnswer: '2024年水回收率82%，目標2026年達90%',
    relatedDocuments: ['ENV_003'],
  },
  {
    id: 'Q_ENV_006',
    question: '貴公司的循環經濟策略為何？廢棄物回收率？',
    questionEn: 'What is your circular economy strategy? Waste recycling rate?',
    category: 'Environment',
    subcategory: '循環經濟',
    framework: ['GRI', 'SASB', 'ESRS'],
    required: true,
    responseType: 'text',
    guidance: '說明廢棄物減量、資源回收、產品生命週期管理',
    exampleAnswer: '2024年廢棄物回收率88%，推動產品可回收設計',
    relatedDocuments: ['ENV_004'],
  },
];

/**
 * 社會類問題 (S)
 */
export const SOCIAL_QUESTIONS: ESGQuestion[] = [
  {
    id: 'Q_SOC_001',
    question: '貴公司的員工組成結構為何？（按性別、年齡、職級、地區分類）',
    questionEn: 'What is your employee composition? (by gender, age, level, region)',
    category: 'Social',
    subcategory: '員工概況',
    framework: ['GRI', 'SASB', 'ESRS'],
    required: true,
    responseType: 'table',
    guidance: '提供完整的員工統計數據，包含全職/兼職、正職/約聘等',
    relatedDocuments: ['SOC_001'],
  },
  {
    id: 'Q_SOC_002',
    question: '貴公司如何確保職場多元、平等與包容（DEI）？女性主管比例？',
    questionEn:
      'How do you ensure workplace diversity, equity, and inclusion? Female leadership percentage?',
    category: 'Social',
    subcategory: 'DEI',
    framework: ['GRI', 'SASB', 'ESRS'],
    required: true,
    responseType: 'text',
    guidance: '說明DEI政策、女性/少數族群晉升機會、薪酬平等措施',
    exampleAnswer: '2024年女性主管比例38%，薪酬性別差距<5%',
    relatedDocuments: ['SOC_004'],
  },
  {
    id: 'Q_SOC_003',
    question: '貴公司的職業安全衛生績效為何？工傷率、損失工時率？',
    questionEn: 'What are your occupational health & safety metrics? Injury rate, lost time rate?',
    category: 'Social',
    subcategory: '職業安全',
    framework: ['GRI', 'SASB'],
    required: true,
    responseType: 'table',
    guidance: '提供完整的職安統計，包含事故類型、嚴重度、改善措施',
    exampleAnswer: '2024年工傷率0.12，比去年降低25%',
    relatedDocuments: ['SOC_003'],
  },
  {
    id: 'Q_SOC_004',
    question: '貴公司的員工培訓與發展計畫為何？人均培訓時數？',
    questionEn: 'What are your employee training & development programs? Average training hours?',
    category: 'Social',
    subcategory: '人才發展',
    framework: ['GRI', 'SASB'],
    required: true,
    responseType: 'text',
    guidance: '說明培訓類型、參與率、滿意度、職涯發展路徑',
    exampleAnswer: '2024年人均培訓42小時，含ESG、技術、管理課程',
    relatedDocuments: ['SOC_002'],
  },
  {
    id: 'Q_SOC_005',
    question: '貴公司如何參與社區投資與社會公益？投入金額與志工時數？',
    questionEn: 'How do you engage in community investment? Investment amount and volunteer hours?',
    category: 'Social',
    subcategory: '社區參與',
    framework: ['GRI'],
    required: false,
    responseType: 'text',
    guidance: '說明社區專案、公益捐款、員工志工活動',
    exampleAnswer: '2024年社區投資NT$120M，員工志工5,000小時',
    relatedDocuments: ['SOC_005'],
  },
  {
    id: 'Q_SOC_006',
    question: '貴公司如何保護客戶隱私與數據安全？',
    questionEn: 'How do you protect customer privacy and data security?',
    category: 'Social',
    subcategory: '客戶權益',
    framework: ['GRI', 'SASB'],
    required: true,
    responseType: 'text',
    guidance: '說明數據保護政策、資安措施、隱私權聲明',
    exampleAnswer: '符合GDPR/PDPA，取得ISO 27001認證',
    relatedDocuments: ['GOV_003'],
  },
];

/**
 * 治理類問題 (G)
 */
export const GOVERNANCE_QUESTIONS: ESGQuestion[] = [
  {
    id: 'Q_GOV_001',
    question: '貴公司的董事會組成為何？獨立董事比例？ESG委員會設置？',
    questionEn: 'What is your board composition? Independent director percentage? ESG committee?',
    category: 'Governance',
    subcategory: '公司治理',
    framework: ['GRI', 'SASB', 'ESRS'],
    required: true,
    responseType: 'table',
    guidance: '說明董事會成員背景、多元性、運作機制、ESG監督職能',
    exampleAnswer: '董事會9席，獨立董事6席（67%），設ESG委員會',
    relatedDocuments: ['GOV_001'],
  },
  {
    id: 'Q_GOV_002',
    question: '貴公司的利害關係人議合機制為何？如何識別重大性議題？',
    questionEn: 'What is your stakeholder engagement process? How do you identify material issues?',
    category: 'Governance',
    subcategory: '利害關係人',
    framework: ['GRI', 'ESRS'],
    required: true,
    responseType: 'text',
    guidance: '說明利害關係人識別、溝通管道、重大性矩陣分析',
    exampleAnswer: '透過問卷、訪談、會議進行議合，識別12項重大議題',
    relatedDocuments: ['GOV_005'],
  },
  {
    id: 'Q_GOV_003',
    question: '貴公司過去三年是否有重大違規、罰款或訴訟案件？',
    questionEn: 'Any significant violations, fines, or lawsuits in the past 3 years?',
    category: 'Governance',
    subcategory: '合規管理',
    framework: ['GRI', 'SASB'],
    required: true,
    responseType: 'text',
    guidance: '說明違規事件、金額、改善措施。若無則明確聲明',
    exampleAnswer: '2022-2024年無重大違規事件',
    relatedDocuments: ['GOV_003'],
  },
  {
    id: 'Q_GOV_004',
    question: '貴公司的供應鏈ESG管理策略為何？供應商評估覆蓋率？',
    questionEn: 'What is your supply chain ESG management strategy? Supplier assessment coverage?',
    category: 'Governance',
    subcategory: '供應鏈管理',
    framework: ['GRI', 'ESRS'],
    required: true,
    responseType: 'text',
    guidance: '說明供應商行為準則、ESG評鑑、稽核機制、改善計畫',
    exampleAnswer: '2024年關鍵供應商ESG評估覆蓋率80%',
    relatedDocuments: ['GOV_002'],
  },
  {
    id: 'Q_GOV_005',
    question: '貴公司的風險管理架構為何？如何整合ESG風險？',
    questionEn: 'What is your risk management framework? How do you integrate ESG risks?',
    category: 'Governance',
    subcategory: '風險管理',
    framework: ['GRI', 'TCFD', 'ESRS'],
    required: true,
    responseType: 'text',
    guidance: '說明風險識別、評估、監控、緩解機制',
    exampleAnswer: '建立企業風險管理（ERM）系統，整合ESG風險評估',
    relatedDocuments: ['GOV_004'],
  },
  {
    id: 'Q_GOV_006',
    question: '貴公司的商業道德與反貪腐政策為何？',
    questionEn: 'What are your business ethics and anti-corruption policies?',
    category: 'Governance',
    subcategory: '誠信經營',
    framework: ['GRI', 'SASB'],
    required: true,
    responseType: 'text',
    guidance: '說明行為準則、舉報機制、反貪腐訓練、案件處理',
    exampleAnswer: '訂有誠信經營守則，設置檢舉專線，定期訓練',
    relatedDocuments: ['GOV_003'],
  },
];

/**
 * 所有問題清單
 */
export const ALL_QUESTIONS: ESGQuestion[] = [
  ...ENVIRONMENT_QUESTIONS,
  ...SOCIAL_QUESTIONS,
  ...GOVERNANCE_QUESTIONS,
];

/**
 * 按框架篩選問題
 */
export function getQuestionsByFramework(framework: string): ESGQuestion[] {
  return ALL_QUESTIONS.filter(q => q.framework.includes(framework));
}

/**
 * 按類別篩選問題
 */
export function getQuestionsByCategory(category: string): ESGQuestion[] {
  return ALL_QUESTIONS.filter(q => q.category === category);
}

/**
 * 獲取必答問題
 */
export function getRequiredQuestions(): ESGQuestion[] {
  return ALL_QUESTIONS.filter(q => q.required);
}

/**
 * 問題統計
 */
export function getQuestionStats() {
  return {
    total: ALL_QUESTIONS.length,
    required: ALL_QUESTIONS.filter(q => q.required).length,
    byCategory: {
      Environment: ENVIRONMENT_QUESTIONS.length,
      Social: SOCIAL_QUESTIONS.length,
      Governance: GOVERNANCE_QUESTIONS.length,
    },
    byFramework: {
      GRI: getQuestionsByFramework('GRI').length,
      SASB: getQuestionsByFramework('SASB').length,
      TCFD: getQuestionsByFramework('TCFD').length,
      CDP: getQuestionsByFramework('CDP').length,
      ESRS: getQuestionsByFramework('ESRS').length,
    },
  };
}
