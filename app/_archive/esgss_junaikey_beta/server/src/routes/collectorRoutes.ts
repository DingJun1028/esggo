import { Router, Request, Response } from 'express';
import multer from 'multer';
import { OmniCollectorService } from '../services/OmniCollectorService.js';
import { slowDownMiddleware, apiRateLimiter } from '../middleware/security.js';

const router = Router();
const collectorService = OmniCollectorService.getInstance();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB Limit
    },
});

/**
 * @route   POST /api/collector/collect
 * @desc    Collect ESG data from uploaded document
 * @access  Private
 */
router.post(
    '/collect',
    slowDownMiddleware,
    apiRateLimiter,
    upload.single('file'),
    async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'No file uploaded',
                });
            }

            const file = {
                name: req.file.originalname,
                type: req.file.mimetype,
                buffer: req.file.buffer,
                size: req.file.size,
            };

            // Set up SSE headers
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const result = await collectorService.collectFromDocument(file, (progress) => {
                res.write(`data: ${JSON.stringify({ type: 'PROGRESS', payload: progress })}\n\n`);
            });

            res.write(`data: ${JSON.stringify({ type: 'RESULT', payload: result })}\n\n`);
            return res.end();
        } catch (error: any) {
            console.error('❌ OmniCollector Route Error:', error);
            const errorMessage = error.message || 'Data collection failed';
            if (!res.headersSent) {
                return res.status(500).json({ success: false, error: errorMessage });
            } else {
                res.write(`data: ${JSON.stringify({ type: 'ERROR', payload: { message: errorMessage } })}\n\n`);
                return res.end();
            }
        }
    }
);

/**
 * @route   POST /api/collector/finalize
 * @desc    Finalize collected metrics to Trinity System
 * @access  Private
 */
router.post(
    '/finalize',
    slowDownMiddleware,
    apiRateLimiter,
    async (req: Request, res: Response) => {
        try {
            const { result, identityPatch } = req.body;
            if (!result) {
                return res.status(400).json({
                    success: false,
                    error: 'No collection result provided',
                });
            }

            const finalAsset = await collectorService.finalizeToTrinity(result, identityPatch || {});

            return res.status(200).json({
                success: true,
                data: finalAsset,
            });
        } catch (error: any) {
            console.error('❌ OmniCollector Finalization Error:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Finalization failed',
            });
        }
    }
);

export default router;
