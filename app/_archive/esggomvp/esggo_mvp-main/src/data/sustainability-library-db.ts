/**
 * 📚 Sustainability Library — 完整資料庫 (Static Seed Data)
 * 
 * 架構：靜態 TypeScript 模組作為資料層，提供 NCBDB 相容介面。
 * 可在未來直接替換為 NCBDB / Supabase 實際 API 呼叫。
 * 
 * 遵循 5T 協議：每筆資料皆含 id (Traceable) 與 timestamp (Trackable)
 */

export type ResourceCategory = 'Yearbook' | 'Report' | 'Regulation' | 'Template' | 'CaseStudy';
export type ResourceRegion = 'Taiwan' | 'USA' | 'Global' | 'EU' | 'APAC';

export interface ISustainabilityResource {
    id: string;
    resource_id: string;
    title: string;
    title_zh: string;
    title_en?: string;      // 英文標題（PDF 顯示用）
    category: ResourceCategory;
    region: ResourceRegion;
    year: string;
    author: string;
    tags: string[];
    description: string;
    description_zh: string;
    url?: string;
    is_featured: boolean;
    view_count: number;
    download_count: number;
    created_at: string;
    pages?: number;         // 頁數（PDF metadata 用）
    language?: string;      // 報告語言（PDF metadata 用）
    // 5T Fields
    hash_ref?: string;  // Trustworthy - 報告原始雜湊
    standard?: string;  // GRI / SASB / TCFD / ISSB
    scope?: string;     // Scope 1/2/3
    esg_score?: number; // 0-100 綜合評分
}

// ─── 10 年全球年鑑 ───────────────────────────────────────────────────
const YEARBOOKS: ISustainabilityResource[] = [
    2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015
].map((year, i) => ({
    id: `yb-${year}`,
    resource_id: `res-yb-${year}`,
    title: `${year} S&P Global Corporate Sustainability Assessment`,
    title_zh: `${year} 全球企業永續年鑑 (S&P Global)`,
    category: 'Yearbook',
    region: 'Global',
    year: year.toString(),
    author: 'S&P Global',
    tags: ['Benchmark', 'Trend_Analysis', 'S&P_CSA', 'ESG_Ranking'],
    description: `The ${year} S&P Global CSA captures ESG performance across 7,500+ companies worldwide.`,
    description_zh: `紀錄 ${year} 年度全球 7,500+ 指標企業之 ESG 績效、指標趨勢與排名數據，為業界最具指標性的年鑑。`,
    is_featured: year >= 2022,
    view_count: Math.floor(Math.random() * 5000) + 1000,
    download_count: Math.floor(Math.random() * 2000) + 200,
    created_at: `${year}-12-31T00:00:00Z`,
    standard: 'S&P CSA',
    esg_score: 80 + Math.floor(Math.random() * 15),
}));

