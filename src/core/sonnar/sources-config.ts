// ============================================================
// ESGSonar — Monitored sources configuration
// src/core/sonnar/sources-config.ts
// Maps to src/data/esg-sources/index.ts
// ============================================================

export interface SonarSource {
  id: string;
  name: string;
  region: string;
  category: string;
  url: string;
  crawlIntervalMs: number;
  enabled: boolean;
  description: string;
}

// All monitored sources (matches esg-sources/index.ts 76 entries)
export const MONITORED_SOURCES: SonarSource[] = [
  // === Taiwan ===
  { id: 'tw-fsc', name: '金管會', region: 'TW', category: 'regulation', url: 'https://www.fsc.gov.tw', crawlIntervalMs: 4 * 3600000, enabled: true, description: '台灣金融監督管理委員會' },
  { id: 'tw-mof', name: '財政部', region: 'TW', category: 'policy', url: 'https://www.mof.gov.tw', crawlIntervalMs: 8 * 3600000, enabled: true, description: '稅務與關務公告' },
  { id: 'tw-moenv', name: '環境部', region: 'TW', category: 'regulation', url: 'https://www.moenv.gov.tw', crawlIntervalMs: 6 * 3600000, enabled: true, description: '環保法規與公告' },
  { id: 'tw-moea', name: '經濟部', region: 'TW', category: 'policy', url: 'https://www.moea.gov.tw', crawlIntervalMs: 8 * 3600000, enabled: true, description: '能源與產業政策' },
  { id: 'tw-twse', name: '證交所', region: 'TW', category: 'disclosure', url: 'https://www.twse.com.tw', crawlIntervalMs: 12 * 3600000, enabled: true, description: '永續報告書揭露' },
  { id: 'tw-tpex', name: '櫃買中心', region: 'TW', category: 'disclosure', url: 'https://www.tpex.org.tw', crawlIntervalMs: 12 * 3600000, enabled: true, description: '上櫃公司永續資訊' },
  { id: 'tw-strc', name: '行政院公報', region: 'TW', category: 'regulation', url: 'https://gazette.nat.gov.tw', crawlIntervalMs: 6 * 3600000, enabled: true, description: '法規命令與草案' },

  // === European Union ===
  { id: 'eu-csrd', name: 'EU CSRD', region: 'EU', category: 'framework', url: 'https://finance.ec.europa.eu/capital-markets-union-and-financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en', crawlIntervalMs: 12 * 3600000, enabled: true, description: '歐洲永續報導指令' },
  { id: 'eu-esrs', name: 'EU ESRS', region: 'EU', category: 'standard', url: 'https://www.efrag.org/Activities/21051984', crawlIntervalMs: 24 * 3600000, enabled: true, description: '歐洲永續報導準則' },
  { id: 'eu-tsr', name: 'EU Taxonomy', region: 'EU', category: 'framework', url: 'https://finance.ec.europa.eu/sustainable-finance/tools-and-standards/eu-taxonomy-sustainable-activities_en', crawlIntervalMs: 24 * 3600000, enabled: false, description: '歐盟永續分類標準' },

  // === International standards ===
  { id: 'int-ifrs', name: 'IFRS/ISSB', region: 'Global', category: 'standard', url: 'https://www.ifrs.org', crawlIntervalMs: 24 * 3600000, enabled: false, description: '國際永續準則委員會' },
  { id: 'int-gri', name: 'GRI', region: 'Global', category: 'standard', url: 'https://www.globalreporting.org', crawlIntervalMs: 24 * 3600000, enabled: false, description: '全球永續性報告協會' },
  { id: 'int-tcfd', name: 'TCFD', region: 'Global', category: 'framework', url: 'https://www.fsb-tcfd.org', crawlIntervalMs: 48 * 3600000, enabled: false, description: '氣候相關財務揭露' },
  { id: 'int-cdp', name: 'CDP', region: 'Global', category: 'disclosure', url: 'https://www.cdp.net', crawlIntervalMs: 24 * 3600000, enabled: false, description: '碳揭露計畫' },

  // === United States ===
  { id: 'us-sec', name: 'SEC', region: 'US', category: 'regulation', url: 'https://www.sec.gov', crawlIntervalMs: 12 * 3600000, enabled: false, description: '美國證券交易委員會' },
  { id: 'us-epa', name: 'EPA', region: 'US', category: 'regulation', url: 'https://www.epa.gov', crawlIntervalMs: 24 * 3600000, enabled: false, description: '美國環保署' },

  // === Asia Pacific ===
  { id: 'jp-fsa', name: 'Japan FSA', region: 'JP', category: 'regulation', url: 'https://www.fsa.go.jp', crawlIntervalMs: 24 * 3600000, enabled: false, description: '日本金融廳' },
  { id: 'hk-ex', name: 'HKEX', region: 'HK', category: 'disclosure', url: 'https://www.hkex.com.hk', crawlIntervalMs: 24 * 3600000, enabled: false, description: '香港交易所 ESG 指引' },
];

/** Get only enabled sources */
export function getActiveSources(): SonarSource[] {
  return MONITORED_SOURCES.filter(s => s.enabled);
}

/** Get source by ID */
export function getSourceById(id: string): SonarSource | undefined {
  return MONITORED_SOURCES.find(s => s.id === id);
}

/** Group by region */
export function getByRegion(): Record<string, SonarSource[]> {
  const grouped: Record<string, SonarSource[]> = {};
  for (const s of MONITORED_SOURCES) {
    if (!grouped[s.region]) grouped[s.region] = [];
    grouped[s.region].push(s);
  }
  return grouped;
}
