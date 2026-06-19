import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

/**
 * ESG 教學知識庫
 * ESG Educational Knowledge Base
 *
 * 包含 ESG 名詞定義和真實案例，用於遊戲化學習
 */

// ============================================================================
// ESG 名詞定義
// ============================================================================

export interface ESGTerm {
  id: string;
  term: string; // 名詞
  category: ESGCategory;
  definition: string; // 定義
  explanation: string; // 詳細說明
  examples: string[]; // 範例
  relatedTerms: string[]; // 相關名詞
  difficulty: 1 | 2 | 3 | 4 | 5; // 難度等級
}

export enum ESGCategory {
  ENVIRONMENTAL = 'environmental', // 環境
  SOCIAL = 'social', // 社會
  GOVERNANCE = 'governance', // 治理
  FRAMEWORK = 'framework', // 框架標準
  METRICS = 'metrics', // 指標度量
}

// ============================================================================
// 真實案例
// ============================================================================

export interface ESGCase {
  id: string;
  title: string;
  company: string;
  category: ESGCategory;
  year: number;
  summary: string; // 摘要
  challenge: string; // 挑戰
  solution: string; // 解決方案
  result: string; // 成果
  lessons: string[]; // 學習要點
  relatedTerms: string[]; // 相關名詞
  difficulty: 1 | 2 | 3 | 4 | 5;
}

// ============================================================================
// 環境 (E) 名詞
// ============================================================================

export const ENVIRONMENTAL_TERMS: ESGTerm[] = [
  {
    id: 'term_carbon_footprint',
    term: '碳足跡 (Carbon Footprint)',
    category: ESGCategory.ENVIRONMENTAL,
    definition: '個人、組織、產品或活動所產生的溫室氣體排放總量',
    explanation:
      '碳足跡通常以二氧化碳當量（CO2e）來衡量，包含直接和間接排放。計算碳足跡有助於了解對氣候變遷的影響，並制定減排策略。',
    examples: [
      '一家製造公司的年度碳足跡為 10,000 噸 CO2e',
      '一趟台北到東京的飛行碳足跡約 0.5 噸 CO2e',
    ],
    relatedTerms: ['scope_1', 'scope_2', 'scope_3', 'carbon_neutral'],
    difficulty: 2,
  },
  {
    id: 'term_scope_1',
    term: 'Scope 1 排放',
    category: ESGCategory.ENVIRONMENTAL,
    definition: '企業直接擁有或控制的排放源所產生的溫室氣體排放',
    explanation: '包括公司車輛、鍋爐、製程等直接排放。這是企業最容易控制和減少的排放類型。',
    examples: ['公司自有車隊的燃油排放', '工廠鍋爐燃燒天然氣的排放', '製程中的化學反應排放'],
    relatedTerms: ['carbon_footprint', 'scope_2', 'scope_3'],
    difficulty: 3,
  },
  {
    id: 'term_scope_2',
    term: 'Scope 2 排放',
    category: ESGCategory.ENVIRONMENTAL,
    definition: '企業購買的電力、蒸汽、熱能或冷卻所產生的間接排放',
    explanation:
      '雖然排放發生在發電廠，但因企業使用而計入其碳足跡。可透過購買綠電或提升能源效率來減少。',
    examples: ['辦公室用電產生的間接排放', '工廠購買的蒸汽排放'],
    relatedTerms: ['carbon_footprint', 'scope_1', 'renewable_energy'],
    difficulty: 3,
  },
  {
    id: 'term_scope_3',
    term: 'Scope 3 排放',
    category: ESGCategory.ENVIRONMENTAL,
    definition: '價值鏈中其他間接排放，包括上游和下游活動',
    explanation: '涵蓋供應商、運輸、員工通勤、產品使用等。通常是企業最大的排放來源，但也最難控制。',
    examples: ['供應商生產原料的排放', '產品運輸的排放', '員工通勤的排放', '產品使用階段的排放'],
    relatedTerms: ['carbon_footprint', 'value_chain', 'supply_chain'],
    difficulty: 4,
  },
  {
    id: 'term_carbon_neutral',
    term: '碳中和 (Carbon Neutral)',
    category: ESGCategory.ENVIRONMENTAL,
    definition: '透過減排和碳抵消，使淨碳排放為零',
    explanation: '企業先盡可能減少排放，剩餘無法避免的排放則透過購買碳權或投資碳匯專案來抵消。',
    examples: ['Microsoft 承諾 2030 年達成碳負排放', 'Apple 宣布 2030 年全產品碳中和'],
    relatedTerms: ['carbon_footprint', 'carbon_offset', 'net_zero'],
    difficulty: 2,
  },
  {
    id: 'term_renewable_energy',
    term: '再生能源 (Renewable Energy)',
    category: ESGCategory.ENVIRONMENTAL,
    definition: '來自自然界可持續補充的能源，如太陽能、風能、水力等',
    explanation:
      '再生能源不會耗盡且碳排放極低，是實現碳中和的關鍵。企業可透過自建或購買綠電來增加再生能源使用比例。',
    examples: ['太陽能光電板', '離岸風力發電', '水力發電'],
    relatedTerms: ['scope_2', 'carbon_neutral', 'green_energy'],
    difficulty: 1,
  },
];