// ─── 台灣指標企業報告 ────────────────────────────────────────────────
const TW_REPORTS: ISustainabilityResource[] = [
    {
        id: 'tw-tsmc-2023', resource_id: 'res-tw-01',
        title: 'TSMC 5-Year Sustainability Progress',
        title_zh: '台積電 (TSMC) 5 年永續進程紀錄',
        category: 'Report', region: 'Taiwan', year: '2023',
        author: 'TSMC', tags: ['Taiwan_30', 'Industry_Leader', 'Semi_Conductor', 'Scope_3'],
        description: 'TSMC\'s comprehensive 5-year ESG disclosure with Scope 1-3 tracking and supplier decarbonization.',
        description_zh: 'TSMC 釋出的深度永續揭露報告，涵蓋 E/S/G 各維度，特別著重供應鏈減碳路徑與 Scope 3 科學基礎目標。',
        is_featured: true, view_count: 8900, download_count: 3400,
        created_at: '2023-06-15T00:00:00Z', standard: 'GRI + TCFD + SASB', esg_score: 96,
        hash_ref: 'sha256:a3f2b1c4d5e6...',
    },
    {
        id: 'tw-cathay-2023', resource_id: 'res-tw-02',
        title: 'Cathay Financial Green Finance Report',
        title_zh: '國泰金控 (Cathay) 綠色金融報告',
        category: 'Report', region: 'Taiwan', year: '2023',
        author: 'Cathay Financial', tags: ['Taiwan_30', 'Green_Finance', 'TCFD', 'Finance'],
        description: 'Cathay\'s roadmap to sustainable finance including green bond issuance and TCFD-aligned disclosure.',
        description_zh: '國泰金控綠色金融策略全書，涵蓋綠色債券、永續連結貸款及 TCFD 四大支柱揭露。',
        is_featured: true, view_count: 5200, download_count: 1800,
        created_at: '2023-05-20T00:00:00Z', standard: 'TCFD + GRI', esg_score: 91,
    },
    {
        id: 'tw-foxconn-2023', resource_id: 'res-tw-03',
        title: 'Foxconn Value Chain Decarbonization Plan',
        title_zh: '鴻海 (Foxconn) 價值鏈減碳計畫',
        category: 'Report', region: 'Taiwan', year: '2023',
        author: 'Foxconn', tags: ['Taiwan_30', 'Supply_Chain', 'Carbon_Neutral', 'Electronics'],
        description: 'Foxconn\'s science-based target aligned decarbonization roadmap across a 200K+ supplier network.',
        description_zh: '鴻海集團覆蓋 20 萬家供應商的科學基礎目標 (SBTi) 對齊減碳計畫書。',
        is_featured: false, view_count: 4300, download_count: 1200,
        created_at: '2023-07-01T00:00:00Z', standard: 'GRI + SBTi', esg_score: 88,
    },
    {
        id: 'tw-csc-2023', resource_id: 'res-tw-04',
        title: 'CSC Hydrogen Metallurgy Technology Report',
        title_zh: '中鋼 (CSC) 氫能冶金技術專刊',
        category: 'Report', region: 'Taiwan', year: '2023',
        author: 'CSC', tags: ['Taiwan_30', 'Hydrogen', 'Heavy_Industry', 'Net_Zero'],
        description: 'CSC\'s pioneering research on hydrogen reduction steelmaking as a pathway to net-zero steel.',
        description_zh: '中鋼走向淨零的技術核心：氫能還原煉鋼技術路線圖與能源轉型計畫。',
        is_featured: false, view_count: 3100, download_count: 890,
        created_at: '2023-08-10T00:00:00Z', standard: 'GRI', esg_score: 83,
    },
    {
        id: 'tw-auo-2022', resource_id: 'res-tw-05',
        title: 'AUO ESG Report 2022',
        title_zh: '友達光電 (AUO) 永續報告書 2022',
        category: 'Report', region: 'Taiwan', year: '2022',
        author: 'AUO', tags: ['Taiwan_30', 'Display', 'Circular_Economy'],
        description: 'AUO\'s circular economy achievements and energy intensity reduction targets.',
        description_zh: '友達光電的循環經濟成就與能源密集度目標達成紀錄。',
        is_featured: false, view_count: 2700, download_count: 720,
        created_at: '2022-09-01T00:00:00Z', standard: 'GRI', esg_score: 85,
    },
];

// ─── 美國指標企業報告 ────────────────────────────────────────────────
const US_REPORTS: ISustainabilityResource[] = [
    {
        id: 'us-amazon-2023', resource_id: 'res-us-01',
        title: 'Amazon 2023 Sustainability Update',
        title_zh: 'Amazon 2023 永續進程更新',
        category: 'Report', region: 'USA', year: '2023',
        author: 'Amazon', tags: ['USA_10', 'Innovation', 'Climate_Pledge', 'Logistics'],
        description: 'Amazon\'s Climate Pledge progress: renewable energy, EV fleet, and Scope 3 reporting.',
        description_zh: 'Amazon 氣候誓言進程：可再生能源採購、電動車隊滾動部署及 Scope 3 揭露報告。',
        is_featured: true, view_count: 9800, download_count: 4200,
        created_at: '2023-04-15T00:00:00Z', standard: 'GRI + TCFD', esg_score: 79,
    },
    {
        id: 'us-google-2023', resource_id: 'res-us-02',
        title: 'Google (Alphabet) Environmental Report 2023',
        title_zh: 'Google (Alphabet) 2023 環境報告',
        category: 'Report', region: 'USA', year: '2023',
        author: 'Alphabet Inc.', tags: ['USA_10', 'Innovation', 'Zero_Carbon', 'AI_Energy'],
        description: 'Alphabet\'s road to carbon-free energy by 2030 and responsible AI energy use.',
        description_zh: 'Alphabet 2030 碳中和路線圖：24/7 無碳能源目標與負責任 AI 基礎設施能耗管理。',
        is_featured: true, view_count: 11200, download_count: 5600,
        created_at: '2023-06-01T00:00:00Z', standard: 'GRI + TCFD + ISSB', esg_score: 93,
    },
    {
        id: 'us-nvidia-2023', resource_id: 'res-us-03',
        title: 'NVIDIA: AI for Energy Efficiency',
        title_zh: 'NVIDIA: AI 驅動能效提升報告',
        category: 'Report', region: 'USA', year: '2023',
        author: 'NVIDIA', tags: ['USA_10', 'Innovation', 'AI_Chip', 'Energy_Efficiency'],
        description: 'NVIDIA\'s CSR report covering GPU energy efficiency gains and data center power optimization.',
        description_zh: 'NVIDIA 的企業社會責任報告，聚焦 GPU 能源效率提升與數據中心電力優化。',
        is_featured: false, view_count: 7600, download_count: 3100,
        created_at: '2023-07-20T00:00:00Z', standard: 'GRI + SASB', esg_score: 87,
    },
    {
        id: 'us-microsoft-2023', resource_id: 'res-us-04',
        title: 'Microsoft 2023 Sustainability Report',
        title_zh: 'Microsoft 2023 永續報告',
        category: 'Report', region: 'USA', year: '2023',
        author: 'Microsoft', tags: ['USA_10', 'Carbon_Negative', 'Water_Positive', 'Cloud'],
        description: 'Microsoft\'s 2030 goals: carbon negative, water positive, and zero-waste.',
        description_zh: 'Microsoft 的 2030 淨零承諾：碳負、水資源正效益、零廢棄物三大目標進展。',
        is_featured: false, view_count: 8900, download_count: 3800,
        created_at: '2023-08-01T00:00:00Z', standard: 'GRI + TCFD + ISSB', esg_score: 94,
    },
];

