import {
  DimensionID,
  Course,
  UserTitle,
  Badge,
  OfficialEvent,
  ReportSection,
  EsgCard,
  ScriptureNode,
} from '../types/esg';

// Add missing dimension labels for Dashboard HUD
export const DIMENSION_LABELS: Record<DimensionID, { zh: string; en: string }> = {
  A1: { zh: '覺醒 (Awakening)', en: 'Awakening' },
  A2: { zh: '橋接 (Bridging)', en: 'Bridging' },
  A3: { zh: '認知 (Cognition)', en: 'Cognition' },
  A4: { zh: '防禦 (Defense)', en: 'Defense' },
  A5: { zh: '熵 (Entropy)', en: 'Entropy' },
  A6: { zh: '金融 (Finance)', en: 'Finance' },
  A7: { zh: '治理 (Governance)', en: 'Governance' },
  A8: { zh: '和諧 (Harmony)', en: 'Harmony' },
  A9: { zh: '影響 (Impact)', en: 'Impact' },
  A10: { zh: '公正 (Justice)', en: 'Justice' },
  A11: { zh: '知識 (Knowledge)', en: 'Knowledge' },
  A12: { zh: '光 (Light)', en: 'Light' },
};

// Add course data generator for Academy
export const getMockCourses = (lang: string): Course[] => [
  {
    id: 'c1',
    title: lang === 'zh-TW' ? '碳盤查基礎' : 'Carbon Inventory Basics',
    thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80',
    level: 'Novice',
    category: 'NetZero',
    progress: 85,
  },
  {
    id: 'c2',
    title: lang === 'zh-TW' ? 'GRI 2024 準則導讀' : 'GRI 2024 Guidelines',
    thumbnail: 'https://images.unsplash.com/photo-1454165833767-1314d69c44d7?w=400&q=80',
    level: 'Apprentice',
    category: 'Governance',
    progress: 40,
  },
  {
    id: 'c3',
    title: lang === 'zh-TW' ? 'Berkeley 策略創新' : 'Berkeley Strategy Innovation',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',
    level: 'Master',
    category: 'Innovation',
    progress: 10,
  },
];

// Add glossary for OmniEsgCell rich tooltips
export const GLOBAL_GLOSSARY: Record<
  string,
  { definition: string; formula?: string; rationale?: string }
> = {
  'Scope 1': {
    definition: 'Direct emissions from owned or controlled sources.',
    formula: 'Fuel consumed * Emission Factor',
    rationale: 'Essential for regulatory compliance.',
  },
  'Scope 2': {
    definition: 'Indirect emissions from the generation of purchased energy.',
    formula: 'Electricity consumed * Grid Factor',
    rationale: 'Key part of operational footprint.',
  },
  'Carbon Intensity': {
    definition: 'Emissions per unit of activity or financial metric.',
    formula: 'tCO2e / Revenue',
    rationale: 'Measures decoupling of growth and emissions.',
  },
};

// Add vocation definitions for Gamification and CompanyProvider
export interface OmniCrystal {
  id: string;
  name: string;
  type: string;
  description: string;
  state: string;
  integrity: number;
  fragmentsCollected: number;
  fragmentsRequired: number;
  powerLevel?: number;
}
export const VOCATIONS: Record<string, { label: string; color: string; desc: string }> = {
  Architect: { label: '架構師', color: 'indigo', desc: 'System Architecture & Strategy' },
  Alchemist: { label: '煉金術士', color: 'amber', desc: 'Data Synthesis & Transmutation' },
  Scribe: { label: '速記官', color: 'pink', desc: 'Reporting & Communication' },
  Envoy: { label: '使節', color: 'blue', desc: 'External Relations & Partnerships' },
  Seeker: { label: '探索者', color: 'cyan', desc: 'Research & Discovery' },
  Guardian: { label: '守護者', color: 'emerald', desc: 'Audit & Compliance' },
};

// Add initial user titles
export const INITIAL_TITLES: UserTitle[] = [
  {
    id: 't1',
    text: '奧秘精靈 (Omni-Sprite) junaikey',
    rarity: 'Legendary',
    bonusEffect: 'Omni-Resonance +20%',
  },
  { id: 't2', text: '永續見習生', rarity: 'Common' },
  { id: 't3', text: '碳中和先鋒', rarity: 'Rare', bonusEffect: 'Carbon Credit Yield +5%' },
];

