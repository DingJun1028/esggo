/**
 * 💡 企業情資服務
 * Company Intelligence Service
 * 
 * 透過企業網址或名稱查詢相關的企業履歷資訊
 */

import axios from 'axios';

// ============== 企業履歷類型 ==============
export interface CompanyProfile {
    id: string;
    name: string;
    nameZh: string;
    nameEn: string;
    website: string;
    industry: string;
    headquarters: string;
    founded: number;
    employees: string;
    description: string;
    esgRating?: string;
    sustainabilityReports?: string[];
    certifications?: string[];
    riskLevel: 1 | 2 | 3 | 4 | 5;
    lastUpdated: number;
}

// ============== 模擬企業資料庫 ==============
// 使用固定時間戳記以確保確定的測試資料
const MOCK_TIMESTAMP = 1709888000000; // 2024-03-08T12:00:00Z

const MOCK_COMPANIES: CompanyProfile[] = [
    {
        id: 'tsmc',
        name: 'tsmc.com',
        nameZh: '台灣積體電路製造股份有限公司',
        nameEn: 'Taiwan Semiconductor Manufacturing Company',
        website: 'https://www.tsmc.com',
        industry: '半導體製造',
        headquarters: '台灣新竹',
        founded: 1987,
        employees: '70,000+',
        description: '全球最大的專業積體電路製造服務公司，專注於晶圓代工。',
        esgRating: 'A+',
        sustainabilityReports: ['2024永續報告', '2023氣候報告'],
        certifications: ['ISO 14001', 'ISO 45001', 'ISO 27001'],
        riskLevel: 2,
        lastUpdated: MOCK_TIMESTAMP
    },
    {
        id: 'foxconn',
        name: 'foxconn.com',
        nameZh: '鴻海精密工業股份有限公司',
        nameEn: 'Foxconn Technology Group',
        website: 'https://www.foxconn.com',
        industry: '電子製造',
        headquarters: '台灣新北',
        founded: 1974,
        employees: '800,000+',
        description: '全球最大的電子產品代工製造商。',
        esgRating: 'A',
        sustainabilityReports: ['2024永續報告'],
        certifications: ['ISO 14001', 'RBA VAP'],
        riskLevel: 3,
        lastUpdated: MOCK_TIMESTAMP
    },
    {
        id: 'alibaba',
        name: 'alibaba.com',
        nameZh: '阿里巴巴集團控股有限公司',
        nameEn: 'Alibaba Group Holding Limited',
        website: 'https://www.alibaba.com',
        industry: '電子商務/雲端運算',
        headquarters: '中國杭州',
        founded: 1999,
        employees: '250,000+',
        description: '全球領先的電子商務和雲端運算公司。',
        esgRating: 'BBB',
        sustainabilityReports: ['2024環境報告'],
        certifications: ['ISO 27001', 'ISO 14001'],
        riskLevel: 3,
        lastUpdated: MOCK_TIMESTAMP
    },
    {
        id: 'google',
        name: 'google.com',
        nameZh: '谷歌有限責任公司',
        nameEn: 'Google LLC',
        website: 'https://www.google.com',
        industry: '網路服務/雲端運算',
        headquarters: '美國加州',
        founded: 1998,
        employees: '180,000+',
        description: '全球最大的搜尋引擎和雲端服務提供商。',
        esgRating: 'A',
        sustainabilityReports: ['2024環境報告', '碳中和報告'],
        certifications: ['ISO 14001', 'ISO 50001', 'LEED'],
        riskLevel: 1,
        lastUpdated: MOCK_TIMESTAMP
    },
    {
        id: 'apple',
        name: 'apple.com',
        nameZh: '蘋果公司',
        nameEn: 'Apple Inc.',
        website: 'https://www.apple.com',
        industry: '消費電子/軟體服務',
        headquarters: '美國加州',
        founded: 1976,
        employees: '160,000+',
        description: '全球領先的消費電子產品和軟體服務公司。',
        esgRating: 'A+',
        sustainabilityReports: ['2024環境進度報告'],
        certifications: ['ISO 14001', 'ISO 45001'],
        riskLevel: 1,
        lastUpdated: MOCK_TIMESTAMP
    },
    {
        id: 'microsoft',
        name: 'microsoft.com',
        nameZh: '微軟股份有限公司',
        nameEn: 'Microsoft Corporation',
        website: 'https://www.microsoft.com',
        industry: '軟體/雲端運算',
        headquarters: '美國華盛頓',
        founded: 1975,
        employees: '220,000+',
        description: '全球領先的軟體和雲端服務提供商。',
        esgRating: 'A+',
        sustainabilityReports: ['2024永續報告', '碳負排放報告'],
        certifications: ['ISO 14001', 'ISO 50001', 'LEED'],
        riskLevel: 1,
        lastUpdated: Date.now()
    },
    {
        id: 'bp',
        name: 'bp.com',
        nameZh: '英國石油公司',
        nameEn: 'BP plc',
        website: 'https://www.bp.com',
        industry: '能源',
        headquarters: '英國倫敦',
        founded: 1909,
        employees: '70,000+',
        description: '全球領先的能源公司，專注於油氣和可再生能源。',
        esgRating: 'A-',
        sustainabilityReports: ['2024永續報告'],
        certifications: ['ISO 14001', 'ISO 50001'],
        riskLevel: 3,
        lastUpdated: MOCK_TIMESTAMP
    },
    {
        id: 'shell',
        name: 'shell.com',
        nameZh: '殼牌石油公司',
        nameEn: 'Shell plc',
        website: 'https://www.shell.com',
        industry: '能源',
        headquarters: '英國倫敦',
        founded: 1907,
        employees: '80,000+',
        description: '全球領先的能源公司。',
        esgRating: 'A-',
        sustainabilityReports: ['2024能源轉型報告'],
        certifications: ['ISO 14001'],
        riskLevel: 3,
        lastUpdated: Date.now()
    },
    {
        id: 'patagonia',
        name: 'patagonia.com',
        nameZh: '巴塔哥尼亞公司',
        nameEn: 'Patagonia Inc.',
        website: 'https://www.patagonia.com',
        industry: '戶外服飾',
        headquarters: '美國加州',
        founded: 1973,
        employees: '5,000+',
        description: '以環保著稱的戶外服飾品牌，倡導永續消費。',
        esgRating: 'A+',
        sustainabilityReports: ['2024 Footprint Chronicles'],
        certifications: ['B Corp', 'Fair Trade Certified'],
        riskLevel: 1,
        lastUpdated: MOCK_TIMESTAMP
    },
    {
        id: 'interface',
        name: 'interface.com',
        nameZh: 'Interface公司',
        nameEn: 'Interface Inc.',
        website: 'https://www.interface.com',
        industry: '商用地毯/製造',
        headquarters: '美國喬治亞',
        founded: 1973,
        employees: '3,500+',
        description: '全球最大的商用地毯製造商，倡導循環經濟。',
        esgRating: 'A+',
        sustainabilityReports: ['2024 Climate Take Back Report'],
        certifications: ['B Corp', 'LEED', 'Cradle to Cradle'],
        riskLevel: 1,
        lastUpdated: Date.now()
    }
];

