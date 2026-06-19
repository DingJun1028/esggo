import { redisOptions } from '../src/config/redis.js';
import { createOmniQueue } from './OmniQueue.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

const connection = redisOptions;

// Define Queues
let reportQueue: any | null = null;
let indexingQueue: any | null = null;

// In-memory result storage for fallback mode
const fallbackResults: Map<string, any> = new Map();

const createQueueSafely = async (name: string, opts: any) => {
  try {
    if (process.env.REDIS_FALLBACK_ONLY === 'true') {
      throw new Error('Forced fallback to OmniQueue');
    }
    const { Queue } = await import('bullmq');
    return new Queue(name, opts);
  } catch (err) {
    console.warn(`[QUEUE] BullMQ init failed for ${name}. Stability fallback: OmniQueue.`);

    // In-memory fallback using OmniQueue
    const fallbackQueue = createOmniQueue({
      name: `fallback_${name}`,
      enablePersistence: true,
      maxHistorySize: 500
    });

    return {
      isFallback: true,
      add: async (jobName: string, data: any, addOpts?: any) => {
        omniLogger.warn(LogCategory.SYSTEM, `[QUEUE-FALLBACK] Routing ${jobName} to OmniQueue`, { name, jobName });
        const task = await fallbackQueue.enqueue(jobName, data, {
          priority: addOpts?.priority || 'NORMAL',
          maxAttempts: addOpts?.attempts || 3
        });

        // Inline processing for fallback mode to ensure tasks actually run
        if (jobName === 'generate-report') {
          const { reportGenerationService } = await import('./ReportGenerationService.js');
          (async () => {
            try {
              const report = await reportGenerationService.generateReport(data);
              // Store result for getJob to retrieve
              fallbackResults.set(task.id, {
                success: true,
                id: report.id,
                title: report.title,
                createdAt: report.created_at
              });
            } catch (err: any) {
              omniLogger.error(LogCategory.SYSTEM, `[QUEUE-FALLBACK] Inline task failed`, { error: err.message });
              fallbackResults.set(task.id, {
                success: false,
                error: err.message || 'Unknown error during report generation'
              });
            }
          })();
        }

        return { id: task.id };
      },
      getJob: async (id: string) => {
        const status = await fallbackQueue.getTaskStatus(id);
        if (!status) return null;

        // Map OmniQueue status to BullMQ-like status
        const stateMap: Record<string, string> = {
          'PENDING': 'waiting',
          'PROCESSING': 'active',
          'COMPLETED': 'completed',
          'FAILED': 'failed',
          'RETRYING': 'active'
        };

        const result = fallbackResults.get(id);

        return {
          id,
          getState: async () => {
            if (result && result.success === false) return 'failed';
            if (status === 'COMPLETED' && !result) return 'active'; // Still generating report
            return stateMap[status] || (result ? 'completed' : 'active');
          },
          progress: (status === 'COMPLETED' && result && result.success !== false) ? 100 : (status === 'COMPLETED' ? 90 : 0),
          returnvalue: (result && result.success !== false) ? result : null,
          failedReason: (result && result.success === false) ? result.error : null
        };
      },
      close: async () => { await fallbackQueue.stop(); },
      on: () => { }
    };
  }
};

const getReportQueue = async (): Promise<any> => {
  if (!reportQueue) {
    reportQueue = await createQueueSafely('esg-reports', { connection });
  }
  return reportQueue!;
};

const getIndexingQueue = async (): Promise<any> => {
  if (!indexingQueue) {
    indexingQueue = await createQueueSafely('knowledge-indexing', {
      connection,
    });
  }
  return indexingQueue!;
};

export { reportQueue, indexingQueue, getReportQueue, getIndexingQueue };

/**
 * Add a task to generate an ESG report
 * @param {Object} data - { reportId, type, timeframe, ... }
 */
export const addReportTask = async (data: any) => {
  try {
    const queue = await getReportQueue();
    return await queue.add('generate-report', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  } catch (err) {
    console.warn('[QUEUE] Redis offline. Report task skipped or cached in memory.');
    return { id: 'mock_task_' + Date.now(), status: 'standby' };
  }
};

/**
 * Add a task to index knowledge
 * @param {Object} data - { kbId, text, metadata }
 */
export const addIndexingTask = async (data: any) => {
  try {
    const queue = await getIndexingQueue();
    return await queue.add('index-chunk', data, {
      attempts: 5,
      backoff: {
        type: 'fixed',
        delay: 500,
      },
    });
  } catch (err) {
    console.warn('[QUEUE] Redis offline. Indexing task skipped.');
    return { id: 'mock_index_' + Date.now(), status: 'standby' };
  }
};

// Graceful shutdown helper
export async function closeQueues() {
  console.log('[QUEUE] Closing Queues...');
  try {
    const promises: Promise<void>[] = [];
    if (reportQueue) promises.push(reportQueue.close());
    if (indexingQueue) promises.push(indexingQueue.close());

    await Promise.race([
      Promise.all(promises),
      new Promise(resolve => setTimeout(resolve, 2000)), // Allow more time for local persistence
    ]);
    console.log('[QUEUE] Queues Closed.');
  } catch (err) {
    console.error('[QUEUE] Error closing queues:', err);
  }
}