// ─── 法規庫 ──────────────────────────────────────────────────────────
const REGULATIONS: ISustainabilityResource[] = [
    {
        id: 'reg-fsc-2026', resource_id: 'res-reg-fsc',
        title: 'FSC: 2026 Listed Company Sustainability Action Plan',
        title_zh: '金管會: 2026 上市櫃公司永續發展行動方案',
        category: 'Regulation', region: 'Taiwan', year: '2026',
        author: 'FSC (金融監督管理委員會)', tags: ['Regulation', 'Action_Plan', 'Taiwan', 'Mandatory'],
        description: 'Taiwan\'s 5-year regulatory blueprint mandating ESG reporting for listed companies by 2026.',
        description_zh: '台灣未來五年的永續監管藍圖，規範所有上市上櫃公司強制揭露 ESG 資訊的時間表與格式。',
        is_featured: true, view_count: 15200, download_count: 8900,
        created_at: '2023-03-01T00:00:00Z', standard: 'GRI + SASB + TCFD', esg_score: 100,
        url: 'https://www.fsc.gov.tw/ch/home.jsp?id=1010&parentpath=0,10',
    },
    {
        id: 'reg-csrd-2024', resource_id: 'res-reg-csrd',
        title: 'EU CSRD: Corporate Sustainability Reporting Directive',
        title_zh: '歐盟 CSRD 企業永續報告指令',
        category: 'Regulation', region: 'EU', year: '2024',
        author: 'European Commission', tags: ['Regulation', 'CSRD', 'EU', 'Mandatory', 'ESRS'],
        description: 'The EU\'s CSRD requires sustainability reporting from ~50,000 companies starting 2024.',
        description_zh: '歐盟 CSRD 指令自 2024 年起要求約 5 萬家企業強制揭露 ESRS 標準的永續資訊。',
        is_featured: true, view_count: 12400, download_count: 6700,
        created_at: '2023-01-05T00:00:00Z', standard: 'ESRS', esg_score: 100,
        url: 'https://finance.ec.europa.eu/capital-markets-union-and-financial-programmes/financial-reporting-and-auditing/sustainability-reporting_en',
    },
    {
        id: 'reg-issb-s1s2-2023', resource_id: 'res-reg-issb',
        title: 'ISSB IFRS S1 & S2 — Global Baseline Standards',
        title_zh: 'ISSB IFRS S1 & S2 全球基線標準',
        category: 'Regulation', region: 'Global', year: '2023',
        author: 'IFRS Foundation / ISSB', tags: ['Regulation', 'ISSB', 'IFRS', 'Global_Baseline', 'Climate'],
        description: 'IFRS S1 (general sustainability disclosures) and S2 (climate-related disclosures) issued by ISSB.',
        description_zh: 'ISSB 發布 IFRS S1 (一般永續揭露) 與 S2 (氣候相關揭露)，成為全球永續報告基線標準。',
        is_featured: true, view_count: 18900, download_count: 10200,
        created_at: '2023-06-26T00:00:00Z', standard: 'ISSB / IFRS', esg_score: 100,
        url: 'https://www.ifrs.org/groups/international-sustainability-standards-board/',
    },
];