// ============== 企業情資服務類 ==============
export class CompanyIntelService {

    /**
     * 提取網域
     */
    private static extractDomain(input: string): string {
        try {
            // 如果已經是 URL，提取網域
            if (input.includes('://') || input.includes('www.')) {
                const url = input.startsWith('http') ? input : `https://${input}`;
                const parsed = new URL(url);
                return parsed.hostname.replace('www.', '');
            }
            // 否則假設是公司名稱
            return input.toLowerCase();
        } catch {
            return input.toLowerCase();
        }
    }

    /**
     * 透過網址或名稱查詢企業
     */
    static async searchCompany(query: string): Promise<CompanyProfile | null> {
        const normalizedQuery = this.extractDomain(query).toLowerCase();
        
        // 統一搜尋邏輯：優先精確匹配，其次部分匹配
        // 精確匹配條件
        const exactMatch = MOCK_COMPANIES.find(c => 
            c.website.includes(normalizedQuery) ||
            c.name.toLowerCase() === normalizedQuery ||
            c.id === normalizedQuery
        );
        
        if (exactMatch) {
            return exactMatch;
        }

        // 部分匹配條件
        const partialMatch = MOCK_COMPANIES.find(c => 
            c.nameZh.toLowerCase().includes(query.toLowerCase()) ||
            c.nameEn.toLowerCase().includes(normalizedQuery) ||
            c.id.includes(normalizedQuery)
        );

        return partialMatch || null;
    }

    /**
     * 取得所有企業列表
     */
    static getAllCompanies(): CompanyProfile[] {
        return MOCK_COMPANIES;
    }

    /**
     * 依產業分類取得企業
     */
    static getCompaniesByIndustry(industry: string): CompanyProfile[] {
        return MOCK_COMPANIES.filter(c => 
            c.industry.toLowerCase().includes(industry.toLowerCase())
        );
    }

    /**
     * 產生企業風險評估
     */
    static generateRiskAssessment(company: CompanyProfile): {
        score: number;
        factors: string[];
        recommendation: string;
    } {
        const factors: string[] = [];
        
        // 根據 ESG 評級計算
        if (company.esgRating) {
            const rating = company.esgRating.replace('+', '').replace('-', '');
            if (rating === 'A') factors.push('ESG 評級優秀');
            else if (rating === 'B') factors.push('ESG 評級中等');
            else if (rating === 'C') factors.push('ESG 評級需改進');
        }

        // 根據認證
        if (company.certifications?.length && company.certifications.length > 3) {
            factors.push('多項國際認證');
        }

        // 根據永續報告
        if (company.sustainabilityReports?.length && company.sustainabilityReports.length > 0) {
            factors.push('定期發布永續報告');
        }

        const recommendation = company.riskLevel <= 2 
            ? '建議建立長期合作關係，可作為策略夥伴'
            : company.riskLevel <= 3 
            ? '建議持續監控，定期評估風險變化'
            : '建議進行盡職調查，評估潛在風險';

        return {
            score: company.riskLevel,
            factors,
            recommendation
        };
    }
}

export default CompanyIntelService;