// ============================================================================
// 社會 (S) 名詞
// ============================================================================

export const SOCIAL_TERMS: ESGTerm[] = [
  {
    id: 'term_dei',
    term: 'DEI (多元、公平、包容)',
    category: ESGCategory.SOCIAL,
    definition: 'Diversity, Equity, and Inclusion - 促進工作場所的多元性、公平性和包容性',
    explanation:
      '多元性指不同背景的人才；公平性指提供平等機會；包容性指創造讓所有人都能貢獻的環境。',
    examples: ['性別平等政策', '身心障礙者友善環境', '多元文化包容'],
    relatedTerms: ['human_rights', 'equal_opportunity'],
    difficulty: 2,
  },
  {
    id: 'term_living_wage',
    term: '生活工資 (Living Wage)',
    category: ESGCategory.SOCIAL,
    definition: '足以維持基本生活水準的工資，高於法定最低工資',
    explanation: '生活工資考慮當地生活成本，確保員工能負擔住房、食物、教育等基本需求。',
    examples: ['Unilever 承諾支付生活工資', 'Patagonia 確保供應鏈工人獲得生活工資'],
    relatedTerms: ['human_rights', 'supply_chain'],
    difficulty: 2,
  },
];

// ============================================================================
// 治理 (G) 名詞
// ============================================================================

export const GOVERNANCE_TERMS: ESGTerm[] = [
  {
    id: 'term_board_diversity',
    term: '董事會多元性 (Board Diversity)',
    category: ESGCategory.GOVERNANCE,
    definition: '董事會成員在性別、種族、專業背景等方面的多樣性',
    explanation: '多元化的董事會能帶來不同視角，提升決策品質和公司治理水準。',
    examples: ['女性董事比例', '獨立董事席次', '不同產業背景的董事'],
    relatedTerms: ['corporate_governance', 'dei'],
    difficulty: 2,
  },
];

// ============================================================================
// 框架標準名詞
// ============================================================================

export const FRAMEWORK_TERMS: ESGTerm[] = [
  {
    id: 'term_gri',
    term: 'GRI 標準 (Global Reporting Initiative)',
    category: ESGCategory.FRAMEWORK,
    definition: '全球最廣泛使用的永續報告框架',
    explanation:
      'GRI 提供標準化的報告指標，幫助企業揭露經濟、環境和社會影響。分為通用標準和主題標準。',
    examples: ['GRI 302: 能源', 'GRI 305: 排放', 'GRI 401: 勞雇關係'],
    relatedTerms: ['tcfd', 'sasb', 'esg_reporting'],
    difficulty: 3,
  },
  {
    id: 'term_tcfd',
    term: 'TCFD (氣候相關財務揭露)',
    category: ESGCategory.FRAMEWORK,
    definition: 'Task Force on Climate-related Financial Disclosures - 氣候相關財務資訊揭露框架',
    explanation:
      'TCFD 要求企業揭露氣候變遷對財務的影響，包括治理、策略、風險管理和指標目標四大支柱。',
    examples: ['氣候風險評估', '情境分析', '碳定價影響'],
    relatedTerms: ['gri', 'climate_risk', 'scenario_analysis'],
    difficulty: 4,
  },
];

