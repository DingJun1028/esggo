import { reportQueue, indexingQueue } from '../services/queueService.js';
import dotenv from 'dotenv';
import redisService from '../services/redisService.js';

dotenv.config();

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
};

let reportWorker = null;
let indexingWorker = null;

export const initWorkers = async () => {
  // 🛡️ Sentinel: Do not initialize workers if Redis is unavailable (Resilience Mode)
  if (redisService.useMemoryFallback || process.env.REDIS_FALLBACK_ONLY === 'true') {
    console.warn(
      '[WORKER] [OFFLINE] Redis offline or Fallback Mode. Background workers will remain in standby (Resilient Mode).'
    );
    return;
  }

  console.log('[WORKER] [STARTUP] Initializing BullMQ Workers...');

  try {
    const { Worker } = await import('bullmq');

    // 1. ✅ Report Generation Worker — upgraded to real ReportGenerationService
    const { reportGenerationService } = await import('../services/ReportGenerationService.js');

    reportWorker = new Worker(
      'esg-reports',
      async job => {
        console.log(`[WORKER:REPORT] Processing job ${job.id}: ${job.name}`);

        await job.updateProgress(10);
        const report = await reportGenerationService.generateReport(job.data);
        await job.updateProgress(100);

        console.log(`[WORKER:REPORT] Job ${job.id} completed → reportId: ${report.id}`);
        return { reportId: report.id, title: report.title, createdAt: report.created_at };
      },
      {
        connection,
        concurrency: 3,
        limiter: { max: 10, duration: 60000 },
      }
    );

    reportWorker.on('completed', job => {
      console.log(`[WORKER:REPORT] ✅ Job ${job.id} finished!`);
    });

    reportWorker.on('failed', (job, err) => {
      console.error(`[WORKER:REPORT] ❌ Job ${job?.id} failed: ${err.message}`);
    });

    // 2. Knowledge Indexing Worker (unchanged)
    indexingWorker = new Worker(
      'knowledge-indexing',
      async job => {
        console.log(`[WORKER:INDEX] Processing job ${job.id}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { status: 'indexed', chunks: 5 };
      },
      { connection }
    );

    console.log('[WORKER] Workers are online and listening.');
  } catch (err) {
    console.error('[WORKER] [ERROR] Failed to start BullMQ workers:', err.message);
    console.warn('[WORKER] 🛡️ Proceeding without background workers.');
  }
};

export const closeWorkers = async () => {
  if (reportWorker) await reportWorker.close();
  if (indexingWorker) await indexingWorker.close();
  console.log('[WORKER] Workers shut down.');
};
