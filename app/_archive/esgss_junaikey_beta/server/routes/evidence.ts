/**
 * 📦 Evidence Vault API Routes
 * Sprint 2: Evidence Upload with Hash Lock
 * --------------------------------------------------
 * POST /api/evidence/upload - Upload evidence with 5T Protocol
 * GET /api/evidence/list - List user's evidence
 * GET /api/evidence/:id - Get evidence details
 * POST /api/evidence/:id/lock - Execute Hash Lock
 * GET /api/evidence/verify/:hash - Verify evidence integrity
 */

import express, { Request, Response } from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { EvidenceVaultService } from '../services/EvidenceVaultService.js';
import type {
    EvidenceMetadata,
    EvidenceUploadResponse,
    EvidenceListQuery
} from '../../src/types/esg-go/evidence-vault.types.js';

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Configure multer for file upload (temporary storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/csv'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

/**
 * @openapi
 * /api/evidence/upload:
 *   post:
 *     summary: Upload Evidence with Hash Lock
 *     description: 上傳證據檔案並執行 5T Protocol 驗證與 Hash Lock
 *     tags:
 *       - Evidence Vault
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               category:
 *                 type: string
 *                 enum: [governance, environmental, social, financial, operational, certification, other]
 *               subType:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               l1AssessmentId:
 *                 type: string
 *                 format: uuid
 *               autoLock:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       200:
 *         description: Evidence uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 evidenceId:
 *                   type: string
 *                 fileUrl:
 *                   type: string
 *                 fileHash:
 *                   type: string
 *                 isLocked:
 *                   type: boolean
 *       400:
 *         description: Invalid file or parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        // 0. Verify authentication
        if (!(req as any).user || !(req as any).user.id) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: '請先登入才能上傳證據'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded',
                message: '請選擇要上傳的檔案'
            });
        }

        const file = req.file;
        const user = req.user as any;
        const userId = user.id;
        const {
            category,
            subType,
            description,
            tags,
            l1AssessmentId,
            autoLock = true
        } = req.body;

        // 1. Validate file type and size
        const fileType = file.mimetype.split('/')[1];
        if (!EvidenceVaultService.validateFileType(fileType)) {
            return res.status(400).json({
                error: 'Invalid file type',
                message: '不支援的檔案格式'
            });
        }

        if (!EvidenceVaultService.validateFileSize(file.size)) {
            return res.status(400).json({
                error: 'File too large',
                message: '檔案大小超過 50MB 限制'
            });
        }

        // 2. Calculate file hash
        const fileHash = EvidenceVaultService.calculateFileHash(file.buffer);

        // 3. Check for duplicate (same hash)
        const { data: existingEvidence } = await supabase
            .from('evidence_vault')
            .select('id, file_name')
            .eq('file_hash_sha256', fileHash)
            .single();

        if (existingEvidence) {
            return res.status(409).json({
                error: 'Duplicate file',
                message: `此檔案已存在 (${existingEvidence.file_name})`
            });
        }

        // 4. Upload to Supabase Storage
        const fileName = `${userId}/${Date.now()}_${file.originalname}`;
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('evidence-vault')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (uploadError) {
            throw new Error(`Storage upload failed: ${uploadError.message}`);
        }

        // 5. Get public URL
        const { data: urlData } = supabase
            .storage
            .from('evidence-vault')
            .getPublicUrl(fileName);

        const fileUrl = urlData.publicUrl;

        // 6. Calculate metadata hash
        const metadata: EvidenceMetadata = {
            fileName: file.originalname,
            fileType,
            fileSizeBytes: file.size,
            category,
            subType,
            tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
            description,
            uploadedBy: user.name || user.email,
            department: user.department
        };

        const metadataHash = EvidenceVaultService.calculateMetadataHash(metadata);

        // 7. Suggest tags
        const suggestedTags = EvidenceVaultService.suggestTags(category, file.originalname);

        // 8. Insert into database
        const { data: insertedData, error: insertError } = await supabase
            .from('evidence_vault')
            .insert({
                user_id: userId,
                company_id: user.companyId || null,
                l1_assessment_id: l1AssessmentId || null,
                file_name: file.originalname,
                file_type: fileType,
                file_size_bytes: file.size,
                file_url: fileUrl,
                evidence_category: category,
                evidence_sub_type: subType || null,
                tags: metadata.tags,
                description: description || null,
                file_hash_sha256: fileHash,
                metadata_hash: metadataHash,
                is_locked: autoLock,
                locked_at: autoLock ? new Date().toISOString() : null,
                source_origin: 'web_upload',
                uploaded_by_name: metadata.uploadedBy,
                department: metadata.department || null,
                visibility: 'private',
                status: 'active'
            })
            .select('id, created_at')
            .single();

        if (insertError) {
            throw new Error(`Database insert failed: ${insertError.message}`);
        }

        // 9. Execute Hash Lock (if auto-lock enabled)
        let lockResult: any = undefined;
        if (autoLock) {
            lockResult = EvidenceVaultService.performHashLock(
                insertedData.id,
                fileHash,
                metadataHash
            );
        }

        // 10. Calculate QA contribution
        const qaContribution = EvidenceVaultService.calculateQAContribution(
            category,
            'pending',
            autoLock
        );

        // 11. Return success response
        const response: EvidenceUploadResponse = {
            success: true,
            evidenceId: insertedData.id,
            fileUrl,
            fileHash,
            metadataHash,
            isLocked: autoLock,
            lockResult: lockResult || undefined,
            suggestedTags,
            qaContribution
        };

        return res.status(200).json(response);

    } catch (error: any) {
        console.error('Evidence upload error:', error);
        return res.status(500).json({
            error: 'Upload failed',
            message: error.message || '檔案上傳失敗，請稍後再試'
        });
    }
});

/**
 * GET /api/evidence/list
 * 獲取用戶的證據清單
 */
router.get('/list', async (req: Request, res: Response) => {
    try {
        if (!(req as any).user || !(req as any).user.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const {
            category,
            isLocked,
            limit = 20,
            offset = 0
        } = req.query as EvidenceListQuery;

        let query = supabase
            .from('evidence_vault')
            .select('*', { count: 'exact' })
            .eq('user_id', (req as any).user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (category) {
            query = query.eq('evidence_category', category);
        }

        if (isLocked !== undefined) {
            query = query.eq('is_locked', isLocked);
        }

        const { data, error, count } = await query
            .range(Number(offset), Number(offset) + Number(limit) - 1);

        if (error) {
            throw new Error(`Query failed: ${error.message}`);
        }

        return res.json({
            total: count || 0,
            evidence: data || []
        });

    } catch (error: any) {
        console.error('Evidence list error:', error);
        return res.status(500).json({ error: 'Failed to fetch evidence list' });
    }
});

/**
 * POST /api/evidence/:id/lock
 * 執行 Hash Lock (不可逆操作)
 */
router.post('/:id/lock', async (req: Request, res: Response) => {
    try {
        if (!(req as any).user || !(req as any).user.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.params;

        // 1. Get evidence
        const { data: evidence, error: fetchError } = await supabase
            .from('evidence_vault')
            .select('*')
            .eq('id', id)
            .eq('user_id', (req as any).user.id)
            .single();

        if (fetchError || !evidence) {
            return res.status(404).json({
                error: 'Not found',
                message: '找不到指定的證據'
            });
        }

        if (evidence.is_locked) {
            return res.status(400).json({
                error: 'Already locked',
                message: '此證據已被鎖定，無法再次鎖定'
            });
        }

        // 2. Execute Hash Lock
        const lockResult = EvidenceVaultService.performHashLock(
            evidence.id,
            evidence.file_hash_sha256,
            evidence.metadata_hash
        );

        // 3. Update database
        const { error: updateError } = await supabase
            .from('evidence_vault')
            .update({
                is_locked: true,
                locked_at: lockResult.lockedAt.toISOString()
            })
            .eq('id', id);

        if (updateError) {
            throw new Error(`Lock update failed: ${updateError.message}`);
        }

        return res.json({
            success: true,
            ...lockResult
        });

    } catch (error: any) {
        console.error('Evidence lock error:', error);
        return res.status(500).json({ error: 'Lock operation failed' });
    }
});

export default router;