// ─── 範本庫 ──────────────────────────────────────────────────────────
const TEMPLATES: ISustainabilityResource[] = [
    {
        id: 'tmp-gri-omnisync', resource_id: 'res-tmp-gri',
        title: 'GRI Universal Standard Template (OmniSync Enhanced)',
        title_zh: 'GRI Standard 全功能空白範本 (OmniSync 增強版)',
        category: 'Template', region: 'Global', year: '2024',
        author: 'OmniSync', tags: ['Template', 'Quick_Start', 'GRI', '5T_Hooks', 'Auto_Fill'],
        description: 'A complete GRI Universal Standard reporting template with embedded 5T data hooks for automated data ingestion.',
        description_zh: '一鍵導入的標準化空白 GRI 報告範本，內建 5T 數據鉤子，支援自動化資料填充與 AI 敘事生成。',
        is_featured: true, view_count: 22000, download_count: 14500,
        created_at: '2024-01-01T00:00:00Z', standard: 'GRI Universal + 5T Protocol', esg_score: 99,
    },
    {
        id: 'tmp-tcfd-report', resource_id: 'res-tmp-tcfd',
        title: 'TCFD 4-Pillar Disclosure Template',
        title_zh: 'TCFD 四大支柱氣候財務揭露範本',
        category: 'Template', region: 'Global', year: '2024',
        author: 'OmniSync', tags: ['Template', 'TCFD', 'Climate_Risk', 'Finance'],
        description: 'TCFD-aligned template covering Governance, Strategy, Risk Management, and Metrics & Targets.',
        description_zh: 'TCFD 對齊範本，涵蓋治理、策略、風險管理、指標與目標四大支柱完整框架。',
        is_featured: false, view_count: 9800, download_count: 5200,
        created_at: '2024-01-01T00:00:00Z', standard: 'TCFD', esg_score: 98,
    },
    {
        id: 'tmp-sasb-sector', resource_id: 'res-tmp-sasb',
        title: 'SASB Industry-Specific Disclosure Matrix',
        title_zh: 'SASB 產業別揭露矩陣範本',
        category: 'Template', region: 'Global', year: '2024',
        author: 'OmniSync', tags: ['Template', 'SASB', 'Industry_Specific', 'Investor_Grade'],
        description: 'SASB matrix template for 77 industries, enabling investor-grade sector-specific disclosures.',
        description_zh: 'SASB 涵蓋 77 個產業的揭露矩陣範本，適合投資人級別的產業別財務重大性揭露。',
        is_featured: false, view_count: 7200, download_count: 3900,
        created_at: '2024-01-01T00:00:00Z', standard: 'SASB', esg_score: 97,
    },
];

// ─── 完整資料庫 ───────────────────────────────────────────────────────
export const SUSTAINABILITY_LIBRARY_DB: ISustainabilityResource[] = [
    ...YEARBOOKS,
    ...TW_REPORTS,
    ...US_REPORTS,
    ...REGULATIONS,
    ...TEMPLATES,
];

// ─── 統計摘要 ─────────────────────────────────────────────────────────
export interface ILibraryStats {
    total: number;
    byCategory: Record<ResourceCategory, number>;
    byRegion: Record<string, number>;
    totalDownloads: number;
    totalViews: number;
    yearsSpanned: number;
}

export function getLibraryStats(): ILibraryStats {
    const db = SUSTAINABILITY_LIBRARY_DB;
    return {
        total: db.length,
        byCategory: {
            Yearbook: db.filter(r => r.category === 'Yearbook').length,
            Report: db.filter(r => r.category === 'Report').length,
            Regulation: db.filter(r => r.category === 'Regulation').length,
            Template: db.filter(r => r.category === 'Template').length,
            CaseStudy: 0,
        },
        byRegion: {
            Global: db.filter(r => r.region === 'Global').length,
            Taiwan: db.filter(r => r.region === 'Taiwan').length,
            USA: db.filter(r => r.region === 'USA').length,
            EU: db.filter(r => r.region === 'EU').length,
        },
        totalDownloads: db.reduce((s, r) => s + r.download_count, 0),
        totalViews: db.reduce((s, r) => s + r.view_count, 0),
        yearsSpanned: 10,
    };
}
