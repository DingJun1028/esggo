/**
 * MOENV 環境部法規爬蟲
 * 
 * 爬取環境部的法規資訊
 * 台灣環境保護主管機關（2023改制）
 */

import { BaseCrawler, CrawlOptions, CrawlResult, CrawledItem } from './base-crawler';
import * as cheerio from 'cheerio';

// ============================================
// 環境部法規爬蟲
// ============================================

export class MOENVCrawler extends BaseCrawler {
    private readonly baseUrl = 'https://www.moenv.gov.tw';
    private readonly lawListPath = '/law';

    constructor() {
        super({
            rateLimit: 1000,
            retryCount: 3,
            timeout: 30000,
        });
    }

    /**
     * 取得來源 ID
     */
    getSourceId(): string {
        return 'tw-moenv';
    }

    /**
     * 主要爬取方法
     */
    async crawl(options: CrawlOptions): Promise<CrawlResult> {
        const startTime = Date.now();

        return this.crawlWithRetry(async () => {
            const url = options.url || `${this.baseUrl}${this.lawListPath}`;
            const selector = options.selector || '.law-list, .regulations, .news-list';

            try {
                // 使用 Cheerio 爬取靜態內容
                const $ = await this.fetchWithCheerio(url);
                const items = await this.parseContent($, selector);

                const contentHash = items.length > 0
                    ? this.computeHash(JSON.stringify(items))
                    : undefined;

                return {
                    success: true,
                    data: items,
                    itemsFound: items.length,
                    itemsNew: items.length,
                    itemsUpdated: 0,
                    duration: Date.now() - startTime,
                    responseTime: Date.now() - startTime,
                    contentHash,
                };
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    itemsFound: 0,
                    itemsNew: 0,
                    itemsUpdated: 0,
                    duration: Date.now() - startTime,
                    responseTime: Date.now() - startTime,
                };
            }
        });
    }

    /**
     * 解析法規列表內容
     */
    protected async parseContent($: cheerio.CheerioAPI, selector: string): Promise<CrawledItem[]> {
        const items: CrawledItem[] = [];

        // 嘗試多個可能的選擇器
        const selectors = [
            'table.list-table tbody tr',
            '.regulation-item',
            '.law-item',
            '.news-list li',
            '.law-list a',
            'tbody tr',
        ];

        for (const sel of selectors) {
            const elements = $(sel);
            if (elements.length > 0) {
                elements.each((_: number, el: Element) => {
                    const $el = $(el);

                    // 提取標題/法規名稱
                    const title = $el.find('a').text().trim()
                        || $el.find('.title, .law-name').text().trim()
                        || $el.text().trim();

                    // 提取連結
                    const href = $el.find('a').attr('href');
                    const fullUrl = href
                        ? (href.startsWith('http') ? href : `${this.baseUrl}${href}`)
                        : null;

                    // 提取日期
                    const dateText = $el.find('.date, td').last().text().trim();
                    const publishedDate = this.parseDate(dateText);

                    // 提取法規編號
                    const lawNumber = $el.find('.law-number, .number').text().trim() || undefined;

                    if (title && fullUrl) {
                        items.push({
                            id: this.computeHash(fullUrl),
                            title,
                            url: fullUrl,
                            publishedDate,
                            metadata: {
                                authority: '環境部',
                                category: 'environmental',
                                lawNumber,
                            },
                        });
                    }
                });
                break;
            }
        }

        return items;
    }

    /**
     * 解析日期字串
     */
    private parseDate(dateStr: string): Date | undefined {
        if (!dateStr) return undefined;

        // 支援格式: 112/03/01, 2024/03/01, 2024-03-01, 112年03月01日
        const twDateMatch = dateStr.match(/(\d{3})\/(\d{1,2})\/(\d{1,2})/);
        if (twDateMatch) {
            const year = parseInt(twDateMatch[1]) + 1911;
            return new Date(year, parseInt(twDateMatch[2]) - 1, parseInt(twDateMatch[3]));
        }

        const twYearMatch = dateStr.match(/(\d{3})年(\d{1,2})月(\d{1,2})/);
        if (twYearMatch) {
            const year = parseInt(twYearMatch[1]) + 1911;
            return new Date(year, parseInt(twYearMatch[2]) - 1, parseInt(twYearMatch[3]));
        }

        const standardDateMatch = dateStr.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (standardDateMatch) {
            return new Date(
                parseInt(standardDateMatch[1]),
                parseInt(standardDateMatch[2]) - 1,
                parseInt(standardDateMatch[3])
            );
        }

        // 嘗試直接解析
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? undefined : parsed;
    }

    /**
     * 爬取法規詳細內容
     */
    async crawlDetail(url: string): Promise<string | null> {
        try {
            const $ = await this.fetchWithCheerio(url);

            // 提取主要內容區塊
            const content = $('.content, .article, .law-content, #main-content, .content-area')
                .text()
                .trim();

            return content || null;
        } catch (error) {
            console.error(`[MOENVCrawler] Failed to crawl detail: ${url}`, error);
            return null;
        }
    }

    /**
     * 爬取特定類別的法規
     */
    async crawlByCategory(category: string): Promise<CrawlResult> {
        const categoryMap: Record<string, string> = {
            'air': '/law/air',
            'water': '/law/water',
            'waste': '/law/waste',
            'soil': '/law/soil',
            'noise': '/law/noise',
            'chemical': '/law/chemical',
        };

        const path = categoryMap[category];
        if (!path) {
            return {
                success: false,
                error: `Unknown category: ${category}`,
                itemsFound: 0,
                itemsNew: 0,
                itemsUpdated: 0,
                duration: 0,
                responseTime: 0,
            };
        }

        return this.crawl({
            url: `${this.baseUrl}${path}`,
        });
    }
}

// 註冊爬蟲工廠
import { CrawlerFactory } from './base-crawler';
CrawlerFactory.register('tw-moenv', MOENVCrawler);

export default MOENVCrawler;
