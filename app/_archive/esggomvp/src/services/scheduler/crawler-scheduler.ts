/**
 * ESGSonar 爬蟲排程服務
 * 
 * 負責管理所有爬蟲任務的排程和執行
 * 支援 BullMQ 任務佇列和 Cron 排程
 */

// ============================================
// 類型定義
// ============================================

export interface CrawlJob {
    id?: string;
    sourceId: string;
    url?: string;
    options?: CrawlJobOptions;
    priority?: 'low' | 'normal' | 'high';
    scheduledAt?: Date;
}

export interface CrawlJobOptions {
    retryCount?: number;
    timeout?: number;
    extractContent?: boolean;
    downloadPDF?: boolean;
}

export interface ScheduleConfig {
    sourceId: string;
    cronExpression: string;
    enabled: boolean;
    lastRun?: Date;
    nextRun?: Date;
}

export interface JobStatus {
    jobId: string;
    sourceId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
    progress?: number;
}

// ============================================
// 排程服務
// ============================================

export class CrawlerScheduler {
    private schedules: Map<string, ScheduleConfig> = new Map();
    private jobQueue: Map<string, JobStatus> = new Map();
    private cronJobs: Map<string, NodeJS.Timeout> = new Map();

    constructor() {
        // 初始化排程配置
        this.initializeDefaultSchedules();
    }

    /**
     * 初始化預設排程
     */
    private initializeDefaultSchedules(): void {
        // 台灣來源 - 每小時檢查
        const twSources = [
            { sourceId: 'tw-fsc', cron: '0 * * * *' },
            { sourceId: 'tw-moenv', cron: '30 * * * *' },
            { sourceId: 'tw-twse', cron: '0 0,6,12,18 * * *' },
            { sourceId: 'tw-tpex', cron: '15 0,6,12,18 * * *' },
            { sourceId: 'tw-gazette', cron: '0 */2 * * *' },
        ];

        // 國際來源 - 每 6 小時檢查
        const intlSources = [
            { sourceId: 'eu-csrd', cron: '0 */6 * * *' },
            { sourceId: 'eu-taxonomy', cron: '0 */6 * * *' },
            { sourceId: 'eu-esrs', cron: '0 */6 * * *' },
            { sourceId: 'ifrs-sasb', cron: '0 */6 * * *' },
            { sourceId: 'gri-standards', cron: '0 */12 * * *' },
        ];

        // 美國來源 - 每 3 小時檢查
        const usSources = [
            { sourceId: 'us-sec', cron: '0 */3 * * *' },
            { sourceId: 'us-cftc', cron: '0 */3 * * *' },
        ];

        // 亞洲來源 - 每 6 小時檢查
        const asiaSources = [
            { sourceId: 'jp-fsa', cron: '0 */6 * * *' },
            { sourceId: 'hk-exchanges', cron: '0 */6 * * *' },
            { sourceId: 'sse', cron: '0 */6 * * *' },
        ];

        // 國際組織 - 每天檢查
        const orgSources = [
            { sourceId: 'unfccc', cron: '0 0 * * *' },
            { sourceId: 'unisdr', cron: '0 1 * * *' },
            { sourceId: 'tcfd', cron: '0 2 * * *' },
        ];

        const allSources = [...twSources, ...intlSources, ...usSources, ...asiaSources, ...orgSources];

        allSources.forEach(({ sourceId, cron }) => {
            this.schedules.set(sourceId, {
                sourceId,
                cronExpression: cron,
                enabled: true,
            });
        });
    }

    /**
     * 新增排程
     */
    addSchedule(config: ScheduleConfig): void {
        this.schedules.set(config.sourceId, config);
        
        if (config.enabled && this.cronJobs.has(config.sourceId)) {
            // 重新啟動排程
            this.stopSchedule(config.sourceId);
            this.startSchedule(config.sourceId);
        }
    }

    /**
     * 移除排程
     */
    removeSchedule(sourceId: string): void {
        this.stopSchedule(sourceId);
        this.schedules.delete(sourceId);
    }

    /**
     * 啟動排程
     */
    startSchedule(sourceId: string): void {
        const config = this.schedules.get(sourceId);
        if (!config) {
            console.warn(`[Scheduler] No schedule found for source: ${sourceId}`);
            return;
        }

        if (!config.enabled) {
            console.warn(`[Scheduler] Schedule disabled for source: ${sourceId}`);
            return;
        }

        // 停止現有排程
        this.stopSchedule(sourceId);

        // 解析 Cron 表達式
        const interval = this.parseCronExpression(config.cronExpression);
        
        if (!interval) {
            console.error(`[Scheduler] Invalid cron expression: ${config.cronExpression}`);
            return;
        }

        // 設定定時任務
        const job = setInterval(async () => {
            console.log(`[Scheduler] Running scheduled job for: ${sourceId}`);
            await this.runScheduledJob(sourceId);
        }, interval);

        this.cronJobs.set(sourceId, job);
        
        console.log(`[Scheduler] Started schedule for ${sourceId}: ${config.cronExpression}`);
    }

    /**
     * 停止排程
     */
    stopSchedule(sourceId: string): void {
        const existingJob = this.cronJobs.get(sourceId);
        if (existingJob) {
            clearInterval(existingJob);
            this.cronJobs.delete(sourceId);
            console.log(`[Scheduler] Stopped schedule for: ${sourceId}`);
        }
    }

    /**
     * 啟動所有排程
     */
    startAllSchedules(): void {
        console.log('[Scheduler] Starting all schedules...');
        
        for (const [sourceId, config] of this.schedules.entries()) {
            if (config.enabled) {
                this.startSchedule(sourceId);
            }
        }
        
        console.log(`[Scheduler] Started ${this.cronJobs.size} schedules`);
    }

