/**
 * 💡 商業偵情中心 - S1-S5 情資聚合器
 * Business Reconnaissance Center - Intelligence Aggregator
 * 
 * 負責管理 30+ 源頭機構的情報收集與分類
 * 包含爬蟲、清洗、分類的完整資料處理流程
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { Intel5TGateway, IntelCategory, RawIntelInput, IIntelNode5T, INTEL_CATEGORY_LABELS } from '../../core/5t-protocol/intel-node';
import { OmniDataCleanser } from '../../core/omni-data-cleanser';

// ============== 源頭機構定義 (Source Institutions) ==============
export interface SourceInstitution {
    id: string;
    name: string;
    nameZh: string;
    category: IntelCategory;
    url: string;
    type: 'government' | 'standard' | 'thinktank' | 'finance' | 'industry';
}

/** 30+ 源頭機構清單 */
export const SOURCE_INSTITUTIONS: SourceInstitution[] = [
    // S1: 全球治理 (Global Governance)
    { id: 'un', name: 'United Nations', nameZh: '聯合國', category: 'S1', url: 'https://www.un.org', type: 'government' },
    { id: 'unfccc', name: 'UNFCCC', nameZh: '聯合國氣候變化框架公約', category: 'S1', url: 'https://unfccc.int', type: 'government' },
    { id: 'unep', name: 'UNEP', nameZh: '聯合國環境規劃署', category: 'S1', url: 'https://www.unep.org', type: 'government' },
    { id: 'ghg_protocol', name: 'GHG Protocol', nameZh: '溫室氣體核算體系', category: 'S1', url: 'https://ghgprotocol.org', type: 'standard' },

    // S2: 揭露框架 (Standards & Disclosure)
    { id: 'isSB', name: 'ISSB', nameZh: '國際可持續發展準則理事會', category: 'S2', url: 'https://www.ifrs.org/groups/international-sustainability-standards-board', type: 'standard' },
    { id: 'tcfd', name: 'TCFD', nameZh: '氣候相關財務信息披露工作組', category: 'S2', url: 'https://www.fsb-tcfd.org', type: 'standard' },
    { id: 'gri', name: 'GRI', nameZh: '全球報告倡議組織', category: 'S2', url: 'https://www.globalreporting.org', type: 'standard' },
    { id: 'cdsb', name: 'CDSB', nameZh: '氣候披露標準委員會', category: 'S2', url: 'https://www.cdsb.net', type: 'standard' },
    { id: 'esrs', name: 'ESRS', nameZh: '歐洲可持續報告標準', category: 'S2', url: 'https://www.efrag.org', type: 'standard' },

    // S3: 全球智庫 (Think Tanks & Research)
    { id: 'wef', name: 'WEF', nameZh: '世界經濟論壇', category: 'S3', url: 'https://www.weforum.org', type: 'thinktank' },
    { id: 'mit', name: 'MIT', nameZh: '麻省理工學院', category: 'S3', url: 'https://www.mit.edu', type: 'thinktank' },
    { id: 'brookings', name: 'Brookings', nameZh: '布魯金斯學會', category: 'S3', url: 'https://www.brookings.edu', type: 'thinktank' },
    { id: 'iisd', name: 'IISD', nameZh: '國際可持續發展研究所', category: 'S3', url: 'https://www.iisd.org', type: 'thinktank' },
    { id: 'climate_works', name: 'ClimateWorks', nameZh: '氣候工作基金會', category: 'S3', url: 'https://www.climateworks.org', type: 'thinktank' },

    // S4: 資本金融 (Finance & Capital)
    { id: 'ngfs', name: 'NGFS', nameZh: '央行與監管機構綠色金融網絡', category: 'S4', url: 'https://www.ngfs.net', type: 'finance' },
    { id: 'pri', name: 'PRI', nameZh: '責任投資原則', category: 'S4', url: 'https://www.unpri.org', type: 'finance' },
    { id: 'cpi', name: 'CPI', nameZh: '氣候政策倡議', category: 'S4', url: 'https://www.climatepolicyinitiative.org', type: 'thinktank' },
    { id: 'cerf', name: 'CERF', nameZh: '碳排放交易基金', category: 'S4', url: 'https://carbonemissionreductions.org', type: 'finance' },
    { id: 'green_bond', name: 'Green Bond Principles', nameZh: '綠色債券原則', category: 'S4', url: 'https://www.icmagroup.org', type: 'finance' },
    { id: 'sfi', name: 'SFI', nameZh: '永續金融倡議', category: 'S4', url: 'https://www.bankofengland.co.uk', type: 'finance' },

    // S5: 產業技術 (Sector & Tech)
    { id: 'semi', name: 'SEMI', nameZh: '國際半導體產業協會', category: 'S5', url: 'https://www.semi.org', type: 'industry' },
    { id: 'tsmc_esg', name: 'TSMC ESG', nameZh: '台積電永續', category: 'S5', url: 'https://www.tsmc.com', type: 'industry' },
    { id: 'patagonia', name: 'Patagonia', nameZh: '巴塔哥尼亞', category: 'S5', url: 'https://www.patagonia.com', type: 'industry' },
    { id: 'interface', name: 'Interface', nameZh: 'Interface 地毯', category: 'S5', url: 'https://www.interface.com', type: 'industry' },
    { id: 'b_corp', name: 'B Corp', nameZh: '共益企業', category: 'S5', url: 'https://bcorporation.net', type: 'standard' },
    { id: 'science_based', name: 'SBTi', nameZh: '科學碳目標倡議', category: 'S5', url: 'https://sciencebasedtargets.org', type: 'standard' },
    { id: 're100', name: 'RE100', nameZh: '再生能源100%', category: 'S5', url: 'https://www.there100.org', type: 'industry' },
    { id: 'iso_14064', name: 'ISO 14064', nameZh: 'ISO 溫室氣體標準', category: 'S5', url: 'https://www.iso.org', type: 'standard' },
    { id: 'iso_14001', name: 'ISO 14001', nameZh: 'ISO 環境管理標準', category: 'S5', url: 'https://www.iso.org', type: 'standard' },
    { id: 'sa8000', name: 'SA8000', nameZh: '社會責任標準', category: 'S5', url: 'https://www.sa-intl.org', type: 'standard' }
];

