// server/controllers/reportController.ts
import { Request, Response } from 'express';
import { reportGenerationService, IReportRequest } from '../services/ReportGenerationService.js';
import { addReportTask, getReportQueue } from '../services/queueService.js';
import redisService from '../services/redisService.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

const HISTORY_CACHE_PREFIX = 'reports:history';
const SINGLE_CACHE_PREFIX = 'reports:single';
const CACHE_TTL_HISTORY = 300; // 5 min
const CACHE_TTL_SINGLE = 300;  // 5 min

// ── POST /api/reports/generate ────────────────────────────────────────────────

export const generateReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, type, itemIds, persona, language, context } = req.body;

        if (!userId || !type) {
            res.status(400).json({ error: 'userId and type are required' });
            return;
        }

        const validTypes = ['ESG_Intelligence', 'Industry_DeepDive', 'Risk_Summary'];
        if (!validTypes.includes(type)) {
            res.status(400).json({ error: `type must be one of: ${validTypes.join(', ')}` });
            return;
        }

        const reportRequest: IReportRequest = { userId, type, itemIds, persona, language, context };

        const job = await addReportTask(reportRequest);

        omniLogger.info(LogCategory.BUSINESS, `[ReportCtrl] Report job enqueued`, {
            jobId: job.id,
            userId,
            type,
        });

        res.status(202).json({
            success: true,
            jobId: job.id,
            message: '報告生成任務已加入佇列 (Report job enqueued)',
            status: 'pending',
        });
    } catch (error: any) {
        omniLogger.error(LogCategory.SYSTEM, `[ReportCtrl] Failed to enqueue report`, { error: error.message });
        res.status(500).json({ error: 'Failed to enqueue report generation', details: error.message });
    }
};

// ── GET /api/reports/status/:jobId ────────────────────────────────────────────

export const getReportStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { jobId } = req.params;
        console.log(`[DEBUG] Polling for jobId: ${jobId}`);
        const queue = await getReportQueue();
        console.log(`[DEBUG] Queue obtained, isFallback: ${queue.isFallback}`);

        // Status lookup (works for BullMQ and our enhanced fallback)
        const job = await queue.getJob(jobId);
        console.log(`[DEBUG] Job lookup result:`, job ? 'found' : 'not found');

        if (!job) {
            res.status(404).json({ error: 'Job not found', jobId });
            return;
        }

        if (!queue.isFallback) {
            // BullMQ job
            const state = await job.getState();
            res.json({
                jobId,
                status: state,
                progress: job.progress,
                result: job.returnvalue || null,
                error: job.failedReason || null,
            });
        } else {
            // OmniQueue fallback
            const state = await job.getState();
            res.json({
                jobId,
                status: state,
                progress: job.progress,
                result: job.returnvalue || null,
                message: '佇列服務啟用降級模式 (Queue in fallback mode)',
            });
        }
    } catch (error: any) {
        console.error('[DEBUG] getReportStatus error:', error);
        omniLogger.error(LogCategory.SYSTEM, `[ReportCtrl] Failed to get job status`, { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'Failed to get report status', details: error.message });
    }
};

// ── GET /api/reports/history ──────────────────────────────────────────────────

export const getReportHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId || req.query.userId as string;
        if (!userId) {
            res.status(400).json({ error: 'userId is required' });
            return;
        }

        const cacheKey = `${HISTORY_CACHE_PREFIX}:${userId}`;
        const cached = await redisService.get<any[]>(cacheKey);
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            res.json({ success: true, data: cached, count: cached.length });
            return;
        }

        const reports = await reportGenerationService.getReportHistory(userId);
        await redisService.set(cacheKey, reports, CACHE_TTL_HISTORY);

        res.setHeader('X-Cache', 'MISS');
        res.json({ success: true, data: reports, count: reports.length });
    } catch (error: any) {
        omniLogger.error(LogCategory.SYSTEM, `[ReportCtrl] Failed to get report history`, { error: error.message });
        res.status(500).json({ error: 'Failed to get report history', details: error.message });
    }
};

// ── GET /api/reports/:id ──────────────────────────────────────────────────────

export const getReportById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const cacheKey = `${SINGLE_CACHE_PREFIX}:${id}`;

        const cached = await redisService.get<any>(cacheKey);
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            res.json({ success: true, data: cached });
            return;
        }

        const report = await reportGenerationService.getReportById(id);
        if (!report) {
            res.status(404).json({ error: 'Report not found', id });
            return;
        }

        await redisService.set(cacheKey, report, CACHE_TTL_SINGLE);
        res.setHeader('X-Cache', 'MISS');
        res.json({ success: true, data: report });
    } catch (error: any) {
        omniLogger.error(LogCategory.SYSTEM, `[ReportCtrl] Failed to get report by id`, { error: error.message });
        res.status(500).json({ error: 'Failed to get report', details: error.message });
    }
};

// ── DELETE /api/reports/:id ───────────────────────────────────────────────────

export const deleteReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await reportGenerationService.deleteReport(id);

        // Invalidate single report cache
        await redisService.del(`${SINGLE_CACHE_PREFIX}:${id}`);
        // Invalidate all history caches (user-agnostic purge)
        await redisService.delByPattern(`${HISTORY_CACHE_PREFIX}:*`);

        omniLogger.info(LogCategory.BUSINESS, `[ReportCtrl] Report deleted`, { id });
        res.json({ success: true, message: 'Report deleted', id });
    } catch (error: any) {
        omniLogger.error(LogCategory.SYSTEM, `[ReportCtrl] Failed to delete report`, { error: error.message });
        res.status(500).json({ error: 'Failed to delete report', details: error.message });
    }
};
