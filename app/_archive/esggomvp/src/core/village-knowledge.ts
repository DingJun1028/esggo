import { IKnowledgePoint as IOmniKnowledgePoint, IKnowledgeMastery } from './omni-types';

export type KnowledgeDomain = 'E' | 'S' | 'G';
export type KnowledgeDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type KnowledgeStatus = '5T_verified' | 'draft';

/** 🏛️ 擴展型別以符合實作需求 */
export interface IKnowledgePoint extends IOmniKnowledgePoint {
    uuid: string; // 保持原本 uuid 命名習慣
    title_zh: string;
    title_en: string;
    summary_zh: string;
    domain: KnowledgeDomain;
    difficulty: KnowledgeDifficulty;
    tags: string[];
    standard: string;
    formula?: string;
    source_origin: string;
    status: KnowledgeStatus;
}

/** 🛠️ Helper: 將 Domain 字串轉換為 IKnowledgePoint.category 所需的 Enum */
const mapDomainToCategory = (domain: KnowledgeDomain): 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE' => {
    switch (domain) {
        case 'E': return 'ENVIRONMENT';
        case 'S': return 'SOCIAL';
        case 'G': return 'GOVERNANCE';
    }
};

export const VILLAGE_KNOWLEDGE: IKnowledgePoint[] = [
    // ─────────────── E 環境永續 (8 項) ───────────────
    {
        uuid: 'ki-e001',
        title: '碳足跡計算：Scope 1/2/3 方法學', // 補齊 IOmniKnowledgePoint.title
        title_zh: '碳足跡計算：Scope 1/2/3 方法學',
        title_en: 'Carbon Footprint: Scope 1/2/3 Methodology',
        summary_zh: '根據 GHG Protocol，企業需申報直接排放 (Scope 1)、間接電力排放 (Scope 2) 與價值鏈排放 (Scope 3)。台灣電力排放係數為 0.494 kgCO2e/kWh。',
        summary: '根據 GHG Protocol，企業需申報直接排放 (Scope 1)、間接電力排放 (Scope 2) 與價值鏈排放 (Scope 3)。',
        domain: 'E',
        category: 'ENVIRONMENT', // 固定為核心類別
        difficulty: 'intermediate',
        tags: ['碳排放', 'GHG Protocol', 'ISO 14064', 'Scope 3'],
        standard: 'GHG Protocol / ISO 14064',
        formula: 'E = AD × EF (排放量 = 活動數據 × 排放係數)',
        expReward: 50,
        status: '5T_verified',
        source_origin: 'GHG Protocol Corporate Standard 2004',
        mastery: {
            level: 0,
            challengeHistory: []
        }
    },
    {
        uuid: 'ki-e002',
        title: '淨零轉型路徑：SBTi 科學基礎目標',
        title_zh: '淨零轉型路徑：SBTi 科學基礎目標',
        title_en: 'Net Zero Transition: SBTi Science-Based Targets',
        summary_zh: 'Science Based Targets initiative (SBTi) 要求企業設定與《巴黎協定》1.5°C 对齐的减排目标。近期目標需在 5-10 年內減少 42% 排放。',
        summary: 'Science Based Targets initiative (SBTi) 要求企業設定與《巴黎協定》1.5°C 對齊的減排目標。',
        domain: 'E',
        category: 'ENVIRONMENT',
        difficulty: 'advanced',
        tags: ['淨零', 'SBTi', '巴黎協定', '1.5°C'],
        standard: 'SBTi Corporate Net-Zero Standard',
        expReward: 80,
        status: '5T_verified',
        source_origin: 'SBTi Corporate Net-Zero Standard v1.1 2021',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-e003',
        title: '再生能源憑證 (REC) 與綠電採購',
        title_zh: '再生能源憑證 (REC) 與綠電採購',
        title_en: 'Renewable Energy Certificates (REC) & Green Power Procurement',
        summary_zh: 'REC 是驗證綠色電力來源的數位憑證。企業採購 REC 可宣告使用 100% 再生能源，有助於 RE100 目標達成與 Scope 2 市場法排放歸零。',
        summary: 'REC 是驗證綠色電力來源的數位憑證。企業採購 REC 可宣告使用 100% 再生能源。',
        domain: 'E',
        category: 'ENVIRONMENT',
        difficulty: 'beginner',
        tags: ['REC', '綠電', 'RE100', 'Scope 2'],
        standard: 'GHG Protocol Scope 2 Guidance',
        expReward: 30,
        status: '5T_verified',
        source_origin: 'RE100 Technical Criteria 2023',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-e004',
        title: '生物多樣性風險：TNFD 框架簡介',
        title_zh: '生物多樣性風險：TNFD 框架簡介',
        title_en: 'Biodiversity Risk: TNFD Framework Introduction',
        summary_zh: 'Taskforce on Nature-related Financial Disclosures (TNFD) 是自然相關財務揭露框架，協助企業評估與自然資本相關的依賴性、衝擊、風險與機會。',
        summary: 'Taskforce on Nature-related Financial Disclosures (TNFD) 是自然相關財務揭露框架。',
        domain: 'E',
        category: 'ENVIRONMENT',
        difficulty: 'advanced',
        tags: ['TNFD', '自然資本', '生物多樣性', 'LEAP'],
        standard: 'TNFD v1.0 2023',
        expReward: 100,
        status: '5T_verified',
        source_origin: 'TNFD Recommendations v1.0 September 2023',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-e005',
        title: '水資源風險評估：WRI Aqueduct 工具',
        title_zh: '水資源風險評估：WRI Aqueduct 工具',
        title_en: 'WRI Aqueduct Tool',
        summary_zh: 'WRI Aqueduct 提供全球水資源風險地圖，企業可識別工廠所在地的缺水風險、洪水風險。',
        summary: 'WRI Aqueduct 提供全球水資源風險地圖。',
        domain: 'E',
        category: 'ENVIRONMENT',
        difficulty: 'intermediate',
        tags: ['水資源', 'WRI', 'Aqueduct'],
        standard: 'GRI 303: Water and Effluents',
        expReward: 50,
        status: '5T_verified',
        source_origin: 'WRI Aqueduct 4.0 2023',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-e006',
        title: '循環經濟：廢棄物零掩埋策略',
        title_zh: '循環經濟：廢棄物零掩埋策略',
        title_en: 'Circular Economy: Zero Waste',
        summary_zh: '循環經濟聚焦於「減少 → 再使用 → 再利用 → 回收」的廢棄物層次。',
        summary: '循環經濟聚焦於「減少 → 再使用 → 再利用 → 回收」的廢棄物層次。',
        domain: 'E',
        category: 'ENVIRONMENT',
        difficulty: 'beginner',
        tags: ['循環經濟', '廢棄物', 'Zero Waste'],
        standard: 'GRI 306: Waste 2020',
        expReward: 30,
        status: '5T_verified',
        source_origin: 'Ellen MacArthur Foundation',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-e007',
        title: '物理氣候風險：IPCC 情境分析',
        title_zh: '物理氣候風險：IPCC 情境分析',
        title_en: 'Physical Climate Risk: IPCC',
        summary_zh: 'TCFD 要求企業基於 IPCC 情境 (RCP 2.6 / 8.5) 評估物理氣候風險。',
        summary: 'TCFD 要求企業基於 IPCC 情境評估物理氣候風險。',
        domain: 'E',
        category: 'ENVIRONMENT',
        difficulty: 'advanced',
        tags: ['TCFD', 'IPCC', '物理風險'],
        standard: 'TCFD Recommendations 2023',
        expReward: 80,
        status: '5T_verified',
        source_origin: 'IPCC AR6 2021',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-e008',
        title: '永續建築：LEED 認證標準',
        title_zh: '永續建築：LEED 認證標準',
        title_en: 'Green Building: LEED',
        summary_zh: 'LEED 是全球最廣泛使用的綠建築評分系統。',
        summary: 'LEED 是全球最廣泛使用的綠建築評分系統。',
        domain: 'E',
        category: 'ENVIRONMENT',
        difficulty: 'intermediate',
        tags: ['LEED', '綠建築'],
        standard: 'LEED v4.1',
        expReward: 50,
        status: '5T_verified',
        source_origin: 'USGBC LEED',
        mastery: { level: 0, challengeHistory: [] }
    },

    // ─────────────── S 社會責任 (8 項) ───────────────
    {
        uuid: 'ki-s001',
        title: '薪酬公平：性別薪酬差距揭露',
        title_zh: '薪酬公平：性別薪酬差距揭露',
        title_en: 'Pay Equity: Gender Pay Gap',
        summary_zh: '性別薪酬差距通常以「女性薪資中位數 / 男性薪資中位數」計算。',
        summary: '性別薪酬差距通常以「女性薪資中位數 / 男性薪資中位數」計算。',
        domain: 'S',
        category: 'SOCIAL',
        difficulty: 'beginner',
        tags: ['薪酬公平', '性別平等'],
        standard: 'GRI 405',
        expReward: 30,
        status: '5T_verified',
        source_origin: 'GRI Standards 405-2',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-s002',
        title: '供應鏈人權盡職調查 (HRDD)',
        title_zh: '供應鏈人權盡職調查 (HRDD)',
        title_en: 'Supply Chain HRDD',
        summary_zh: '聯合國《企業與人權指導原則》(UNGPs) 要求企業識別供應鏈人權風險。',
        summary: '聯合國《企業與人權指導原則》(UNGPs) 要求企業識別供應鏈人權風險。',
        domain: 'S',
        category: 'SOCIAL',
        difficulty: 'intermediate',
        tags: ['人權', 'UNGPs'],
        standard: 'UN Guiding Principles',
        expReward: 60,
        status: '5T_verified',
        source_origin: 'OHCHR UNGPs 2011',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-s003',
        title: '員工健康與安全：ISO 45001',
        title_zh: '員工健康與安全：ISO 45001',
        title_en: 'OHS: ISO 45001',
        summary_zh: 'ISO 45001 是職業健康安全管理系統國際標準。',
        summary: 'ISO 45001 是職業健康安全管理系統國際標準。',
        domain: 'S',
        category: 'SOCIAL',
        difficulty: 'intermediate',
        tags: ['ISO 45001', '職安'],
        standard: 'ISO 45001:2018',
        expReward: 50,
        status: '5T_verified',
        source_origin: 'ISO 45001:2018',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-s004',
        title: '社區投資：社會影響力評估 (SROI)',
        title_zh: '社區投資：社會影響力評估 (SROI)',
        title_en: 'SROI Framework',
        summary_zh: 'SROI 是衡量社會、環境與經濟價值的分析框架。',
        summary: 'SROI 是衡量社會、環境與經濟價值的分析框架。',
        domain: 'S',
        category: 'SOCIAL',
        difficulty: 'advanced',
        tags: ['SROI', '社會影響力'],
        standard: 'SVI SROI Framework',
        expReward: 80,
        status: '5T_verified',
        source_origin: 'Social Value International',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-s005',
        title: '員工培訓：人力資本揭露',
        title_zh: '員工培訓：人力資本揭露',
        title_en: 'ISO 30414: Human Capital',
        summary_zh: 'ISO 30414 提供人力資本揭露指引。',
        summary: 'ISO 30414 提供人力資本揭露指引。',
        domain: 'S',
        category: 'SOCIAL',
        difficulty: 'beginner',
        tags: ['人力資本', 'ISO 30414'],
        standard: 'ISO 30414:2018',
        expReward: 30,
        status: '5T_verified',
        source_origin: 'ISO 30414:2018',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-s006',
        title: '數位包容：無障礙設計 WCAG',
        title_zh: '數位包容：無障礙設計 WCAG',
        title_en: 'Digital Inclusion: WCAG',
        summary_zh: 'WCAG 確保產品對殘障人士可用。',
        summary: 'WCAG 確保產品對殘障人士可用。',
        domain: 'S',
        category: 'SOCIAL',
        difficulty: 'beginner',
        tags: ['WCAG', '無障礙'],
        standard: 'WCAG 2.1',
        expReward: 30,
        status: '5T_verified',
        source_origin: 'W3C WCAG 2.1',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-s007',
        title: '產品責任：循環設計原則',
        title_zh: '產品責任：循環設計原則',
        title_en: 'Design for Circularity',
        summary_zh: '循環設計要求產品在設計階段即考量拆解與回收。',
        summary: '循環設計要求產品在設計階段即考量拆解與回收。',
        domain: 'S',
        category: 'SOCIAL',
        difficulty: 'intermediate',
        tags: ['循環設計', '產品責任'],
        standard: 'ISO 14006',
        expReward: 60,
        status: '5T_verified',
        source_origin: 'ISO 14006:2020',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-s008',
        title: '資料隱私：GDPR 合規',
        title_zh: '資料隱私：GDPR 合規',
        title_en: 'GDPR Fundamentals',
        summary_zh: 'GDPR 要求企業取得明確同意、提供數據可攜性。',
        summary: 'GDPR 要求企業取得明確同意、提供數據可攜性。',
        domain: 'S',
        category: 'SOCIAL',
        difficulty: 'intermediate',
        tags: ['GDPR', '個資保護'],
        standard: 'EU GDPR',
        expReward: 50,
        status: '5T_verified',
        source_origin: 'EU GDPR 2016/679',
        mastery: { level: 0, challengeHistory: [] }
    },

    // ─────────────── G 公司治理 (8 項) ───────────────
    {
        uuid: 'ki-g001',
        title: '董事會多元化：ESG 治理',
        title_zh: '董事會多元化：ESG 治理',
        title_en: 'Board Diversity: ESG',
        summary_zh: '研究顯示女性董事佔比超過 30% 的公司表現優於平均。',
        summary: '研究顯示女性董事佔比超過 30% 的公司表現優於平均。',
        domain: 'G',
        category: 'GOVERNANCE',
        difficulty: 'beginner',
        tags: ['董事會', '多元化'],
        standard: 'GRI 405',
        expReward: 30,
        status: '5T_verified',
        source_origin: 'GRI 405',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-g002',
        title: '反貪腐合規：ISO 37001',
        title_zh: '反貪腐合規：ISO 37001',
        title_en: 'Anti-Corruption: ISO 37001',
        summary_zh: 'ISO 37001 是反賄賂管理系統國際標準。',
        summary: 'ISO 37001 是反賄賂管理系統國際標準。',
        domain: 'G',
        category: 'GOVERNANCE',
        difficulty: 'intermediate',
        tags: ['ISO 37001', '反賄賂'],
        standard: 'ISO 37001',
        expReward: 60,
        status: '5T_verified',
        source_origin: 'ISO 37001:2016',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-g003',
        title: '永續報告制度：CSRD 雙重重大性',
        title_zh: '永續報告制度：CSRD 雙重重大性',
        title_en: 'CSRD Double Materiality',
        summary_zh: '歐盟 CSRD 引入「雙重重大性」原則。',
        summary: '歐盟 CSRD 引入「雙重重大性」原則。',
        domain: 'G',
        category: 'GOVERNANCE',
        difficulty: 'advanced',
        tags: ['CSRD', '雙重重大性'],
        standard: 'EU CSRD',
        expReward: 100,
        status: '5T_verified',
        source_origin: 'EU CSRD 2022',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-g004',
        title: 'TCFD 氣候財務揭露框架',
        title_zh: 'TCFD 氣候財務揭露框架',
        title_en: 'TCFD Framework',
        summary_zh: 'TCFD 框架包含治理、策略、風險管理、指標與目標。',
        summary: 'TCFD 框架包含治理、策略、風險管理、指標與目標。',
        domain: 'G',
        category: 'GOVERNANCE',
        difficulty: 'intermediate',
        tags: ['TCFD', '氣候揭露'],
        standard: 'TCFD Recommendations',
        expReward: 80,
        status: '5T_verified',
        source_origin: 'TCFD 2017',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-g005',
        title: 'ESG 評等解讀：MSCI vs Sustainalytics',
        title_zh: 'ESG 評等解讀：MSCI vs Sustainalytics',
        title_en: 'ESG Ratings Comparison',
        summary_zh: '理解各機構評分邏輯，避免被動評分困境。',
        summary: '理解各機構評分邏輯，避免被動評分困境。',
        domain: 'G',
        category: 'GOVERNANCE',
        difficulty: 'intermediate',
        tags: ['MSCI', 'ESG評等'],
        standard: 'MSCI ESG',
        expReward: 60,
        status: '5T_verified',
        source_origin: 'Berg et al. 2022',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-g006',
        title: '股東參與：ESG 主動所有權',
        title_zh: '股東參與：ESG 主動所有權',
        title_en: 'ESG Active Ownership',
        summary_zh: '投資人透過股東決議推動企業改善 ESG 表現。',
        summary: '投資人透過股東決議推動企業改善 ESG 表現。',
        domain: 'G',
        category: 'GOVERNANCE',
        difficulty: 'advanced',
        tags: ['主動所有權', 'CA100+'],
        standard: 'PRI Principles',
        expReward: 80,
        status: '5T_verified',
        source_origin: 'PRI 2022',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-g007',
        title: '重大性評估：GRI 3 矩陣',
        title_zh: '重大性評估：GRI 3 矩陣',
        title_en: 'Materiality: GRI 3',
        summary_zh: '識別衝擊重大性與財務重大性的優先順序。',
        summary: '識別衝擊重大性與財務重大性的優先順序。',
        domain: 'G',
        category: 'GOVERNANCE',
        difficulty: 'intermediate',
        tags: ['GRI 3', '重大性'],
        standard: 'GRI 3: 2021',
        expReward: 60,
        status: '5T_verified',
        source_origin: 'GRI 2021',
        mastery: { level: 0, challengeHistory: [] }
    },
    {
        uuid: 'ki-g008',
        title: '永續金融：EU 分類標準',
        title_zh: '永續金融：EU 分類標準',
        title_en: 'EU Taxonomy',
        summary_zh: '定義哪些經濟活動是「環境永續」的。',
        summary: '定義哪些經濟活動是「環境永續」的。',
        domain: 'G',
        category: 'GOVERNANCE',
        difficulty: 'advanced',
        tags: ['EU Taxonomy', '綠色金融'],
        standard: 'EU Taxonomy',
        expReward: 100,
        status: '5T_verified',
        source_origin: 'EU Taxonomy 2020',
        mastery: { level: 0, challengeHistory: [] }
    },
];

export const getKnowledgeByDomain = (domain: KnowledgeDomain) =>
    VILLAGE_KNOWLEDGE.filter(k => k.domain === domain);

export const getKnowledgeByTag = (tag: string) =>
    VILLAGE_KNOWLEDGE.filter(k => k.tags.includes(tag));

export const searchKnowledge = (query: string) => {
    const q = query.toLowerCase();
    return VILLAGE_KNOWLEDGE.filter(k =>
        k.title_zh.toLowerCase().includes(q) ||
        k.title_en.toLowerCase().includes(q) ||
        k.summary_zh.toLowerCase().includes(q) ||
        k.tags.some(t => t.toLowerCase().includes(q))
    );
};