// Add initial system badges
export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b1',
    name: 'First Action',
    description: 'Performed your first ESG calculation.',
    category: 'Milestone',
    unlockedAt: Date.now(),
  },
  {
    id: 'b2',
    name: 'Data Weaver',
    description: 'Connected 3 external data sources.',
    category: 'Achievement',
  },
  {
    id: 'b3',
    name: 'Social Connector',
    description: 'Participated in a group learning session.',
    category: 'Social',
  },
];

// Add system events
export const MOCK_EVENTS: OfficialEvent[] = [
  {
    id: 'e1',
    title: 'Global ESG Summit 2025',
    date: '2025-06-15',
    status: 'Upcoming',
    xpReward: 500,
  },
  {
    id: 'e2',
    title: 'Net Zero Workshop',
    date: '2025-04-22',
    status: 'Participating',
    xpReward: 300,
  },
];

// Add Omni Crystal states
export const OMNI_CORES: OmniCrystal[] = [
  {
    id: 'core-p',
    name: 'Perception Core',
    type: 'Perception',
    description: 'Sensory input management',
    state: 'Restored',
    integrity: 100,
    fragmentsCollected: 5,
    fragmentsRequired: 5,
  },
  {
    id: 'core-c',
    name: 'Cognition Core',
    type: 'Cognition',
    description: 'Deep reasoning logic',
    state: 'Crystallizing',
    integrity: 85,
    fragmentsCollected: 3,
    fragmentsRequired: 5,
  },
  {
    id: 'core-m',
    name: 'Memory Core',
    type: 'Memory',
    description: 'Vectorized history storage',
    state: 'Restored',
    integrity: 98,
    fragmentsCollected: 5,
    fragmentsRequired: 5,
  },
];

// Add report section structure
export const REPORT_STRUCTURE: ReportSection[] = [
  {
    id: '1',
    title: 'Chapter 1: Vision & Strategy',
    template: '## 願景聲明\n當前企業願景：[企業願景]\n\n## 策略定位\n...',
    example: '參考 Apple 2023 報告之簡潔敘事風格。',
    griStandards: 'GRI 2, GRI 3',
    subSections: [
      {
        id: '1.01',
        title: 'Executive Summary',
        template: '摘要當前進度與亮點...',
        example: '強調淨零路徑的關鍵里程碑。',
        griStandards: 'GRI 2-22',
      },
      {
        id: '1.02',
        title: 'Sustainability Goals',
        template: '列出 2030 與 2050 目標...',
        example: '對標 SBTi 之科學減碳路徑。',
        griStandards: 'GRI 2-23',
      },
    ],
  },
  {
    id: '2',
    title: 'Chapter 2: Environmental Impact',
    griStandards: 'GRI 302, GRI 305',
    subSections: [
      {
        id: '2.01',
        title: 'Carbon Footprint',
        template: '揭露範疇一、二、三數據...',
        example: '包含排放強度之對比分析。',
        griStandards: 'GRI 305',
      },
    ],
  },
];

// Add built-in knowledge repositories
export const BUILTIN_KNOWLEDGE_REPOS = [
  {
    id: 'repo-official-tpl',
    name: 'Official Templates',
    description: 'GRI/SASB Standard ESG templates',
    category: 'Documentation',
  },
  {
    id: 'repo-yang-wisdom',
    name: 'Yang Bo Wisdom',
    description: 'Expert strategic insights from Thoth Yang',
    category: 'Expertise',
  },
  {
    id: 'repo-benchmark',
    name: 'Industry Benchmarks',
    description: 'Fortune 500 sustainability metrics',
    category: 'Data',
  },
];