// ============== 情資聚合器類 ==============
export class IntelAggregator {
    /**
     * 根據分類獲取源頭機構
     */
    static getSourcesByCategory(category: IntelCategory): SourceInstitution[] {
        return SOURCE_INSTITUTIONS.filter(source => source.category === category);
    }

    /**
     * 獲取所有源頭機構
     */
    static getAllSources(): SourceInstitution[] {
        return SOURCE_INSTITUTIONS;
    }

    /**
     * 根據 URL 查找源頭機構
     */
    static findSourceByUrl(url: string): SourceInstitution | undefined {
        return SOURCE_INSTITUTIONS.find(source => url.includes(source.id) || source.url.includes(url));
    }

    /**
     * 自動分類情報到 S1-S5
     */
    static autoCategorize(content: string): IntelCategory {
        const lowerContent = content.toLowerCase();

        // S1: 全球治理關鍵詞
        if (lowerContent.includes('un ') || lowerContent.includes('unfccc') ||
            lowerContent.includes('policy') || lowerContent.includes('regulation') ||
            lowerContent.includes('government') || lowerContent.includes('cop ')) {
            return 'S1';
        }

        // S2: 揭露框架關鍵詞
        if (lowerContent.includes('isSB') || lowerContent.includes('tcfd') ||
            lowerContent.includes('gri') || lowerContent.includes('disclosure') ||
            lowerContent.includes('reporting') || lowerContent.includes('esrs')) {
            return 'S2';
        }

        // S3: 智庫關鍵詞
        if (lowerContent.includes('wef') || lowerContent.includes('research') ||
            lowerContent.includes('institute') || lowerContent.includes('think tank') ||
            lowerContent.includes('analysis') || lowerContent.includes('forecast')) {
            return 'S3';
        }

        // S4: 金融關鍵詞
        if (lowerContent.includes('finance') || lowerContent.includes('investment') ||
            lowerContent.includes('capital') || lowerContent.includes('ngfs') ||
            lowerContent.includes('bond') || lowerContent.includes('risk') ||
            lowerContent.includes('carbon price')) {
            return 'S4';
        }

        // S5: 產業技術關鍵詞
        if (lowerContent.includes('industry') || lowerContent.includes('technology') ||
            lowerContent.includes('semiconductor') || lowerContent.includes('manufacturing') ||
            lowerContent.includes('supply chain') || lowerContent.includes('emission')) {
            return 'S5';
        }

        // 預設為 S3 (智庫/研究)
        return 'S3';
    }

