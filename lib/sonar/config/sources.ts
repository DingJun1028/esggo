/**
 * ESGSonar | Monitoring Source Configuration
 * Defines global and local ESG data sources.
 */

export interface ESGSource {
  id: string;
  name: string;
  region: 'TW' | 'EU' | 'US' | 'Global';
  type: 'Regulation' | 'Report' | 'Standard' | 'Third-Party';
  baseUrl: string;
  crawlerType: 'dynamic' | 'static';
  intervalHours: number;
  category: ('E' | 'S' | 'G')[];
}

export const ESG_SOURCES: ESGSource[] = [
  // Taiwan Sources
  {
    id: 'tw-fsc',
    name: '金管會法規查詢',
    region: 'TW',
    type: 'Regulation',
    baseUrl: 'https://law.fsc.gov.tw',
    crawlerType: 'static',
    intervalHours: 12,
    category: ['G']
  },
  {
    id: 'tw-moenv',
    name: '環境部主管法規查詢',
    region: 'TW',
    type: 'Regulation',
    baseUrl: 'https://law.moenv.gov.tw',
    crawlerType: 'static',
    intervalHours: 12,
    category: ['E']
  },
  {
    id: 'tw-twse',
    name: '證交所 ESG 平台',
    region: 'TW',
    type: 'Report',
    baseUrl: 'https://esg.twse.com.tw',
    crawlerType: 'dynamic',
    intervalHours: 24,
    category: ['E', 'S', 'G']
  },
  
  // Global Sources
  {
    id: 'eu-csrd',
    name: 'EU CSRD / ESRS Standards',
    region: 'EU',
    type: 'Standard',
    baseUrl: 'https://finance.ec.europa.eu',
    crawlerType: 'static',
    intervalHours: 48,
    category: ['E', 'S', 'G']
  },
  {
    id: 'global-gri',
    name: 'GRI Standards Update',
    region: 'Global',
    type: 'Standard',
    baseUrl: 'https://www.globalreporting.org',
    crawlerType: 'static',
    intervalHours: 72,
    category: ['E', 'S', 'G']
  },
  {
    id: 'us-sec',
    name: 'US SEC Climate Disclosure',
    region: 'US',
    type: 'Regulation',
    baseUrl: 'https://www.sec.gov',
    crawlerType: 'static',
    intervalHours: 24,
    category: ['E', 'G']
  }
];

export function getSourceById(id: string): ESGSource | undefined {
  return ESG_SOURCES.find(s => s.id === id);
}

export function getSourcesByRegion(region: string): ESGSource[] {
  return ESG_SOURCES.filter(s => s.region === region);
}
