import { ESGSource } from '../config/sources';
/**
 * ESGSonar | Crawler Scheduler Service
 * Manages periodic intelligence gathering tasks.
 */
export declare class CrawlerScheduler {
    private static instance;
    private activeJobs;
    private constructor();
    static getInstance(): CrawlerScheduler;
    /**
     * Initialize all default schedules
     */
    startAll(): void;
    /**
     * Schedule a specific source
     */
    scheduleJob(source: ESGSource): void;
    /**
     * Execute immediate crawl
     */
    executeCrawl(sourceId: string): Promise<void>;
    /**
     * Stop all active jobs
     */
    stopAll(): void;
}
export declare const sonarScheduler: CrawlerScheduler;
//# sourceMappingURL=scheduler.d.ts.map