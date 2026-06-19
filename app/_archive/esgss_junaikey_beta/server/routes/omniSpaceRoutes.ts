import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { omniSpaceService } from '../src/services/integration/OmniSpaceService.js';
import { MappingEngine, L1AssessmentToOmniMap } from '../src/services/integration/MappingEngine.js';
import { supabase } from '../db/supabaseClient.js';

const router = express.Router();

// protect standard routes with auth
// Webhooks usually need a different auth mechanism (e.g. signature verification) or be public with a secret query param
// For now, we'll keep webhook open but log heavily, or expect a ?secret=XYZ param

/**
 * @openapi
 * /api/integrations/omni-space/webhook:
 *   post:
 *     summary: Receive updates from OmniSpace
 *     tags: [Integrations]
 *     parameters:
 *       - in: query
 *         name: secret
 *         schema:
 *           type: string
 *         description: Webhook secret for verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received successfully
 *       500:
 *         description: Server error
 */
router.post('/webhook', async (req: Request, res: Response) => {
    const secret = req.query.secret;

    // Basic security check (in production, use a signature header)
    if (secret !== process.env.OMNI_SPACE_WEBHOOK_SECRET && process.env.NODE_ENV === 'production') {
        // omniLogger.warn(LogCategory.SECURITY, 'OmniSpace Webhook: Invalid Secret');
        // return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const payload = req.body;
        omniLogger.info(LogCategory.INTEGRATION, 'Received OmniSpace Webhook', { payload });

        // TODO: Implement specific logic based on payload.module or payload.type
        // For now, we just acknowledge receipt.

        res.status(200).json({ received: true });
    } catch (error: any) {
        omniLogger.error(LogCategory.INTEGRATION, 'Error processing OmniSpace Webhook', { error: error.message });
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/integrations/omni-space/sync/l1-assessment/{id}:
 *   post:
 *     summary: Manually sync an L1 Assessment to OmniSpace
 *     tags: [Integrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the L1 Assessment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetUrl:
 *                 type: string
 *                 description: The OmniSpace webhook URL to push data to
 *     responses:
 *       200:
 *         description: Sync successful
 */
router.post('/sync/l1-assessment/:id', authenticateToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    const targetWebhookUrl = req.body.targetUrl; // Allow client to specify which Omni module URL

    if (!targetWebhookUrl) {
        res.status(400).json({ error: 'Target Webhook URL is required' });
        return;
    }

    try {
        // 1. Fetch the assessment
        const { data: assessment, error } = await supabase
            .from('l1_assessments')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !assessment) {
            res.status(404).json({ error: 'Assessment not found' });
            return;
        }

        // 2. Transform the data
        const mappedData = MappingEngine.transform(assessment, L1AssessmentToOmniMap);

        // 3. Push to OmniSpace
        const success = await omniSpaceService.pushEntity(targetWebhookUrl, mappedData);

        if (success) {
            res.json({ success: true, mappedData });
        } else {
            res.status(502).json({ error: 'Failed to push to OmniSpace' });
        }

    } catch (error: any) {
        omniLogger.error(LogCategory.INTEGRATION, 'Error during manual sync', { error: error.message });
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