// ============================================================================
// 真實案例
// ============================================================================

export const ESG_CASES: ESGCase[] = [
  {
    id: 'case_patagonia_repair',
    title: 'Patagonia 的產品維修計劃',
    company: 'Patagonia',
    category: ESGCategory.ENVIRONMENTAL,
    year: 2005,
    summary: 'Patagonia 推出 Worn Wear 計劃，鼓勵顧客維修而非丟棄衣物',
    challenge: '快時尚導致大量紡織品廢棄，造成環境負擔',
    solution: '提供免費維修服務、販售二手商品、教導顧客自行修補',
    result: '每年維修超過 50,000 件衣物，延長產品壽命，減少 70% 碳排放',
    lessons: ['循環經濟可以成為商業模式', '品牌價值與永續理念結合', '消費者教育的重要性'],
    relatedTerms: ['circular_economy', 'carbon_footprint', 'waste_reduction'],
    difficulty: 2,
  },
  {
    id: 'case_microsoft_carbon_negative',
    title: 'Microsoft 碳負排放承諾',
    company: 'Microsoft',
    category: ESGCategory.ENVIRONMENTAL,
    year: 2020,
    summary: 'Microsoft 承諾 2030 年達成碳負排放，2050 年移除歷史排放',
    challenge: '科技產業能源消耗巨大，數據中心碳排放持續增長',
    solution: '投資再生能源、碳捕捉技術、設立 10 億美元氣候創新基金',
    result: '2021 年減少 6% 排放，購買 140 萬噸碳移除額度',
    lessons: ['設定雄心勃勃但可實現的目標', '投資創新技術', '透明度和問責制'],
    relatedTerms: ['carbon_negative', 'carbon_offset', 'renewable_energy'],
    difficulty: 3,
  },
  {
    id: 'case_unilever_living_wage',
    title: 'Unilever 生活工資計劃',
    company: 'Unilever',
    category: ESGCategory.SOCIAL,
    year: 2018,
    summary: 'Unilever 承諾確保全球員工和供應鏈工人獲得生活工資',
    challenge: '供應鏈中許多工人薪資低於生活水準',
    solution: '與供應商合作、提供培訓、建立監督機制',
    result: '超過 70,000 名直接員工獲得生活工資，影響數十萬供應鏈工人',
    lessons: ['供應鏈責任的重要性', '與利害關係人合作', '長期承諾與持續改進'],
    relatedTerms: ['living_wage', 'supply_chain', 'human_rights'],
    difficulty: 2,
  },
];

// ============================================================================
// 匯總
// ============================================================================

export const ALL_ESG_TERMS: ESGTerm[] = [
  ...ENVIRONMENTAL_TERMS,
  ...SOCIAL_TERMS,
  ...GOVERNANCE_TERMS,
  ...FRAMEWORK_TERMS,
];

export const ESG_KNOWLEDGE_COUNT = {
  environmental: ENVIRONMENTAL_TERMS.length,
  social: SOCIAL_TERMS.length,
  governance: GOVERNANCE_TERMS.length,
  framework: FRAMEWORK_TERMS.length,
  totalTerms: ALL_ESG_TERMS.length,
  totalCases: ESG_CASES.length,
};

omniLogger.info(LogCategory.SYSTEM, '[esgKnowledge] Info', { data: `[ESG Knowledge] 📚 載入 ${ESG_KNOWLEDGE_COUNT.totalTerms} 個 ESG 名詞` });
omniLogger.info(LogCategory.SYSTEM, '[esgKnowledge] Info', { data: `[ESG Knowledge] 📖 載入 ${ESG_KNOWLEDGE_COUNT.totalCases} 個真實案例` });