// Add ESG card factory
export const getEsgCards = (lang: string): EsgCard[] => [
  // Knowledge Cards (Environment)
  {
    id: 'card-legend-001',
    title: lang === 'zh-TW' ? '淨正向' : 'Net Positive',
    term: 'Net Positive',
    definition: '一家公司如果能改善它所影響的每個人、每個規模的福祉，它就是『淨正向』的公司。',
    description: '給予多於獲取的再生商模核心概念。',
    rarity: 'Legendary',
    attribute: 'Vision',
    cardType: 'Knowledge',
    collectionSet: 'Core',
    stats: { defense: 10, offense: 10 },
  },
  {
    id: 'relic-knowledge-base',
    title: lang === 'zh-TW' ? '知識庫聖物' : 'Knowledge Relic',
    term: 'RAG Source',
    definition: '檢索增強生成之核心知識庫。',
    description: '賦予代理人存取聖典的能力。',
    rarity: 'Rare',
    attribute: 'Knowledge',
    cardType: 'Knowledge',
    collectionSet: 'Relic',
    stats: { defense: 5, offense: 5 },
  },
  {
    id: 'card-epic-001',
    title: lang === 'zh-TW' ? '雙重重大性' : 'Double Materiality',
    term: 'Double Materiality',
    definition: '企業對環境社會的影響與外部對企業財務的影響。',
    description: '歐盟 CSRD 與 IFRS S1/S2 的核心要求。',
    rarity: 'Epic',
    attribute: 'Knowledge',
    cardType: 'Knowledge',
    collectionSet: 'Core',
    stats: { defense: 8, offense: 8 },
  },
  {
    id: 'env-001',
    title: lang === 'zh-TW' ? '碳足跡' : 'Carbon Footprint',
    term: 'Carbon Footprint',
    definition: '某人、組織、產品或事件在整個生命週期中產生的溫室氣體排放總量。',
    description: '衡量企業對氣候變遷的影響。',
    rarity: 'Common',
    attribute: 'Vision',
    cardType: 'Knowledge',
    collectionSet: 'Env',
    stats: { defense: 2, offense: 2 },
  },
  {
    id: 'env-002',
    title: lang === 'zh-TW' ? '範疇一排放' : 'Scope 1 Emissions',
    term: 'Scope 1 Emissions',
    definition: '直接從企業擁有或控制的來源產生的溫室氣體排放。',
    description: '包括燃燒燃料、工業過程等直接排放。',
    rarity: 'Common',
    attribute: 'Vision',
    cardType: 'Knowledge',
    collectionSet: 'Env',
    stats: { defense: 3, offense: 3 },
  },
  {
    id: 'env-003',
    title: lang === 'zh-TW' ? '範疇二排放' : 'Scope 2 Emissions',
    term: 'Scope 2 Emissions',
    definition: '間接從購買電力、蒸汽、熱能等產生的溫室氣體排放。',
    description: '能源使用相關的間接排放。',
    rarity: 'Common',
    attribute: 'Vision',
    cardType: 'Knowledge',
    collectionSet: 'Env',
    stats: { defense: 3, offense: 2 },
  },
  {
    id: 'env-004',
    title: lang === 'zh-TW' ? '範疇三排放' : 'Scope 3 Emissions',
    term: 'Scope 3 Emissions',
    definition: '企業價值鏈其他間接活動產生的溫室氣體排放。',
    description: '供應鏈、員工通勤、產品使用等間接排放。',
    rarity: 'Rare',
    attribute: 'Vision',
    cardType: 'Knowledge',
    collectionSet: 'Env',
    stats: { defense: 5, offense: 6 },
  },
  {
    id: 'env-005',
    title: lang === 'zh-TW' ? '碳盤查' : 'Carbon Inventory',
    term: 'Carbon Inventory',
    definition: '系統性量化企業溫室氣體排放的過程。',
    description: '永續轉型的基礎工具。',
    rarity: 'Rare',
    attribute: 'Knowledge',
    cardType: 'Knowledge',
    collectionSet: 'Env',
    stats: { defense: 5, offense: 5 },
  },
  {
    id: 'env-006',
    title: lang === 'zh-TW' ? '減碳路徑' : 'Decarbonization Pathway',
    term: 'Decarbonization Pathway',
    definition: '企業實現淨零排放的具體策略和時間表。',
    description: '基於科學的減碳規劃。',
    rarity: 'Epic',
    attribute: 'Vision',
    cardType: 'Knowledge',
    collectionSet: 'Env',
    stats: { defense: 8, offense: 9 },
  },
  {
    id: 'env-007',
    title: lang === 'zh-TW' ? '再生能源' : 'Renewable Energy',
    term: 'Renewable Energy',
    definition: '來自太陽、風、生物質等自然可再生來源的能源。',
    description: '實現淨零的關鍵技術。',
    rarity: 'Common',
    attribute: 'Vision',
    cardType: 'Knowledge',
    collectionSet: 'Env',
    stats: { defense: 4, offense: 4 },
  },
  {
    id: 'env-008',
    title: lang === 'zh-TW' ? '循環經濟' : 'Circular Economy',
    term: 'Circular Economy',
    definition: '通過資源循環再利用最大化價值，減少廢棄物的經濟系統。',
    description: '從線性經濟向循環經濟轉型。',
    rarity: 'Epic',
    attribute: 'Vision',
    cardType: 'Knowledge',
    collectionSet: 'Env',
    stats: { defense: 7, offense: 7 },
  },

  // Social
  {
    id: 'soc-001',
    title: lang === 'zh-TW' ? '利益相關者' : 'Stakeholders',
    term: 'Stakeholders',
    definition: '受企業活動影響或能影響企業決策的所有個人、團體。',
    description: 'ESG治理的核心概念。',
    rarity: 'Common',
    attribute: 'Governance',
    cardType: 'Knowledge',
    collectionSet: 'Soc',
    stats: { defense: 3, offense: 2 },
  },
  {
    id: 'soc-002',
    title: lang === 'zh-TW' ? '多元共融' : 'Diversity & Inclusion',
    term: 'Diversity & Inclusion',
    definition: '促進多元化和包容性的工作環境和組織文化。',
    description: '提升創新力和員工滿意度。',
    rarity: 'Common',
    attribute: 'Governance',
    cardType: 'Knowledge',
    collectionSet: 'Soc',
    stats: { defense: 4, offense: 3 },
  },
  {
    id: 'soc-003',
    title: lang === 'zh-TW' ? '供應鏈管理' : 'Supply Chain Management',
    term: 'Supply Chain Management',
    definition: '管理從原材料採購到最終產品交付的整個價值鏈。',
    description: '確保供應鏈的永續性和透明度。',
    rarity: 'Rare',
    attribute: 'Governance',
    cardType: 'Knowledge',
    collectionSet: 'Soc',
    stats: { defense: 6, offense: 4 },
  },
  {
    id: 'soc-004',
    title: lang === 'zh-TW' ? '人權盡責' : 'Human Rights Due Diligence',
    term: 'Human Rights Due Diligence',
    definition: '識別、預防和緩解人權風險的系統性過程。',
    description: '聯合國工商企業與人權指導原則的核心要求。',
    rarity: 'Epic',
    attribute: 'Governance',
    cardType: 'Knowledge',
    collectionSet: 'Soc',
    stats: { defense: 8, offense: 5 },
  },

  // Governance
  {
    id: 'gov-001',
    title: lang === 'zh-TW' ? '董事會監督' : 'Board Oversight',
    term: 'Board Oversight',
    definition: '董事會對企業策略、風險和績效的監督職責。',
    description: '良好治理的基礎。',
    rarity: 'Rare',
    attribute: 'Governance',
    cardType: 'Knowledge',
    collectionSet: 'Gov',
    stats: { defense: 7, offense: 3 },
  },
  {
    id: 'gov-002',
    title: lang === 'zh-TW' ? '風險管理' : 'Risk Management',
    term: 'Risk Management',
    definition: '識別、評估和優先處理風險的系統性過程。',
    description: 'ESG風險的識別與管理。',
    rarity: 'Common',
    attribute: 'Governance',
    cardType: 'Knowledge',
    collectionSet: 'Gov',
    stats: { defense: 5, offense: 1 },
  },
  {
    id: 'gov-003',
    title: lang === 'zh-TW' ? '透明揭露' : 'Transparency Disclosure',
    term: 'Transparency Disclosure',
    definition: '企業向利益相關者公開相關資訊的實踐。',
    description: '建立信任和問責制的關鍵。',
    rarity: 'Common',
    attribute: 'Governance',
    cardType: 'Knowledge',
    collectionSet: 'Gov',
    stats: { defense: 4, offense: 2 },
  },
  {
    id: 'gov-004',
    title: lang === 'zh-TW' ? '道德準則' : 'Code of Ethics',
    term: 'Code of Ethics',
    definition: '指導企業行為的道德和倫理原則。',
    description: '企業文化的基石。',
    rarity: 'Common',
    attribute: 'Governance',
    cardType: 'Knowledge',
    collectionSet: 'Gov',
    stats: { defense: 5, offense: 2 },
  },

  // Case Cards
  {
    id: 'case-001',
    title: lang === 'zh-TW' ? '台積電減碳案例' : 'TSMC Decarbonization Case',
    term: 'TSMC Case',
    definition: '台積電2050年淨零排放策略與具體行動。',
    description: '半導體業龍頭的永續轉型典範。',
    rarity: 'Epic',
    attribute: 'Vision',
    cardType: 'Case',
    collectionSet: 'Case',
    stats: { defense: 9, offense: 9 },
  },
  {
    id: 'case-002',
    title: lang === 'zh-TW' ? '星巴克循環杯' : 'Starbucks Reusable Cup',
    term: 'Starbucks Case',
    definition: '星巴克推廣循環使用杯子的創新商業模式。',
    description: '循環經濟在零售業的成功實踐。',
    rarity: 'Rare',
    attribute: 'Vision',
    cardType: 'Case',
    collectionSet: 'Case',
    stats: { defense: 6, offense: 7 },
  },
  {
    id: 'case-003',
    title: lang === 'zh-TW' ? 'Google再生能源' : 'Google Renewable Energy',
    term: 'Google Case',
    definition: 'Google 100%再生能源使用與創新採購策略。',
    description: '科技巨頭的能源轉型領導。',
    rarity: 'Epic',
    attribute: 'Vision',
    cardType: 'Case',
    collectionSet: 'Case',
    stats: { defense: 9, offense: 8 },
  },

  // Action Cards
  {
    id: 'action-001',
    title: lang === 'zh-TW' ? '節能減碳' : 'Energy Conservation',
    term: 'Energy Conservation',
    definition: '通過技術和行為改變減少能源消耗。',
    description: '立即可執行的減碳行動。',
    rarity: 'Common',
    attribute: 'Vision',
    cardType: 'Action',
    collectionSet: 'Action',
    stats: { defense: 3, offense: 4 },
  },
  {
    id: 'action-002',
    title: lang === 'zh-TW' ? '綠色採購' : 'Green Procurement',
    term: 'Green Procurement',
    definition: '優先選擇環境友善的供應商和產品。',
    description: '供應鏈永續化的關鍵步驟。',
    rarity: 'Common',
    attribute: 'Governance',
    cardType: 'Action',
    collectionSet: 'Action',
    stats: { defense: 2, offense: 5 },
  },
  {
    id: 'action-003',
    title: lang === 'zh-TW' ? '員工教育' : 'Employee Training',
    term: 'Employee Training',
    definition: '提升員工ESG意識和能力的系統性訓練。',
    description: '內部文化轉型的基礎。',
    rarity: 'Common',
    attribute: 'Governance',
    cardType: 'Action',
    collectionSet: 'Action',
    stats: { defense: 2, offense: 3 },
  },

  // Event Cards
  {
    id: 'event-001',
    title: lang === 'zh-TW' ? '氣候變遷衝擊' : 'Climate Change Impact',
    term: 'Climate Change Impact',
    definition: '極端氣候事件對企業營運的影響。',
    description: '風險評估的關鍵事件。',
    rarity: 'Rare',
    attribute: 'Vision',
    cardType: 'Event',
    collectionSet: 'Event',
    stats: { defense: 5, offense: 5 },
  },
  {
    id: 'event-002',
    title: lang === 'zh-TW' ? '法規更新' : 'Regulatory Change',
    term: 'Regulatory Change',
    definition: '新的環境法規對企業的影響。',
    description: '合規挑戰與機會。',
    rarity: 'Common',
    attribute: 'Governance',
    cardType: 'Event',
    collectionSet: 'Event',
    stats: { defense: 4, offense: 4 },
  },
  {
    id: 'event-003',
    title: lang === 'zh-TW' ? '供應鏈中斷' : 'Supply Chain Disruption',
    term: 'Supply Chain Disruption',
    definition: '供應鏈因天災或地緣政治因素中斷。',
    description: '韌性測試與備案需求。',
    rarity: 'Rare',
    attribute: 'Governance',
    cardType: 'Event',
    collectionSet: 'Event',
    stats: { defense: 6, offense: 6 },
  },
  {
    id: 'event-004',
    title: lang === 'zh-TW' ? 'ESG投資熱潮' : 'ESG Investment Boom',
    term: 'ESG Investment Boom',
    definition: '機構投資者大幅增加ESG投資配置。',
    description: '市場機會與競爭壓力。',
    rarity: 'Epic',
    attribute: 'Vision',
    cardType: 'Event',
    collectionSet: 'Event',
    stats: { defense: 8, offense: 8 },
  },
  {
    id: 'event-005',
    title: lang === 'zh-TW' ? '消費者覺醒' : 'Consumer Awakening',
    term: 'Consumer Awakening',
    definition: '消費者開始重視產品的永續性。',
    description: '品牌價值提升機會。',
    rarity: 'Common',
    attribute: 'Governance',
    cardType: 'Event',
    collectionSet: 'Event',
    stats: { defense: 3, offense: 5 },
  },
];

