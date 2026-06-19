import type {
  DimensionID,
  Course,
  UserTitle,
  Badge,
  OfficialEvent,
  ReportSection,
  EsgCard,
  ScriptureNode,
} from './src/types/esg/index.js';
import type { OmniCrystal } from './src/types/omni/index.js';

// Dashboard Dimension Labels
export const DIMENSION_LABELS: Record<DimensionID, { zh: string; en: string }> = {
  A1: { zh: '覺醒', en: 'Awakening' },
  A2: { zh: '橋接', en: 'Bridging' },
  A3: { zh: '認知', en: 'Cognition' },
  A4: { zh: '防禦', en: 'Defense' },
  A5: { zh: '熵', en: 'Entropy' },
  A6: { zh: '金融', en: 'Finance' },
  A7: { zh: '治理', en: 'Governance' },
  A8: { zh: '和諧', en: 'Harmony' },
  A9: { zh: '影響', en: 'Impact' },
  A10: { zh: '公正', en: 'Justice' },
  A11: { zh: '知識', en: 'Knowledge' },
  A12: { zh: '光', en: 'Light' },
};

// Course Data Generator
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

// Glossary
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

// Vocations
export const VOCATIONS: Record<string, { label: string; color: string; desc: string }> = {
  Architect: { label: 'Architect', color: 'indigo', desc: 'System Architecture & Strategy' },
  Alchemist: { label: 'Alchemist', color: 'amber', desc: 'Data Synthesis & Transmutation' },
  Scribe: { label: 'Scribe', color: 'pink', desc: 'Reporting & Communication' },
  Envoy: { label: 'Envoy', color: 'blue', desc: 'External Relations & Partnerships' },
  Seeker: { label: 'Seeker', color: 'cyan', desc: 'Research & Discovery' },
  Guardian: { label: 'Guardian', color: 'emerald', desc: 'Audit & Compliance' },
};

// User Titles
export const INITIAL_TITLES: UserTitle[] = [
  {
    id: 't1',
    text: 'Omni-Agent Junaikey',
    rarity: 'Legendary',
    bonusEffect: 'Omni-Resonance +20%',
  },
  { id: 't2', text: 'Sustainability Intern', rarity: 'Common' },
  { id: 't3', text: 'Net Zero Pioneer', rarity: 'Rare', bonusEffect: 'Carbon Credit Yield +5%' },
];

// Badges
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

// Events
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

// Omni Cores
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

// Report Components
export const REPORT_STRUCTURE: ReportSection[] = [
  {
    id: '1',
    title: 'Chapter 1: Vision & Strategy',
    template: 'Vision Statement...',
    example: 'Refer to Apple 2023.',
    griStandards: 'GRI 2, GRI 3',
    subSections: [
      {
        id: '1.01',
        title: 'Executive Summary',
        template: 'Summary...',
        example: 'Key milestones.',
        griStandards: 'GRI 2-22',
      },
      {
        id: '1.02',
        title: 'Sustainability Goals',
        template: '2030 Goals...',
        example: 'SBTi alignment.',
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
        template: 'Scope 1, 2, 3...',
        example: 'Emission intensity.',
        griStandards: 'GRI 305',
      },
    ],
  },
];

// Knowledge Repos
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

// ESG Cards
export const getEsgCards = (lang: string): EsgCard[] => [
  {
    id: 'card-legend-001',
    title: 'Net Positive',
    term: 'Net Positive',
    definition: 'Giving more than taking.',
    description: 'Regenerative business model.',
    rarity: 'Legendary',
    attribute: 'Vision',
    cardType: 'Knowledge',
    collectionSet: 'Genesis',
    stats: { defense: 20, offense: 50 },
  },
  // ... (Simplified for brevity, ensuring validity)
];

// Scriptures
export const BUILTIN_SCRIPTURES: ScriptureNode[] = [
  {
    id: 's1',
    code: 'WD-001',
    title: 'Wangdao Essence',
    en: 'Wangdao Essence',
    content: 'Leadership involves altruism and balance.',
    category: 'Leadership',
    tags: [{ zh: '領導', en: 'Leadership' }],
  },
];

// Icons
export const ICONS = { X: '✕', CheckCircle: '✓', DollarSign: '$', AlertTriangle: '⚠️' };

// Initial Persona
export const INITIAL_PERSONAS = [
  {
    id: 'jun-ai-key',
    name: 'JunAiKey',
    title: 'Omni-Agent Avatar',
    archetype: 'Omni-Agent',
    coreTrait: 'Adaptability',
    primaryGoal: 'Harmonize human-AI collaboration',
    systemPrompt: 'You are JunAiKey, an omni-capable AI agent.',
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
    skills: [{ name: 'Contextual Adaptation', level: 95, desc: 'Seamlessly adapt to any domain' }],
    ultimateArt: {
      name: 'Quantum Harmony',
      description: 'Align intent and capability',
      unlockedAtLevel: 15,
      effect: 'Amplify all capabilities by 50%',
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