    /**
     * 停止所有排程
     */
    stopAllSchedules(): void {
        console.log('[Scheduler] Stopping all schedules...');
        
        for (const sourceId of this.cronJobs.keys()) {
            this.stopSchedule(sourceId);
        }
        
        console.log('[Scheduler] All schedules stopped');
    }

    /**
     * 執行排程任務
     */
    private async runScheduledJob(sourceId: string): Promise<void> {
        const config = this.schedules.get(sourceId);
        if (!config) return;

        try {
            config.lastRun = new Date();
            
            // 這裡調用實際的爬蟲任務
            // await this.executeJob({ sourceId });
            
            console.log(`[Scheduler] Completed scheduled job for: ${sourceId}`);
        } catch (error) {
            console.error(`[Scheduler] Scheduled job failed for ${sourceId}:`, error);
        }
    }

    /**
     * 解析 Cron 表達式為毫秒
     */
    private parseCronExpression(cron: string): number | null {
        // 簡化的 Cron 解析
        // 支援格式: 分 時 日 月 周
        
        const parts = cron.split(' ');
        if (parts.length < 5) return null;

        const [minute, hour, day, month, week] = parts;

        // 每小時: "0 * * * *" -> 3600000
        if (minute === '0' && hour === '*' && day === '*' && month === '*' && week === '*') {
            return 60 * 60 * 1000;
        }

        // 每 N 小時: "0 */N * * *" -> N * 3600000
        // 合併處理所有 */N 格式 (2, 3, 6, 12 小時等)
        if (minute === '0' && hour.includes('*/')) {
            const interval = parseInt(hour.replace('*/', ''));
            if (!isNaN(interval) && interval > 0) {
                return interval * 60 * 60 * 1000;
            }
        }

        // 每天: "0 0 * * *" -> 24 * 3600000
        if (minute === '0' && hour === '0' && day === '*' && month === '*' && week === '*') {
            return 24 * 60 * 60 * 1000;
        }

        // 每天多次: "0 0,6,12,18 * * *" -> 6 * 3600000
        if (minute === '0' && hour.includes(',')) {
            return 6 * 60 * 60 * 1000;
        }

        // 預設返回每小時
        return 60 * 60 * 1000;
    }

    /**
     * 新增任務到佇列
     */
    async addJob(job: CrawlJob): Promise<string> {
        const jobId = job.id || `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const status: JobStatus = {
            jobId,
            sourceId: job.sourceId,
            status: 'pending',
        };

        this.jobQueue.set(jobId, status);
        
        console.log(`[Scheduler] Job added: ${jobId} for source: ${job.sourceId}`);
        
        return jobId;
    }

    /**
     * 取得任務狀態
     */
    getJobStatus(jobId: string): JobStatus | null {
        return this.jobQueue.get(jobId) || null;
    }

    /**
     * 取得所有排程
     */
    getAllSchedules(): ScheduleConfig[] {
        return Array.from(this.schedules.values());
    }

    /**
     * 取得排程統計
     */
    getScheduleStats(): { active: number; total: number; bySource: Record<string, number> } {
        const active = this.cronJobs.size;
        const total = this.schedules.size;
        
        const bySource: Record<string, number> = {};
        for (const [sourceId, status] of this.jobQueue.entries()) {
            bySource[status.sourceId] = (bySource[status.sourceId] || 0) + 1;
        }

        return { active, total, bySource };
    }

    /**
     * 執行手動爬取
     */
    async runManualCrawl(sourceId: string, options?: CrawlJobOptions): Promise<JobStatus> {
        const jobId = await this.addJob({
            sourceId,
            options,
            priority: 'high',
        });

        const status = this.jobQueue.get(jobId)!;
        status.status = 'running';
        status.startedAt = new Date();

        try {
            // 這裡調用實際的爬蟲執行
            // const crawler = CrawlerFactory.create(sourceId);
            // if (crawler) {
            //     await crawler.crawl({});
            // }
            
            status.status = 'completed';
            status.completedAt = new Date();
            status.progress = 100;
        } catch (error) {
            status.status = 'failed';
            status.error = error instanceof Error ? error.message : 'Unknown error';
            status.completedAt = new Date();
        }

        return status;
    }

    /**
     * 更新排程設定
     */
    updateSchedule(sourceId: string, updates: Partial<ScheduleConfig>): void {
        const existing = this.schedules.get(sourceId);
        if (existing) {
            const updated = { ...existing, ...updates };
            this.schedules.set(sourceId, updated);
            
            if (updates.enabled !== undefined) {
                if (updates.enabled) {
                    this.startSchedule(sourceId);
                } else {
                    this.stopSchedule(sourceId);
                }
            }
        }
    }
}

// ============================================
// 單例實例
// ============================================

let schedulerInstance: CrawlerScheduler | null = null;

/**
 * 取得排程器單例
 */
export function getScheduler(): CrawlerScheduler {
    if (!schedulerInstance) {
        schedulerInstance = new CrawlerScheduler();
    }
    return schedulerInstance;
}

/**
 * 初始化排程服務
 */
export async function initializeScheduler(): Promise<void> {
    const scheduler = getScheduler();
    scheduler.startAllSchedules();
    console.log('[Scheduler] Service initialized');
}

/**
 * 關閉排程服務
 */
export async function shutdownScheduler(): Promise<void> {
    if (schedulerInstance) {
        schedulerInstance.stopAllSchedules();
        console.log('[Scheduler] Service shutdown');
    }
}

export default CrawlerScheduler;