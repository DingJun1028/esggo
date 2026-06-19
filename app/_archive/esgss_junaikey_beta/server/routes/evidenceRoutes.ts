// server/routes/evidenceRoutes.ts
import express, { Request, Response, NextFunction } from 'express';
import * as evidenceService from '../services/evidenceService.js';
import { supabase } from '../db/supabaseClient.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

import { upload } from '../middleware/uploadMiddleware.js';
import * as storageService from '../services/storageService.js';
import { ValidationError, OmniError, NotFoundError } from '../utils/omniError.js';
import fs from 'fs';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

const router = express.Router();

// Apply authentication to all routes in this router
router.use(authenticateToken);

/**
 * POST /api/evidence
 * Uploads a new piece of evidence.
 * Supports multipart/form-data.
 */
router.post('/', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new ValidationError('No file uploaded', 'MISSING_FILE'));
  }

  const localFilePath = req.file.path;
  const { data_type, description } = req.body;
  // User ID is attached by authenticateToken middleware (req.user)
  // We need to extend the Request type or cast it. using 'any' for now or the defined user type if available.
  const userId = (req as any).user?.id;

  try {
    // 1. Upload to storage (e.g. GCS/S3 or local)
    const storagePath = await storageService.uploadFile(localFilePath);

    // 2. Add to database
    // Note: OCR is optional for generic evidence.
    const evidenceData = {
      storage_path: storagePath,
      local_path: localFilePath, // Pass local path for hashing
      data_type: data_type || 'generic_evidence',
      user_id: userId,
      description: description
    } as any;

    const newEvidence = await evidenceService.addEvidence(evidenceData);

    omniLogger.info(LogCategory.SYSTEM, `[Evidence] New evidence uploaded: ${newEvidence.id}`);
    return res.status(201).json({
      success: true,
      data: newEvidence
    });
  } catch (error: unknown) {
    omniLogger.error(LogCategory.SYSTEM, 'Error uploading evidence', { error });
    return next(error);
  } finally {
    // cleanup local file
    if (fs.existsSync(localFilePath)) {
      fs.unlink(localFilePath, () => { });
    }
  }
});

/**
 * GET /api/evidence/mine
 * Retrieves all evidence uploaded by the authenticated user.
 */
router.get('/mine', async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  try {
    const evidenceList = await evidenceService.getUserEvidence(userId);
    return res.json({
      success: true,
      data: evidenceList
    });
  } catch (error: unknown) {
    omniLogger.error(LogCategory.SYSTEM, 'Error fetching user evidence', { userId, error });
    return next(error);
  }
});

/**
 * GET /api/evidence/pending
 * Retrieves all evidence records that are pending validation.
 */
router.get('/pending', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pendingEvidence = await evidenceService.getPendingEvidence();
    return res.json({
      success: true,
      data: pendingEvidence
    });
  } catch (error: unknown) {
    omniLogger.error(LogCategory.SYSTEM, 'Error fetching pending evidence', { error });
    return next(error);
  }
});

/**
 * PUT /api/evidence/:id/status
 * Updates the status of a specific evidence record.
 * Expects a body like: { "status": "approved" | "rejected", "validatorUserId": 1 }
 */
router.put('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status, validatorUserId } = req.body as { status?: string; validatorUserId?: number };

  if (!status || (status !== 'approved' && status !== 'rejected')) {
    return next(new ValidationError("Invalid status. Must be 'approved' or 'rejected'."));
  }

  try {
    const updatedEvidence = await evidenceService.updateEvidenceStatus(
      parseInt(id, 10),
      status as any,
      validatorUserId
    );
    return res.json({
      success: true,
      data: updatedEvidence
    });
  } catch (error: unknown) {
    omniLogger.error(LogCategory.SYSTEM, `Error updating status for evidence ${id}`, { error });
    return next(error);
  }
});

/**
 * GET /api/evidence/:id/history
 * Retrieves the complete audit trail for a single evidence item.
 * Protected Route: Requires any authenticated user.
 */
router.get('/:id/history', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
            action,
            details,
            timestamp,
            users ( email )
        `)
      .eq('target_type', 'evidence')
      .eq('target_id', id)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    const formattedData = data.map((row: any) => ({
      action: row.action,
      details: row.details,
      timestamp: row.timestamp,
      user_email: row.users?.email
    }));

    return res.json({
      success: true,
      data: formattedData
    });
  } catch (error: unknown) {
    omniLogger.error(LogCategory.SYSTEM, `Error fetching history for evidence ${id}`, { error });
    return next(error);
  }
});

export default router;
