
import express, { Request, Response } from 'express';
import { OmniGateway, createOmniRequest } from '../services/OmniGateway.js';
import { omniLogger, LogCategory } from '../../src/omni/infrastructure/logging/OmniLogger.js';

const router = express.Router();
const gateway = OmniGateway.getInstance();

/**
 * POST /api/omni/gateway
 * Central entry point for all Omni Agent/Service requests
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { type, action, payload, context } = req.body;

        if (!type || !action || !payload) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_REQUEST',
                    message: 'Missing required fields: type, action, payload'
                }
            });
        }

        omniLogger.info(LogCategory.API, `[OmniGatewayRoute] Received request: ${type}/${action}`);

        const omniRequest = createOmniRequest(type, action, payload, context);
        const response = await gateway.processRequest(omniRequest);

        if (response.success && response.stream) {
            // Server-Sent Events (SSE) Setup
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();

            try {
                for await (const chunk of response.stream) {
                    // Send data in SSE format: data: <payload>\n\n
                    res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
                }
                res.write('data: [DONE]\n\n');
            } catch (streamError) {
                omniLogger.error(LogCategory.API, '[OmniGatewayRoute] Streaming error', { error: streamError });
                res.write(`event: error\ndata: ${JSON.stringify({ message: 'Stream interrupted' })}\n\n`);
            } finally {
                res.end();
            }
        } else {
            res.status(response.success ? 200 : 400).json(response);
        }

    } catch (error: any) {
        omniLogger.error(LogCategory.API, '[OmniGatewayRoute] Unhandled error', { error: error.message });
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message
            }
        });
    }
});

export default router;
