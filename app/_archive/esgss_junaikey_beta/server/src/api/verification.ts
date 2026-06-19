import express from 'express';
import { VerificationService } from '../services/VerificationService.js';

const router = express.Router();
const verificationService = new VerificationService();
import { cacheMiddleware } from '../../middleware/cacheMiddleware.js';

/**
 * GET /api/verification/:uuid
 * Verifies an asset by UUID using the 5T Sentinel Protocol.
 */
router.get('/:uuid', cacheMiddleware({ ttl: 3600, keyPrefix: 'verify' }), async (req, res) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      res.status(400).json({
        success: false,
        message: 'UUID is required for verification.',
      });
      return;
    }

    const proof = await verificationService.verifyAsset(uuid);

    // Simulate network delay for effect (TBC) - remove if immediate is preferred
    // await new Promise(resolve => setTimeout(resolve, 500));

    res.json({
      success: true,
      data: proof,
      message: 'Asset verified successfully via 5T Protocol.',
    });
  } catch (error: any) {
    console.error('Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Verification Error',
      error: error.message,
    });
  }
});

/**
 * POST /api/verification/multi-agent/verify
 * Execute a Multi-Agent Verification Flow.
 * Body: { taskName, executorParams, verifierParams, userId }
 */
router.post('/multi-agent/verify', async (req, res) => {
  try {
    const { taskName, executorParams, verifierParams, userId } = req.body;

    if (!taskName) {
      res.status(400).json({ success: false, message: 'taskName is required.' });
      return;
    }

    const { multiAgentVerificationService } = await import(
      '../../services/ai/flows/MultiAgentVerificationService.js'
    );

    const result = await multiAgentVerificationService.executeVerifiedFlow(
      taskName,
      executorParams || {},
      verifierParams || {},
      userId || 'current-user'
    );

    res.json({
      success: true,
      data: result,
      message: result.success
        ? 'Multi-Agent Verification completed & sealed.'
        : 'Verification failed — agents could not reach consensus.',
    });
  } catch (error: any) {
    console.error('Multi-Agent Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Multi-Agent Verification Error',
      error: error.message,
    });
  }
});

export default router;
