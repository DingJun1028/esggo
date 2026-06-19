/**
 * ESGSonar 基礎爬蟲引擎
 * 
 * 提供所有爬蟲的基礎功能：
 * - Playwright/Cheerio 整合
 * - 重試機制
 * - 請求間隔控制
 * - 日誌記錄
 */

import { Page, Browser, chromium, Request } from 'playwright';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

// ============================================
// 類型定義
// ============================================

export interface CrawlOptions {
    url: string;
    selector?: string;
    retryCount?: number;
    timeout?: number;
    rateLimit?: number;
    headers?: Record<string, string>;
    waitFor?: string;
}

export interface CrawlResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    itemsFound: number;
    itemsNew: number;
    itemsUpdated: number;
    duration: number;
    responseTime: number;
    contentHash?: string;
}

export interface CrawledItem {
    id: string;
    title: string;
    url: string;
    content?: string;
    publishedDate?: Date;
    metadata?: Record<string, any>;
}

// ============================================
// 基礎爬蟲抽象類別
// ============================================

export abstract class BaseCrawler {
    protected browser: Browser | null = null;
    protected page: Page | null = null;
    protected lastRequestTime: number = 0;
    protected retryCount: number = 3;
    protected timeout: number = 30000;
    protected rateLimit: number = 1000;
    protected headers: Record<string, string> = {
        'User-Agent': 'ESGSonar-Crawler/1.0 (https://esgsonar.example.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    };

    constructor(options?: Partial<CrawlOptions>) {
        if (options) {
            this.retryCount = options.retryCount ?? 3;
            this.timeout = options.timeout ?? 30000;
            this.rateLimit = options.rateLimit ?? 1000;
            if (options.headers) {
                this.headers = { ...this.headers, ...options.headers };
            }
        }
    }

    // ============================================
    // 生命週期方法
    // ============================================

    /**
     * 初始化瀏覽器
     */
    async initialize(): Promise<void> {
        if (!this.browser) {
            try {
                this.browser = await chromium.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                });
            } catch (error) {
                console.error('[Crawler] Failed to launch browser:', error instanceof Error ? error.message : 'Unknown error');
                this.browser = null;
                throw error;
            }
        }
    }

    /**
     * 檢查瀏覽器是否可用
     */
    async ensureBrowser(): Promise<boolean> {
        try {
            if (!this.browser) {
                await this.initialize();
            }
            return this.browser !== null;
        } catch {
            return false;
        }
    }

    /**
     * 關閉瀏覽器
     */
    async cleanup(): Promise<void> {
        if (this.page) {
            await this.page.close();
            this.page = null;
        }
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    // ============================================
    // 請求控制
    // ============================================

    /**
     * 請求間隔控制
     */
    protected async rateLimitWait(): Promise<void> {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.rateLimit) {
            await this.sleep(this.rateLimit - timeSinceLastRequest);
        }
        this.lastRequestTime = Date.now();
    }

    /**
     * 睡眠函數
     */
    protected sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ============================================
    // 爬取方法
    // ============================================

    /**
     * 使用 Cheerio 爬取靜態 HTML
     */
    protected async fetchWithCheerio(url: string): Promise<cheerio.CheerioAPI> {
        await this.rateLimitWait();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                headers: this.headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            return cheerio.load(html);
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * 使用 Playwright 爬取動態網頁
     */
    protected async fetchWithPlaywright(url: string, waitFor?: string): Promise<Page> {
        await this.rateLimitWait();

        if (!this.browser) {
            await this.initialize();
        }

        if (!this.page) {
            this.page = await this.browser!.newPage();
            await this.page.setExtraHTTPHeaders(this.headers);
        }

        try {
            const startTime = Date.now();

            await this.page.goto(url, {
                waitUntil: 'networkidle',
                timeout: this.timeout,
            });

            if (waitFor) {
                await this.page.waitForSelector(waitFor, { timeout: this.timeout });
            }

            return this.page;
        } catch (error) {
            // 頁面出錯時建立新頁面
            this.page = await this.browser!.newPage();
            await this.page.setExtraHTTPHeaders(this.headers);
            throw error;
        }
    }

    // ============================================
    // 重試機制
    // ============================================

    /**
     * 帶重試的爬取
     */
    protected async crawlWithRetry<T>(
        crawlFn: () => Promise<CrawlResult<T>>,
        options?: { maxRetries?: number }
    ): Promise<CrawlResult<T>> {
        const maxRetries = options?.maxRetries ?? this.retryCount;
        let lastError: Error | undefined;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await crawlFn();
                if (result.success) {
                    return result;
                }
                lastError = new Error(result.error || 'Crawl failed');
            } catch (error) {
                lastError = error as Error;
                console.error(`[Crawler] Attempt ${attempt}/${maxRetries} failed:`, error);

                if (attempt < maxRetries) {
                    // 指數退避
                    await this.sleep(Math.pow(2, attempt) * 1000);
                }
            }
        }

        return {
            success: false,
            error: lastError?.message || 'Max retries exceeded',
            itemsFound: 0,
            itemsNew: 0,
            itemsUpdated: 0,
            duration: 0,
            responseTime: 0,
        };
    }

    // ============================================
    // 雜湊計算
    // ============================================

    /**
     * 計算內容雜湊
     */
    protected computeHash(content: string): string {
        return crypto.createHash('sha256').update(content).digest('hex');
    }

    // ============================================
    // 抽象方法 (由子類別實作)
    // ============================================

    /**
     * 執行爬取的主要方法
     */
    abstract crawl(options: CrawlOptions): Promise<CrawlResult>;

    /**
     * 解析網頁內容
     */
    protected parseContent(html: string | Page, ...args: any[]): Promise<CrawledItem[]> {
        // 預設實現，子類別需要覆寫
        return Promise.resolve([]);
    }

    /**
     * 取得來源 ID
     */
    abstract getSourceId(): string;
}

// ============================================
// 爬蟲工廠
// ============================================

export class CrawlerFactory {
    private static crawlers: Map<string, new () => BaseCrawler> = new Map();

    /**
     * 註冊爬蟲
     */
    static register(sourceId: string, crawlerClass: new () => BaseCrawler): void {
        this.crawlers.set(sourceId, crawlerClass);
    }

    /**
     * 建立爬蟲實例
     */
    static create(sourceId: string): BaseCrawler | null {
        const CrawlerClass = this.crawlers.get(sourceId);
        if (!CrawlerClass) {
            console.warn(`[CrawlerFactory] No crawler found for source: ${sourceId}`);
            return null;
        }
        return new CrawlerClass();
    }

    /**
     * 取得所有已註冊的爬蟲
     */
    static getRegisteredSources(): string[] {
        return Array.from(this.crawlers.keys());
    }
}

export default BaseCrawler;