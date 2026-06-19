/**
 * ESGSonar Sources Configuration
 * 
 * ESG 法規監測系統的資料來源配置
 * 包含政府機關、國際組織、監管機構等來源
 */

// 來源類型 (對應 Prisma SourceType enum)
export type SourceTypeEnum = 
  | 'GOVERNMENT'
  | 'REGULATORY'
  | 'INTERNATIONAL'
  | 'THIRD_PARTY'
  | 'COMPANY'
  | 'OTHER';

// ============================================
// 來源定義
// ============================================

export interface SourceConfig {
    id: string;
    name: string;
    nameEn: string;
    url: string;
    type: SourceTypeEnum;
    authority?: string;
    country: string;
    region: 'TW' | 'EU' | 'US' | 'CN' | 'JP' | 'GLOBAL';
    category: string[];
    crawlConfig: CrawlConfig;
    description?: string;
    isActive: boolean;
}

export interface CrawlConfig {
    selector?: string;
    apiEndpoint?: string;
    rateLimit?: number;
    retryCount?: number;
    timeout?: number;
    headers?: Record<string, string>;
}

// ============================================
// 台灣來源
// ============================================

export const TAIWAN_SOURCES: SourceConfig[] = [
    {
        id: 'tw-fsc',
        name: '金融監督管理委員會',
        nameEn: 'Financial Supervisory Commission (FSC)',
        url: 'https://www.fsc.gov.tw',
        type: 'REGULATORY',
        authority: '金融監督管理委員會',
        country: '台灣',
        region: 'TW',
        category: ['governance', 'disclosure', 'taxonomy'],
        crawlConfig: {
            selector: '.news-list, .law-list',
            rateLimit: 1000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '台灣金融監管機關，負責金融機構監理及資本市場法規',
        isActive: true,
    },
    {
        id: 'tw-epa',
        name: '環境保護署',
        nameEn: 'Environmental Protection Administration (EPA)',
        url: 'https://www.epa.gov.tw',
        type: 'GOVERNMENT',
        authority: '環境保護署',
        country: '台灣',
        region: 'TW',
        category: ['environmental'],
        crawlConfig: {
            selector: '.news-content, .regulations',
            rateLimit: 1000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '台灣環境保護主管機關',
        isActive: true,
    },
    {
        id: 'tw-moenv',
        name: '環境部',
        nameEn: 'Ministry of Environment (MOENV)',
        url: 'https://www.moenv.gov.tw',
        type: 'GOVERNMENT',
        authority: '環境部',
        country: '台灣',
        region: 'TW',
        category: ['environmental', 'taxonomy'],
        crawlConfig: {
            selector: '.news-list, .law-list',
            rateLimit: 1000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '台灣環境保護主管機關（2023改制）',
        isActive: true,
    },
    {
        id: 'tw-moea',
        name: '經濟部',
        nameEn: 'Ministry of Economic Affairs (MOEA)',
        url: 'https://www.moea.gov.tw',
        type: 'GOVERNMENT',
        authority: '經濟部',
        country: '台灣',
        region: 'TW',
        category: ['environmental', 'social'],
        crawlConfig: {
            selector: '.news, .announcement',
            rateLimit: 1000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '台灣經濟產業主管機關',
        isActive: true,
    },
    {
        id: 'tw-gazette',
        name: '行政院公報',
        nameEn: 'Executive Yuan Gazette',
        url: 'https://gazette.nat.gov.tw',
        type: 'GOVERNMENT',
        authority: '行政院',
        country: '台灣',
        region: 'TW',
        category: ['governance', 'environmental', 'social', 'disclosure'],
        crawlConfig: {
            apiEndpoint: 'https://gazette.nat.gov.tw/api/v1',
            rateLimit: 500,
            retryCount: 3,
            timeout: 30000,
        },
        description: '台灣政府公報系統，收錄所有法規命令',
        isActive: true,
    },
    {
        id: 'tw-twse',
        name: '證券交易所',
        nameEn: 'Taiwan Stock Exchange (TWSE)',
        url: 'https://www.twse.com.tw',
        type: 'REGULATORY',
        authority: '金融監督管理委員會',
        country: '台灣',
        region: 'TW',
        category: ['disclosure', 'governance'],
        crawlConfig: {
            selector: '.news, .announcement',
            rateLimit: 1000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '台灣證券交易所，負責上市公司監理',
        isActive: true,
    },
    {
        id: 'tw-tpe',
        name: '櫃檯買賣中心',
        nameEn: 'Taipei Exchange (TPEx)',
        url: 'https://www.tpex.org.tw',
        type: 'REGULATORY',
        authority: '金融監督管理委員會',
        country: '台灣',
        region: 'TW',
        category: ['disclosure', 'governance'],
        crawlConfig: {
            selector: '.news, .bulletin',
            rateLimit: 1000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '台灣櫃檯買賣中心，負責上櫃公司監理',
        isActive: true,
    },
];

// ============================================
// 國際來源
// ============================================

export const INTERNATIONAL_SOURCES: SourceConfig[] = [
    {
        id: 'eu-csrd',
        name: '歐盟企業永續報告指令',
        nameEn: 'EU Corporate Sustainability Reporting Directive (CSRD)',
        url: 'https://finance.ec.europa.eu',
        type: 'INTERNATIONAL',
        authority: 'European Commission',
        country: '歐盟',
        region: 'EU',
        category: ['disclosure', 'taxonomy'],
        crawlConfig: {
            selector: '.news, .policy',
            rateLimit: 2000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '歐盟企業永續報告指令(CSRD)官網',
        isActive: true,
    },
    {
        id: 'eu-taxonomy',
        name: '歐盟永續金融分類法',
        nameEn: 'EU Taxonomy Regulation',
        url: 'https://finance.ec.europa.eu/sustainable-finance/taxonomy',
        type: 'INTERNATIONAL',
        authority: 'European Commission',
        country: '歐盟',
        region: 'EU',
        category: ['taxonomy', 'environmental'],
        crawlConfig: {
            selector: '.content, .article',
            rateLimit: 2000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '歐盟永續金融分類法官方資訊',
        isActive: true,
    },
    {
        id: 'eu-esrs',
        name: '歐盟永續報告標準',
        nameEn: 'European Sustainability Reporting Standards (ESRS)',
        url: 'https://www.efrag.org',
        type: 'INTERNATIONAL',
        authority: 'EFRAG',
        country: '歐盟',
        region: 'EU',
        category: ['disclosure', 'environmental', 'social', 'governance'],
        crawlConfig: {
            selector: '.publication, .standard',
            rateLimit: 2000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '歐盟永續報告標準(ESRS)制定機構',
        isActive: true,
    },
    {
        id: 'ifrs-sasb',
        name: 'IFRS 永續揭露標準',
        nameEn: 'IFRS Sustainability Standards',
        url: 'https://www.ifrs.org/sustainability',
        type: 'INTERNATIONAL',
        authority: 'IFRS Foundation',
        country: '國際',
        region: 'GLOBAL',
        category: ['disclosure', 'environmental', 'social', 'governance'],
        crawlConfig: {
            selector: '.content, .sustainability-standards',
            rateLimit: 2000,
            retryCount: 3,
            timeout: 30000,
        },
        description: 'IFRS 基金會永續揭露標準',
        isActive: true,
    },
    {
        id: 'gri-standards',
        name: 'GRI 永續報告標準',
        nameEn: 'GRI Standards',
        url: 'https://www.globalreporting.org',
        type: 'INTERNATIONAL',
        authority: 'Global Reporting Initiative',
        country: '國際',
        region: 'GLOBAL',
        category: ['disclosure', 'environmental', 'social'],
        crawlConfig: {
            selector: '.standards, .guidance',
            rateLimit: 2000,
            retryCount: 3,
            timeout: 30000,
        },
        description: 'GRI 永續報告標準',
        isActive: true,
    },
    {
        id: 'tcfd',
        name: '氣候變遷財務揭露',
        nameEn: 'Task Force on Climate-related Financial Disclosures (TCFD)',
        url: 'https://assets.bbhub.io',
        type: 'INTERNATIONAL',
        authority: 'TCFD',
        country: '國際',
        region: 'GLOBAL',
        category: ['disclosure', 'environmental', 'governance'],
        crawlConfig: {
            selector: '.recommendations',
            rateLimit: 2000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '氣候變遷財務揭露建議',
        isActive: true,
    },
    {
        id: 'cdsb',
        name: '氣候揭露標準委員會',
        nameEn: 'Climate Disclosure Standards Board',
        url: 'https://www.cdsb.net',
        type: 'INTERNATIONAL',
        authority: 'CDSB',
        country: '國際',
        region: 'GLOBAL',
        category: ['disclosure', 'environmental'],
        crawlConfig: {
            selector: '.framework, .standards',
            rateLimit: 2000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '氣候揭露標準委員會',
        isActive: true,
    },
    {
        id: 'us-sec',
        name: '美國證管會',
        nameEn: 'US Securities and Exchange Commission (SEC)',
        url: 'https://www.sec.gov',
        type: 'REGULATORY',
        authority: 'SEC',
        country: '美國',
        region: 'US',
        category: ['disclosure', 'governance'],
        crawlConfig: {
            selector: '.news, .rule-list',
            rateLimit: 1000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '美國證券交易委員會',
        isActive: true,
    },
    {
        id: 'us-cftc',
        name: '美國商品期貨交易委員會',
        nameEn: 'US Commodity Futures Trading Commission (CFTC)',
        url: 'https://www.cftc.gov',
        type: 'REGULATORY',
        authority: 'CFTC',
        country: '美國',
        region: 'US',
        category: ['disclosure', 'environmental'],
        crawlConfig: {
            selector: '.news, .releases',
            rateLimit: 1000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '美國商品期貨交易委員會',
        isActive: true,
    },
    {
        id: 'jp-fsa',
        name: '日本金融廳',
        nameEn: 'Japan Financial Services Agency (FSA)',
        url: 'https://www.fsa.go.jp',
        type: 'REGULATORY',
        authority: 'FSA',
        country: '日本',
        region: 'JP',
        category: ['disclosure', 'governance'],
        crawlConfig: {
            selector: '.news, .law',
            rateLimit: 1000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '日本金融廳',
        isActive: true,
    },
    {
        id: 'hk-exchanges',
        name: '香港交易所',
        nameEn: 'Hong Kong Exchanges and Clearing (HKEX)',
        url: 'https://www.hkex.com.hk',
        type: 'REGULATORY',
        authority: 'HKEX',
        country: '香港',
        region: 'CN',
        category: ['disclosure', 'governance'],
        crawlConfig: {
            selector: '.news, .announcement',
            rateLimit: 1000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '香港交易所',
        isActive: true,
    },
    {
        id: 'sse',
        name: '上海證券交易所',
        nameEn: 'Shanghai Stock Exchange (SSE)',
        url: 'http://www.sse.com.cn',
        type: 'REGULATORY',
        authority: 'CSRC',
        country: '中國',
        region: 'CN',
        category: ['disclosure', 'governance'],
        crawlConfig: {
            selector: '.news, .disclosure',
            rateLimit: 1000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '上海證券交易所',
        isActive: true,
    },
    {
        id: 'unisdr',
        name: '聯合國減災署',
        nameEn: 'UN Office for Disaster Risk Reduction (UNDRR)',
        url: 'https://www.undrr.org',
        type: 'INTERNATIONAL',
        authority: 'United Nations',
        country: '國際',
        region: 'GLOBAL',
        category: ['environmental', 'social'],
        crawlConfig: {
            selector: '.content, .publication',
            rateLimit: 2000,
            retryCount: 3,
            timeout: 30000,
        },
        description: '聯合國減災署',
        isActive: true,
    },
    {
        id: 'unfccc',
        name: '聯合國氣候變化框架公約',
        nameEn: 'United Nations Framework Convention on Climate Change',
        url: 'https://unfccc.int',
        type: 'INTERNATIONAL',
        authority: 'United Nations',
        country: '國際',
        region: 'GLOBAL',
        category: ['environmental', 'taxonomy'],
        crawlConfig: {
            selector: '.news, .resource',
            rateLimit: 2000,
            retryCount: 3,
            timeout: 30000,
        },
        description: 'UNFCCC 氣候變化框架公約',
        isActive: true,
    },
];

// ============================================
// 第三方來源
// ============================================

export const THIRD_PARTY_SOURCES: SourceConfig[] = [
    {
        id: 'msci-esg',
        name: 'MSCI ESG 評級',
        nameEn: 'MSCI ESG Ratings',
        url: 'https://www.msci.com/esg-ratings',
        type: 'THIRD_PARTY',
        authority: 'MSCI',
        country: '國際',
        region: 'GLOBAL',
        category: ['environmental', 'social', 'governance'],
        crawlConfig: {
            selector: '.esg-data',
            rateLimit: 5000,
            retryCount: 3,
            timeout: 30000,
        },
        description: 'MSCI ESG 評級服務',
        isActive: false, // 需要 API 存取
    },
    {
        id: 'sustainalytics',
        name: 'Sustainalytics 風險評級',
        nameEn: 'Morningstar Sustainalytics',
        url: 'https://www.sustainalytics.com',
        type: 'THIRD_PARTY',
        authority: 'Morningstar',
        country: '國際',
        region: 'GLOBAL',
        category: ['environmental', 'social', 'governance'],
        crawlConfig: {
            selector: '.esg-risk',
            rateLimit: 5000,
            retryCount: 3,
            timeout: 30000,
        },
        description: 'Sustainalytics ESG 風險評級',
        isActive: false, // 需要 API 存取
    },
    {
        id: 'cdp',
        name: 'CDP 碳揭露專案',
        nameEn: 'Carbon Disclosure Project',
        url: 'https://www.cdp.net',
        type: 'THIRD_PARTY',
        authority: 'CDP',
        country: '國際',
        region: 'GLOBAL',
        category: ['environmental'],
        crawlConfig: {
            selector: '.scores, .disclosure',
            rateLimit: 2000,
            retryCount: 3,
            timeout: 30000,
        },
        description: 'CDP 碳揭露專案',
        isActive: true,
    },
];

// ============================================
// 合併所有來源
// ============================================

export const ALL_SOURCES: SourceConfig[] = [
    ...TAIWAN_SOURCES,
    ...INTERNATIONAL_SOURCES,
    ...THIRD_PARTY_SOURCES,
];

// ============================================
// 工具函數
// ============================================

/**
 * 依區域取得來源
 */
export function getSourcesByRegion(region: string): SourceConfig[] {
    return ALL_SOURCES.filter(source => source.region === region);
}

/**
 * 依類型取得來源
 */
export function getSourcesByType(type: string): SourceConfig[] {
    return ALL_SOURCES.filter(source => source.type === type);
}

/**
 * 依分類取得來源
 */
export function getSourcesByCategory(category: string): SourceConfig[] {
    return ALL_SOURCES.filter(source =>
        source.category.includes(category)
    );
}

/**
 * 取得作用中的來源
 */
export function getActiveSources(): SourceConfig[] {
    return ALL_SOURCES.filter(source => source.isActive);
}

/**
 * 依 ID 取得來源
 */
export function getSourceById(id: string): SourceConfig | undefined {
    return ALL_SOURCES.find(source => source.id === id);
}

/**
 * 搜尋來源
 */
export function searchSources(query: string): SourceConfig[] {
    const lowerQuery = query.toLowerCase();
    return ALL_SOURCES.filter(source =>
        source.name.toLowerCase().includes(lowerQuery) ||
        source.nameEn.toLowerCase().includes(lowerQuery) ||
        source.authority?.toLowerCase().includes(lowerQuery) ||
        source.country.toLowerCase().includes(lowerQuery)
    );
}

// ============================================
// 爬蟲排程配置
// ============================================

export interface CrawlSchedule {
    sourceId: string;
    interval: number; // 秒
    priority: 'high' | 'medium' | 'low';
    enabled: boolean;
}

export const DEFAULT_SCHEDULE: CrawlSchedule[] = [
    // 高優先級 - 台灣法規來源
    { sourceId: 'tw-fsc', interval: 3600, priority: 'high', enabled: true },
    { sourceId: 'tw-gazette', interval: 3600, priority: 'high', enabled: true },
    { sourceId: 'tw-epa', interval: 7200, priority: 'high', enabled: true },

    // 中優先級 - 國際重要來源
    { sourceId: 'eu-csrd', interval: 7200, priority: 'medium', enabled: true },
    { sourceId: 'eu-esrs', interval: 7200, priority: 'medium', enabled: true },
    { sourceId: 'ifrs-sasb', interval: 7200, priority: 'medium', enabled: true },

    // 低優先級 - 其他來源
    { sourceId: 'gri-standards', interval: 86400, priority: 'low', enabled: true },
    { sourceId: 'cdp', interval: 86400, priority: 'low', enabled: true },
];

// ============================================
// 預設匯出
// ============================================

export default {
    TAIWAN_SOURCES,
    INTERNATIONAL_SOURCES,
    THIRD_PARTY_SOURCES,
    ALL_SOURCES,
    getSourcesByRegion,
    getSourcesByType,
    getSourcesByCategory,
    getActiveSources,
    getSourceById,
    searchSources,
    DEFAULT_SCHEDULE,
};