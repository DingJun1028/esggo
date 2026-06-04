import { createCrawler } from '../crawlers';
import { ESG_SOURCES } from '../config/sources';
/**
 * ESGSonar | Crawler Scheduler Service
 * Manages periodic intelligence gathering tasks.
 */
export class CrawlerScheduler {
    constructor() {
        this.activeJobs = new Map();
    }
    static getInstance() {
        if (!CrawlerScheduler.instance) {
            CrawlerScheduler.instance = new CrawlerScheduler();
        }
        return CrawlerScheduler.instance;
    }
    /**
     * Initialize all default schedules
     */
    startAll() {
        console.log('🚀 Initializing ESGSonar Crawler Scheduler...');
        ESG_SOURCES.forEach(source => this.scheduleJob(source));
    }
    /**
     * Schedule a specific source
     */
    scheduleJob(source) {
        if (this.activeJobs.has(source.id)) {
            clearInterval(this.activeJobs.get(source.id));
        }
        const intervalMs = source.intervalHours * 60 * 60 * 1000;
        const job = setInterval(() => this.executeCrawl(source.id), intervalMs);
        this.activeJobs.set(source.id, job);
        console.log(`[Scheduler] Registered: ${source.name} (Every ${source.intervalHours}h)`);
    }
    /**
     * Execute immediate crawl
     */
    async executeCrawl(sourceId) {
        const crawler = createCrawler(sourceId);
        if (!crawler) {
            console.error(`[Crawler] Error: Unknown source ID ${sourceId}`);
            return;
        }
        const source = ESG_SOURCES.find(s => s.id === sourceId);
        if (!source)
            return;
        console.log(`[Crawler] Starting: ${source.name}...`);
        try {
            const result = await crawler.crawl({ url: source.baseUrl });
            console.log(`[Crawler] Success: Found ${result.itemsFound} items from ${source.name}`);
            // In production, results would be stored via Prisma here
        }
        catch (err) {
            console.error(`[Crawler] Failed: ${source.name} - ${err.message}`);
        }
        finally {
            await crawler.close();
        }
    }
    /**
     * Stop all active jobs
     */
    stopAll() {
        this.activeJobs.forEach(job => clearInterval(job));
        this.activeJobs.clear();
        console.log('[Scheduler] All crawler jobs stopped.');
    }
}
export const sonarScheduler = CrawlerScheduler.getInstance();
//# sourceMappingURL=scheduler.js.map