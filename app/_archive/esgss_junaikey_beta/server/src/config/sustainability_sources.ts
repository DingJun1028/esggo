/**
 * sustainability_sources.ts
 * -------------------------
 * Verified Sustainability Information Sources for Market Intelligence Center
 * Data categorization based on ESG Source Taxonomy (v1.0)
 */

export interface SustainabilitySource {
    id: string;
    name: string;
    nameTc: string;
    category: 'Global Governance' | 'Standards & Disclosure' | 'Think Tanks & Research' | 'Finance & Energy' | 'Industry & Technology';
    domain: string;
    authority: number; // 1-5, relative weight
    tags: string[];
}

export const SUSTAINABILITY_SOURCES: SustainabilitySource[] = [
    // --- Category: Global Governance (A) ---
    { id: 'un-sdgs', name: 'UN SDGs Knowledge Platform', nameTc: 'UN SDGs 知識平台', category: 'Global Governance', domain: 'sdgs.un.org', authority: 5, tags: ['SDG', 'Global Policy'] },
    { id: 'unep-org', name: 'UNEP', nameTc: '聯合國環境規劃署', category: 'Global Governance', domain: 'unep.org', authority: 5, tags: ['Environment', 'Climate'] },
    { id: 'unfccc-int', name: 'UNFCCC', nameTc: '聯合國氣候變遷框架公約', category: 'Global Governance', domain: 'unfccc.int', authority: 5, tags: ['Climate Policy', 'COP'] },
    { id: 'ipcc-ch', name: 'IPCC', nameTc: '氣候變遷專家小組', category: 'Global Governance', domain: 'ipcc.ch', authority: 5, tags: ['Climate Science', 'Assessment'] },
    { id: 'undp-org', name: 'UNDP', nameTc: '聯合國開發計畫署', category: 'Global Governance', domain: 'undp.org', authority: 5, tags: ['Sustainable Development', 'Governance'] },
    { id: 'worldbank-esg', name: 'World Bank', nameTc: '世界銀行', category: 'Global Governance', domain: 'worldbank.org', authority: 5, tags: ['ESG Data', 'Development Finance'] },
    { id: 'oecd-esg', name: 'OECD', nameTc: '經合組織', category: 'Global Governance', domain: 'oecd.org', authority: 5, tags: ['Policy Statistics', 'Governance'] },
    { id: 'fao-org', name: 'FAO', nameTc: '聯合國糧農組織', category: 'Global Governance', domain: 'fao.org', authority: 4, tags: ['Agri-food', 'Natural Capital'] },
    { id: 'ilo-org', name: 'ILO', nameTc: '國際勞工組織', category: 'Global Governance', domain: 'ilo.org', authority: 4, tags: ['Labor Rights', 'Social Responsibility'] },
    { id: 'iisd-sdg', name: 'IISD SDG Knowledge Hub', nameTc: 'IISD SDG 知識中心', category: 'Global Governance', domain: 'sdg.iisd.org', authority: 4, tags: ['SDG News', 'Policy Analysis'] },

    // --- Category: Think Tanks & Research (B) ---
    { id: 'wri-org', name: 'WRI', nameTc: '世界資源研究所', category: 'Think Tanks & Research', domain: 'wri.org', authority: 4, tags: ['Climate Policy', 'Data Tools'] },
    { id: 'wwf-org', name: 'WWF', nameTc: '世界自然基金會', category: 'Think Tanks & Research', domain: 'worldwildlife.org', authority: 4, tags: ['Biodiversity', 'Conservation'] },
    { id: 'iucn-org', name: 'IUCN', nameTc: '國際自然保護聯盟', category: 'Think Tanks & Research', domain: 'iucn.org', authority: 4, tags: ['Nature Policy', 'Red List'] },
    { id: 'stockholm-resilience', name: 'Stockholm Resilience Centre', nameTc: '斯德哥爾摩韌性中心', category: 'Think Tanks & Research', domain: 'stockholmresilience.org', authority: 4, tags: ['Planetary Boundaries', 'Systems'] },
    { id: 'potsdam-climate', name: 'Potsdam Climate Institute', nameTc: '波茨坦氣候研究所', category: 'Think Tanks & Research', domain: 'pik-potsdam.de', authority: 4, tags: ['Climate Risk', 'Modeling'] },
    { id: 'yale-e360', name: 'Yale Environment 360', nameTc: '耶魯環境360', category: 'Think Tanks & Research', domain: 'e360.yale.edu', authority: 4, tags: ['Environment Analysis', 'Commentary'] },
    { id: 'mit-climate', name: 'MIT Climate Portal', nameTc: 'MIT氣候入口', category: 'Think Tanks & Research', domain: 'climate.mit.edu', authority: 4, tags: ['Climate Tech', 'Science Communication'] },
    { id: 'cambridge-sust', name: 'Cambridge Sustainability Commission', nameTc: '劍橋永續委員會', category: 'Think Tanks & Research', domain: 'cam.ac.uk', authority: 4, tags: ['Research', 'Academic Policy'] },
    { id: 'nber-eee', name: 'NBER Environmental & Energy Economics', nameTc: 'NBER環境與能源經濟', category: 'Think Tanks & Research', domain: 'nber.org', authority: 4, tags: ['Economics', 'Energy'] },
    { id: 'chatham-house', name: 'Chatham House', nameTc: '皇家國際研究所', category: 'Think Tanks & Research', domain: 'chathamhouse.org', authority: 4, tags: ['International Affairs', 'Geopolitics'] },

    // --- Category: Standards & Disclosure (C) ---
    { id: 'ifrs-issb', name: 'IFRS Foundation / ISSB', nameTc: 'IFRS基金會/ISSB', category: 'Standards & Disclosure', domain: 'ifrs.org', authority: 5, tags: ['Reporting Standards', 'Disclosure'] },
    { id: 'cdp-net', name: 'CDP', nameTc: '碳揭露專案', category: 'Standards & Disclosure', domain: 'cdp.net', authority: 5, tags: ['Environmental Disclosure', 'Climate'] },
    { id: 'tcfd-fsb', name: 'TCFD', nameTc: '氣候相關財務揭露', category: 'Standards & Disclosure', domain: 'fsb-tcfd.org', authority: 5, tags: ['Financial Disclosure', 'Climate Risk'] },
    { id: 'tnfd-global', name: 'TNFD', nameTc: '自然相關財務揭露', category: 'Standards & Disclosure', domain: 'tnfd.global', authority: 5, tags: ['Nature Disclosure', 'Financial Impact'] },
    { id: 'sbti-org', name: 'SBTi', nameTc: '科學基礎減量目標倡議', category: 'Standards & Disclosure', domain: 'sciencebasedtargets.org', authority: 5, tags: ['Emissions Reduction', 'Verification'] },
    { id: 'pri-un', name: 'PRI', nameTc: '責任投資原則', category: 'Standards & Disclosure', domain: 'unpri.org', authority: 5, tags: ['Responsible Investment', 'Finance'] },
    { id: 'gfanz-zero', name: 'GFANZ', nameTc: '淨零金融聯盟', category: 'Standards & Disclosure', domain: 'gfanzero.com', authority: 4, tags: ['Net Zero', 'Finance Coalition'] },
    { id: 'climate-policy-initiative', name: 'Climate Policy Initiative', nameTc: '氣候政策倡議', category: 'Standards & Disclosure', domain: 'climatepolicyinitiative.org', authority: 4, tags: ['Climate Finance', 'Policy Tracking'] },
    { id: 'gri-global', name: 'GRI', nameTc: '全球永續報告準則', category: 'Standards & Disclosure', domain: 'globalreporting.org', authority: 5, tags: ['Sustainability Reporting', 'GRI Standards'] },
    { id: 'sasb-org', name: 'SASB Standards', nameTc: 'SASB標準', category: 'Standards & Disclosure', domain: 'sasb.org', authority: 5, tags: ['Accounting Standards', 'Industry Metrics'] },
    { id: 'wef-org', name: 'WEF', nameTc: '世界經濟論壇', category: 'Standards & Disclosure', domain: 'weforum.org', authority: 5, tags: ['Global Trends', 'Economic Forum'] },

    // --- S4 & S5 (Extended) ---
    { id: 'iea-energy', name: 'International Energy Agency', nameTc: '國際能源署', category: 'Finance & Energy', domain: 'iea.org', authority: 5, tags: ['Energy Transition', 'Scenarios'] },
    { id: 'ngfs-net', name: 'NGFS', nameTc: '央行與監管機構綠色金融網絡', category: 'Finance & Energy', domain: 'ngfs.net', authority: 5, tags: ['Central Banking', 'Stability'] },
    { id: 'semi-org', name: 'SEMI', nameTc: '國際半導體產業協會', category: 'Industry & Technology', domain: 'semi.org', authority: 4, tags: ['Semiconductor', 'Supply Chain'] },
    { id: 'imec-int', name: 'imec', nameTc: '比利時微電子研究中心', category: 'Industry & Technology', domain: 'imec-int.com', authority: 4, tags: ['Nanotech', 'R&D'] },
    { id: 'tsmc-portal', name: 'TSMC ESG Portal', nameTc: '台積電 ESG 門戶', category: 'Industry & Technology', domain: 'tsmc.com', authority: 4, tags: ['Industrial ESG', 'Operations'] },

    // --- Category: Taiwan Local & Specialized (D) ---
    { id: 'csr-cw', name: 'CSR@天下', nameTc: 'CSR@天下', category: 'Think Tanks & Research', domain: 'csr.cw.com.tw', authority: 4, tags: ['Taiwan ESG', 'Corporate Success'] },
    { id: 'taise-org', name: 'TAISE', nameTc: '台灣永續能源研究基金會', category: 'Think Tanks & Research', domain: 'taise.org.tw', authority: 4, tags: ['Energy Research', 'Sustainability Awards'] },
    { id: 'moea-green', name: 'Green Trade Project Office', nameTc: '經濟部綠色貿易資訊網', category: 'Global Governance', domain: 'greentrade.org.tw', authority: 4, tags: ['Green Trade', 'Policy'] },
    { id: 'sdgs-tw', name: 'SDGs Taiwan', nameTc: '永續發展目標 (SDGs) 台灣', category: 'Global Governance', domain: 'sdgs.tw', authority: 4, tags: ['SDG', 'Local Implementation'] },
    { id: 'ctee-esg', name: 'Commercial Times ESG', nameTc: '工商時報 ESG 頻道', category: 'Finance & Energy', domain: 'ctee.com.tw', authority: 3, tags: ['Market News', 'Business'] },
    { id: 'money-udn-esg', name: 'Economic Daily News ESG', nameTc: '經濟日報 ESG 頻道', category: 'Finance & Energy', domain: 'money.udn.com', authority: 3, tags: ['Economic Impact', 'Market Analysis'] }
];

