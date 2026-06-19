/**
 * FSC 金管會法規爬蟲
 * 
 * 爬取金融監督管理委員會的法規資訊
 * 台灣金融監管機關，負責金融機構監理及資本市場法規
 */

import { BaseCrawler, CrawlOptions, CrawlResult, CrawledItem } from './base-crawler';
import { Page } from 'playwright';
import * as cheerio from 'cheerio';

// ============================================
// FSC 法規爬蟲
// ============================================

export class FSCCrawler extends BaseCrawler {
    private readonly baseUrl = 'https://www.fsc.gov.tw';
    private readonly lawListPath = '/ch/home.jsp?id=96&parentpath=0,4';

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
        return 'tw-fsc';
    }

    /**
     * 主要爬取方法
     */
    async crawl(options: CrawlOptions): Promise<CrawlResult> {
        const startTime = Date.now();

        return this.crawlWithRetry(async () => {
            const url = options.url || `${this.baseUrl}${this.lawListPath}`;
            const selector = options.selector || '.law-list, .news-list, table';

            try {
                // 使用 Cheerio 爬取靜態內容
                const $ = await this.fetchWithCheerio(url);
                const items = await this.parseContent($);

                const contentHash = items.length > 0
                    ? this.computeHash(JSON.stringify(items))
                    : undefined;

                return {
                    success: true,
                    data: items,
                    itemsFound: items.length,
                    itemsNew: items.length, // 需比對資料庫後更新
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
    protected async parseContent($: cheerio.CheerioAPI): Promise<CrawledItem[]> {
        const items: CrawledItem[] = [];

        // 嘗試多個可能的選擇器
        const selectors = [
            'table.list-table tr',
            '.law-list li',
            '.news-list li',
            '.regulation-list a',
            'tbody tr',
        ];

        for (const selector of selectors) {
            const elements = $(selector);
            if (elements.length > 0) {
                elements.each((_, el) => {
                    const $el = $(el);

                    // 提取標題
                    const title = $el.find('a').text().trim()
                        || $el.find('td').first().text().trim()
                        || $el.text().trim();

                    // 提取連結
                    const href = $el.find('a').attr('href')
                        || $el.parent().find('a').attr('href');

                    // 提取日期
                    const dateText = $el.find('td').eq(1).text().trim()
                        || $el.find('.date').text().trim();
                    const publishedDate = this.parseDate(dateText);

                    if (title && href) {
                        const fullUrl = href.startsWith('http')
                            ? href
                            : `${this.baseUrl}${href}`;

                        items.push({
                            id: this.computeHash(fullUrl),
                            title,
                            url: fullUrl,
                            publishedDate,
                            metadata: {
                                authority: '金融監督管理委員會',
                                category: 'governance',
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

        // 支援格式: 112/03/01, 2024/03/01, 2024-03-01, 中華民國112年3月1日
        const twDateMatch = dateStr.match(/(\d{3})\/(\d{1,2})\/(\d{1,2})/);
        if (twDateMatch) {
            const year = parseInt(twDateMatch[1]) + 1911;
            return new Date(year, parseInt(twDateMatch[2]) - 1, parseInt(twDateMatch[3]));
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
            const content = $('.content, .article, .law-content, #main-content')
                .text()
                .trim();

            return content || null;
        } catch (error) {
            console.error(`[FSCCrawler] Failed to crawl detail: ${url}`, error);
            return null;
        }
    }
}

// 註冊爬蟲工廠
import { CrawlerFactory } from './base-crawler';
CrawlerFactory.register('tw-fsc', FSCCrawler);

export default FSCCrawler;