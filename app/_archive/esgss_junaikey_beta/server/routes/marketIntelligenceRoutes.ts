import express, { Request, Response, NextFunction } from 'express';
import { marketIntelligenceCrawler } from '../services/MarketIntelligenceCrawler.js';
import redisService from '../services/redisService.js';
import { writeLimiter, readLimiter } from '../middleware/rateLimiters.js';
import omniReportService from '../services/omniReport.js';
import dailyBriefingService from '../services/DailyBriefingService.js';
import complianceMonitorService from '../services/ComplianceMonitorService.js';
import { OmniError, ErrorCode, ValidationError } from '../utils/omniError.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

const router = express.Router();
import { cacheMiddleware, invalidateCache } from '../middleware/cacheMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * @route POST /api/market/reports/generate
 * @desc Generate a 5T-compliant ESG report from market intelligence
 */
router.post('/reports/generate', asyncHandler(async (req: Request, res: Response) => {
    const { topic, company, format = 'pdf', limit = 10 } = req.body;

    const result: any = await omniReportService.generateReport(format, { topic, company, limit });

    if (format === 'pdf' && result.buffer) {
        res.setHeader('Content-Type', result.contentType);
        res.setHeader('Content-Disposition', `attachment; filename=${result.filename}`);
        return res.send(result.buffer);
    }

    return res.json({
        success: true,
        data: result
    });
}));

/**
 * @route POST /api/market/reports/benchmark
 * @desc Generate a benchmarking report comparing multiple companies
 */
router.post('/reports/benchmark', asyncHandler(async (req: Request, res: Response) => {
    const { companies, topic = 'ESG', limit = 5 } = req.body;

    if (!companies || !Array.isArray(companies) || companies.length < 2) {
        throw new ValidationError('At least two companies are required for benchmarking.');
    }

    const result: any = await omniReportService.generateBenchmarkReport(companies, { topic, limit });

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${result.filename}`);
    return res.send(result.buffer);
}));

/**
 * @route POST /api/market/crawl
 * @desc Search and crawl ESG news for a company
 */
router.post('/crawl', writeLimiter, asyncHandler(async (req: Request, res: Response) => {
    const { query: companyName, url } = req.body;

    if (!companyName && !url) {
        throw new ValidationError('Query or URL is required');
    }

    let results: any[] = [];
    if (url) {
        // Direct URL crawling
        const content = await marketIntelligenceCrawler.extractContent(url);
        results = [{
            title: 'Direct URL Analysis',
            url: url,
            content: content,
            source: new URL(url).hostname,
            snippet: content ? content.substring(0, 200) : 'No content extracted'
        }];
    } else {
        // Search-based crawling
        results = await marketIntelligenceCrawler.searchMarket(companyName);
        // For the top 3 results, try full content extraction
        for (let i = 0; i < Math.min(results.length, 3); i++) {
            const content = await marketIntelligenceCrawler.extractContent(results[i].url);
            if (content) results[i].content = content;
        }
    }

    // Save to database
    await marketIntelligenceCrawler.saveArticles(results, companyName || 'General');

    // [REDIS] Invalidate news cache on new crawl (5T Transparent)
    await invalidateCache('market_news:*');
    await invalidateCache('market_briefing:*');
    omniLogger.info(LogCategory.DATA, '[CACHE] Invalidated Market Intelligence cache due to new crawl');

    return res.json({
        success: true,
        data: results
    });
}));

/**
 * @route GET /api/market/news
 * @desc Fetch collected ESG news articles
 */
router.get('/news', readLimiter, cacheMiddleware({ ttl: 600, keyPrefix: 'market_news' }), asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;

    const news = await marketIntelligenceCrawler.fetchCollectedNews(limit);

    return res.json({
        success: true,
        data: news,
        source: 'database'
    });
}));

/**
 * @route GET /api/market/briefing
 * @desc Get the Daily Sentinel ESG Observation
 */
router.get('/briefing', readLimiter, cacheMiddleware({ ttl: 3600, keyPrefix: 'market_briefing' }), asyncHandler(async (req: Request, res: Response) => {
    const briefing = await dailyBriefingService.generateDailyBriefing();
    return res.json({
        success: true,
        data: briefing
    });
}));

/**
 * @route GET /api/market/incidents
 * @desc Get unresolved high-risk ESG incidents
 */
router.get('/incidents', readLimiter, cacheMiddleware({ ttl: 300, keyPrefix: 'market_incidents' }), asyncHandler(async (req: Request, res: Response) => {
    // Trigger a scan to ensure we have the latest
    await complianceMonitorService.scanForRisks();
    const incidents = await complianceMonitorService.getUnresolvedIncidents();

    return res.json({
        success: true,
        data: incidents
    });
}));

export default router;