    /**
     * 處理情報輸入並通過 5T 協議閘口
     */
    static async processIntel(input: {
        source_url: string;
        title: string;
        insight: string;
        risk_score: number;
        affected_supply_chain?: string[];
        raw_evidence?: Record<string, any>;
        iso_tags?: string[];
        category?: IntelCategory;
    }): Promise<IIntelNode5T> {
        // 自動分類（如果未指定）
        const category = input.category || this.autoCategorize(input.title + ' ' + input.insight);

        // 查找源頭機構
        const source = this.findSourceByUrl(input.source_url);
        const sourceName = source?.nameZh || source?.name || 'Unknown';

        // 構建 RawIntelInput
        const rawData: RawIntelInput = {
            source_url: input.source_url,
            source_name: sourceName,
            title: input.title,
            insight: input.insight,
            risk_score: input.risk_score,
            affected_supply_chain: input.affected_supply_chain || [],
            raw_evidence: input.raw_evidence || {},
            iso_tags: input.iso_tags
        };

        // 通過 5T 協議閘口
        const intel = await Intel5TGateway.processReconnaissanceIntel(rawData, category);

        return intel;
    }

    /**
     * 儲存情報到 NCBDB
     */
    static async saveIntel(intel: IIntelNode5T): Promise<any> {
        return await Intel5TGateway.saveToNCB(intel);
    }

    /**
     * 獲取分類標籤
     */
    static getCategoryLabel(category: IntelCategory): { zh: string; en: string; description: string } {
        return INTEL_CATEGORY_LABELS[category];
    }

    // ============== 爬蟲功能 (Crawler Functions) ==============

    /**
     * 爬取單一源頭機構的資料
     */
    static async crawlSource(source: SourceInstitution): Promise<any[]> {
        const results: any[] = [];
        
        try {
            console.log(`[Crawler] 正在爬取: ${source.nameZh} (${source.url})`);
            
            // 發送 HTTP 請求
            const response = await axios.get(source.url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            // 使用 Cheerio 解析 HTML
            const $ = cheerio.load(response.data);
            
            // 根據來源類型提取內容
            const articles = this.extractContent($, source);
            results.push(...articles);
            
            console.log(`[Crawler] 從 ${source.nameZh} 提取了 ${articles.length} 篇文章`);
        } catch (error) {
            console.error(`[Crawler] 爬取失敗 ${source.nameZh}:`, error instanceof Error ? error.message : 'Unknown error');
            // 返回模擬數據作為 fallback
            results.push(this.generateSimulatedIntel(source));
        }

        return results;
    }

    /**
     * 根據來源類型提取內容
     */
    private static extractContent($: cheerio.CheerioAPI, source: SourceInstitution): any[] {
        const articles: any[] = [];
        
        // 嘗試多種選擇器來提取文章
        const selectors = [
            'article', '.article', '.post', '.news-item', '.content-item',
            'h2 a', '.entry-title a', '.post-title a'
        ];

        for (const selector of selectors) {
            $(selector).each((_idx: number, element: cheerio.Element) => {
                const title = $(element).text().trim();
                const href = $(element).attr('href');
                
                if (title && title.length > 10 && href) {
                    articles.push({
                        title,
                        url: href.startsWith('http') ? href : `${source.url}${href}`,
                        source: source.nameZh,
                        category: source.category,
                        crawledAt: Date.now()
                    });
                }
            });

            if (articles.length > 0) break;
        }

        // 如果沒有找到文章，嘗試提取頁面標題作為 fallback
        if (articles.length === 0) {
            const pageTitle = $('title').text();
            if (pageTitle) {
                articles.push({
                    title: pageTitle,
                    url: source.url,
                    source: source.nameZh,
                    category: source.category,
                    crawledAt: Date.now()
                });
            }
        }

        return articles.slice(0, 10); // 限制最多 10 篇文章
    }

    /**
     * 產生模擬情報數據（當爬蟲失敗時）
     */
    private static generateSimulatedIntel(source: SourceInstitution): any {
        const sampleTitles: Record<string, string[]> = {
            S1: ['最新法規公告', '政策變動通知', '監管新規範'],
            S2: ['揭露標準更新', 'ISSB 準則動態', 'TCFD 報告要求'],
            S3: ['產業趨勢分析', '研究報告發布', '市場預測更新'],
            S4: ['綠色金融政策', '投資風險評估', '碳市場動態'],
            S5: ['技術創新進展', '產業標準更新', '供應鏈永續']
        };

        const titles = sampleTitles[source.category] || sampleTitles.S3;
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];

        return {
            title: `${source.nameZh} - ${randomTitle}`,
            url: source.url,
            source: source.nameZh,
            category: source.category,
            crawledAt: Date.now(),
            isSimulated: true
        };
    }

