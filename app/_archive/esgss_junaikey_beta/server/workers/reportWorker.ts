// server/workers/reportWorker.ts
/**
 * 報告生成 Worker
 * Processes 'generate-report' jobs from the esg-reports BullMQ queue (with OmniQueue fallback).
 * Runs as part of the server process — started in server.ts.
 */
import { reportGenerationService, IReportRequest } from '../services/ReportGenerationService.js';
import { getReportQueue } from '../services/queueService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

let workerInstance: any = null;

export async function startReportWorker(): Promise<void> {
    try {
        const queue = await getReportQueue();

        if (queue.isFallback) {
            // OmniQueue fallback — no dedicated worker needed (in-memory, synchronous)
            omniLogger.warn(
                LogCategory.SYSTEM,
                '[ReportWorker] Queue in fallback mode. Jobs will be processed inline via OmniQueue.'
            );
            return;
        }

        // BullMQ Worker
        const { Worker } = await import('bullmq');
        const { redisOptions } = await import('../src/config/redis.js');

        workerInstance = new Worker(
            'esg-reports',
            async (job: any) => {
                const request = job.data as IReportRequest;

                omniLogger.info(LogCategory.BUSINESS, `[ReportWorker] Processing job ${job.id}`, {
                    userId: request.userId,
                    type: request.type,
                });

                await job.updateProgress(10);

                const report = await reportGenerationService.generateReport(request);

                await job.updateProgress(100);

                omniLogger.info(LogCategory.BUSINESS, `[ReportWorker] Job ${job.id} completed`, {
                    reportId: report.id,
                    title: report.title,
                });

                // Return value becomes job.returnvalue — queryable via GET /api/reports/status/:jobId
                return {
                    reportId: report.id,
                    title: report.title,
                    createdAt: report.created_at,
                };
            },
            {
                connection: redisOptions,
                concurrency: 3,        // Process up to 3 report jobs in parallel
                limiter: {
                    max: 10,           // Max 10 jobs per duration
                    duration: 60000,   // Per minute
                },
            }
        );

        workerInstance.on('completed', (job: any, result: any) => {
            omniLogger.info(LogCategory.SYSTEM, `[ReportWorker] ✅ Job completed: ${job.id}`, result);
        });

        workerInstance.on('failed', (job: any, err: Error) => {
            omniLogger.error(LogCategory.SYSTEM, `[ReportWorker] ❌ Job failed: ${job?.id}`, {
                error: err.message,
                userId: job?.data?.userId,
                type: job?.data?.type,
            });
        });

        workerInstance.on('stalled', (jobId: string) => {
            omniLogger.warn(LogCategory.SYSTEM, `[ReportWorker] ⚠️ Job stalled: ${jobId}`);
        });

        omniLogger.info(LogCategory.SYSTEM, '[ReportWorker] 🚀 Started — listening on esg-reports queue');

    } catch (err: any) {
        omniLogger.warn(
            LogCategory.SYSTEM,
            `[ReportWorker] Failed to start BullMQ worker: ${err.message}. Reports will be generated inline.`
        );
    }
}

export async function stopReportWorker(): Promise<void> {
    if (workerInstance) {
        await workerInstance.close();
        omniLogger.info(LogCategory.SYSTEM, '[ReportWorker] Worker stopped');
    }
}
