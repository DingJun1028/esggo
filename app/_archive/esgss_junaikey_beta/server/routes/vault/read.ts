import { Router } from 'express';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';

const router = Router();

/**
 * GET /api/vault/read?uuid=xxx
 * 讀取指定證據
 */
router.get('/read', async (req, res) => {
    const uuid = req.query.uuid as string;
    const requestId = Math.random().toString(36).substring(7);

    try {
        if (!uuid) {
            return res.status(400).json({
                success: false,
                error: { code: 'MISSING_PARAMETER', message: '缺少參數：uuid' }
            });
        }

        // 🎯 TODO: 從 Supabase 讀取
        // const { data, error } = await supabase.from('evidence_vault').select('*').eq('uuid', uuid).single();

        omniLogger.info(LogCategory.SECURITY, `[Vault] Reading evidence: ${uuid}`);

        return res.json({
            success: true,
            data: {
                uuid,
                timestamp: Date.now(),
                formula: 'E = Σ(AD × EF)',
                impact_metric: { value: 100, unit: 'tCO2e' },
                hash_lock: 'sha256:omni:fake-hash',
                source_origin: 'ISO-14064-1',
                lifecycle_stage: 'verified',
                created_at: Date.now()
            },
            meta: { requestId, timestamp: Date.now() }
        });

    } catch (err: any) {
        omniLogger.error(LogCategory.SECURITY, 'Evidence Vault Read Error', err);
        return res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_ERROR', message: err.message }
        });
    }
});

export default router;
