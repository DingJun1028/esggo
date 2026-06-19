import express, { Request, Response } from 'express';
import { VerificationService } from '../services/VerificationService.js';

const router = express.Router();
const verificationService = new VerificationService();

interface VerificationResponse {
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
}

/**
 * GET /api/verification/:uuid
 * Verifies an asset by UUID using the 5T Sentinel Protocol.
 */
router.get('/:uuid', async (req: Request, res: Response<VerificationResponse>) => {
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

    res.json({
      success: true,
      data: proof,
      message: 'Asset verified successfully via 5T Protocol.',
    });
  } catch (error: unknown) {
    console.error('Verification Error:', error);
    const err = error instanceof Error ? error : new Error(String(error));
    res.status(500).json({
      success: false,
      message: 'Internal Verification Error',
      error: err.message,
    });
  }
});

export default router;
