/**
 * ESGSonar Crawlers Module
 * 
 * 爬蟲模組統一入口
 */

// 匯出基礎類別
export { BaseCrawler, CrawlerFactory, type CrawlOptions, type CrawlResult, type CrawledItem } from './base-crawler';

// 匯出特定來源爬蟲
export { FSCCrawler } from './fsc-crawler';
export { MOENVCrawler } from './moenv-crawler';
export { TWSECrawler } from './twse-crawler';

// 匯出工廠便捷函數
import { CrawlerFactory, BaseCrawler } from './base-crawler';
import { FSCCrawler } from './fsc-crawler';
import { MOENVCrawler } from './moenv-crawler';
import { TWSECrawler } from './twse-crawler';

// 自動註冊所有爬蟲
function registerAllCrawlers() {
    CrawlerFactory.register('tw-fsc', FSCCrawler);
    CrawlerFactory.register('tw-moenv', MOENVCrawler);
    CrawlerFactory.register('tw-twse', TWSECrawler);

    // 可以繼續註冊其他爬蟲
    // CrawlerFactory.register('tw-tpex', TpExCrawler);
    // CrawlerFactory.register('eu-csrd', EUCSRDCrawler);
    // CrawlerFactory.register('us-sec', USSECCrawler);
}

// 初始化時註冊
registerAllCrawlers();

/**
 * 建立爬蟲實例
 */
export function createCrawler(sourceId: string): BaseCrawler | null {
    return CrawlerFactory.create(sourceId);
}

/**
 * 取得所有已註冊的來源
 */
export function getRegisteredSources(): string[] {
    return CrawlerFactory.getRegisteredSources();
}

/**
 * 爬蟲支援的地區
 */
export const CRAWLER_REGIONS = {
    TAIWAN: ['tw-fsc', 'tw-moenv', 'tw-twse', 'tw-tpex', 'tw-gazette', 'tw-moea', 'tw-epa'],
    INTERNATIONAL: ['eu-csrd', 'eu-taxonomy', 'eu-esrs', 'ifrs-sasb', 'gri-standards', 'tcfd', 'cdsb', 'unfccc', 'unisdr'],
    US: ['us-sec', 'us-cftc'],
    ASIA: ['jp-fsa', 'hk-exchanges', 'sse'],
} as const;

/**
 * 預設爬蟲配置
 */
export const DEFAULT_CRAWLER_CONFIG = {
    rateLimit: 1000,        // 請求間隔 (ms)
    retryCount: 3,         // 重試次數
    timeout: 30000,        // 請求逾時 (ms)
    maxConcurrent: 5,      // 最大並發數
    userAgent: 'ESGSonar-Crawler/1.0 (https://esgsonar.example.com)',
} as const;

export default {
    createCrawler,
    getRegisteredSources,
    CRAWLER_REGIONS,
    DEFAULT_CRAWLER_CONFIG,
};