    /**
     * 執行全局爬蟲掃描
     */
    static async runGlobalCrawl(): Promise<IIntelNode5T[]> {
        console.log('[Crawler] 開始全局爬蟲掃描...');
        
        const allIntel: IIntelNode5T[] = [];
        const sources = SOURCE_INSTITUTIONS;

        // 並發爬取多個來源（限制並發數）
        const batchSize = 5;
        for (let i = 0; i < sources.length; i += batchSize) {
            const batch = sources.slice(i, i + batchSize);
            // 使用 Promise.allSettled 隔離錯誤，確保單一來源失敗不會影響整體流程
            const batchResults = await Promise.allSettled(
                batch.map(source => this.crawlSource(source))
            );

            // 處理每個來源的結果
            for (const result of batchResults) {
                // 只處理成功完成的結果
                if (result.status === 'rejected') {
                    console.error('[Crawler] Source crawl failed:', result.reason);
                    continue;
                }
                const articles = result.value;
                for (const article of articles) {
                    // 清洗數據
                    const cleaned = OmniDataCleanser.cleanse({
                        content: article.title,
                        title: article.title
                    });

                    // 自動分類
                    const category = this.autoCategorize(article.title);

                    // 計算風險分數
                    const riskScore = this.calculateRiskScore(cleaned);

                    // 創建情報
                    try {
                        const intel = await this.processIntel({
                            source_url: article.url,
                            title: article.title,
                            insight: this.generateInsight(article.title, category),
                            risk_score: riskScore,
                            affected_supply_chain: cleaned.entities || [],
                            raw_evidence: {
                                source: article.source,
                                crawledAt: article.crawledAt,
                                isSimulated: article.isSimulated || false
                            },
                            iso_tags: this.generateIsoTags(category),
                            category
                        });

                        allIntel.push(intel);
                    } catch (error) {
                        console.error('[Crawler] 創建情報失敗:', error);
                    }
                }
            }

            console.log(`[Crawler] 已處理 ${Math.min(i + batchSize, sources.length)}/${sources.length} 個來源`);
        }

        console.log(`[Crawler] 全局爬蟲完成，共產生 ${allIntel.length} 條情報`);
        return allIntel;
    }

    /**
     * 計算風險分數
     */
    private static calculateRiskScore(cleanedData: any): number {
        // 根據語義得分計算風險
        const sentiment = cleanedData.sentimentScore || 0.5;
        
        // 負面情緒 = 較高風險
        const riskScore = Math.round((1 - sentiment) * 100);
        
        return Math.max(10, Math.min(90, riskScore));
    }

    /**
     * 生成行動建議
     */
    private static generateInsight(title: string, category: IntelCategory): string {
        const insights: Record<IntelCategory, string[]> = {
            S1: [
                '建議立即評估法規變動對業務的影響',
                '請關注最新政策動態，及時調整合規策略',
                '建議與相關單位溝通，了解法規實施細節'
            ],
            S2: [
                '建議進行揭露框架差距分析',
                '請準備符合新標準的報告資料',
                '建議培訓相關人員了解新要求'
            ],
            S3: [
                '建議關注產業趨勢，評估潛在風險',
                '請分析研究報告的業務影響',
                '建議將洞察納入策略規劃'
            ],
            S4: [
                '建議評估投資組合的氣候風險',
                '請關注綠色金融機會',
                '建議進行碳排放成本分析'
            ],
            S5: [
                '建議評估技術變動對供應鏈的影響',
                '請關注產業標準更新',
                '建議與供應商討論永續措施'
            ]
        };

        const categoryInsights = insights[category] || insights.S3;
        return categoryInsights[Math.floor(Math.random() * categoryInsights.length)];
    }

    /**
     * 生成 ISO 標籤
     */
    private static generateIsoTags(category: IntelCategory): string[] {
        const tags: Record<IntelCategory, string[]> = {
            S1: ['ISO 14001', 'ISO 14064'],
            S2: ['GRI Standards', 'ISSB S1', 'TCFD'],
            S3: ['SBTi', 'Science Based Targets'],
            S4: ['NGFS', 'PRI', 'Green Bond'],
            S5: ['ISO 14001', 'SA8000', 'B Corp']
        };

        return tags[category] || [];
    }
}

// ============== 匯出 ==============
export default IntelAggregator;