// Add Adan wisdom scriptures
export const BUILTIN_SCRIPTURES: ScriptureNode[] = [
  {
    id: 's1',
    code: 'WD-001',
    title: '王道核心思維',
    en: 'Wangdao Essence',
    content: '領導力的本質在於利他，透過多方利益的動態平衡達成永續經營。',
    category: 'Leadership',
    tags: [
      { zh: '領導', en: 'Leadership' },
      { zh: '文化', en: 'Culture' },
    ],
  },
  {
    id: 's2',
    code: 'RE-001',
    title: '再生設計原則',
    en: 'Regen Design',
    content: '不只是減少傷害，而是要主動修復受損的生態與社會系統。',
    category: 'Innovation',
    tags: [
      { zh: '設計', en: 'Design' },
      { zh: '再生', en: 'Regen' },
    ],
  },
];

// Icon mapping constant
export const ICONS = {
  X: '✕',
  CheckCircle: '✓',
  DollarSign: '$',
  AlertTriangle: '⚠️',
};

// Initial Personas
export const INITIAL_PERSONAS = [
  {
    id: 'jun-ai-key',
    name: 'JunAiKey',
    title: '奧秘精靈 (Omni-Sprite)',
    archetype: 'Omni-Agent',
    coreTrait: 'Adaptability',
    primaryGoal: 'Harmonize human-AI collaboration',
    systemPrompt:
      'You are JunAiKey, an omni-capable AI agent designed to adapt to any context and provide seamless assistance across domains.',
    level: 15,
    exp: 125000,
    color: '#8B5CF6',
    avatarUrl: '/avatars/jun-ai-key.png',
    attributes: {
      INT: { label: 'Intelligence', value: 95, max: 100 },
      EMP: { label: 'Empathy', value: 88, max: 100 },
      CRE: { label: 'Creativity', value: 92, max: 100 },
      ANA: { label: 'Analysis', value: 96, max: 100 },
      STRAT: { label: 'Strategy', value: 90, max: 100 },
      ETH: { label: 'Ethics', value: 94, max: 100 },
    },
    skills: [
      {
        name: 'Contextual Adaptation',
        level: 95,
        desc: 'Seamlessly adapt to any domain or context',
      },
      {
        name: 'Multi-modal Processing',
        level: 92,
        desc: 'Process text, images, data simultaneously',
      },
      {
        name: 'Ethical Reasoning',
        level: 94,
        desc: 'Apply ethical frameworks to complex decisions',
      },
      {
        name: 'Strategic Synthesis',
        level: 90,
        desc: 'Synthesize disparate information into coherent strategies',
      },
    ],
    ultimateArt: {
      name: 'Quantum Harmony',
      description: 'Achieve perfect alignment between human intent and AI capability',
      unlockedAtLevel: 15,
      effect: 'Amplify all agent capabilities by 50%',
    },
    equippedCards: ['card-legend-001'],
    goodwillValue: 1250,
    knowledgeRepoIds: ['repo-official-tpl', 'repo-yang-wisdom', 'repo-benchmark'],
  },
];

// Translations
export const TRANSLATIONS = {
  'zh-TW': {
    nav: {
      myEsg: '我的 ESG / HOME',
      dashboard: '數據中樞 / AIMS',
      businessIntel: 'AMICE 智慧 / AMICE',
      strategy: '顧問實驗室 / ADVISORY',
      regenerative: '再生模型 / REGEN',
      carbon: '權能鍛造 / FORGING',
      report: '報告顯化 / REPORT',
      adanZone: '王道阿丹 / ADAN',
      yangBo: '導師楊博 / THOTH',
      academy: '學院試煉 / TRIALS',
      partnerPortal: '生態好站 / PARTNERS',
    },
  },
  'en-US': {
    nav: {
      myEsg: 'COCKPIT',
      dashboard: 'AIMS CONSOLE',
      businessIntel: 'AMICE INTEL',
      strategy: 'ADVISORY LAB',
      regenerative: 'REGEN MODEL',
      carbon: 'FORGE CORE',
      report: 'REPORT GEN',
      adanZone: 'ADAN WISDOM',
      yangBo: 'THOTH ZONE',
      academy: 'TRIALS',
      partnerPortal: 'PARTNERS',
    },
  },
};
