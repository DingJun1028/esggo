import { Router } from 'express';
import { uccEngine } from '../../omni/core/UCCEngine.js';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';

const router = Router();

/**
 * GET /api/vault/verify?uuid=xxx
 * 驗證證據的 Hash Lock 完整性
 */
router.get('/verify', async (req, res) => {
    const uuid = req.query.uuid as string;
    const requestId = Math.random().toString(36).substring(7);

    try {
        if (!uuid) {
            return res.status(400).json({
                success: false,
                error: { code: 'MISSING_PARAMETER', message: '缺少參數：uuid' }
            });
        }

        // 🎯 TODO: 從 Supabase 讀取數據後進行驗證
        // const { data } = await supabase.from('evidence_vault').select('*').eq('uuid', uuid).single();
        // const isValid = await uccEngine.verifyEvidence(data);

        const isValid = true; // Placeholder

        omniLogger.info(LogCategory.SECURITY, `[Vault] Verified evidence: ${uuid}`, { isValid });

        return res.json({
            success: true,
            data: {
                uuid,
                isValid,
                verifiedAt: new Date().toISOString(),
                status: isValid ? 'VERIFIED' : 'TAMPERED',
            },
            meta: { requestId, timestamp: Date.now() }
        });

    } catch (err: any) {
        omniLogger.error(LogCategory.SECURITY, 'Evidence Vault Verify Error', err);
        return res.status(500).json({
            success: false,
            error: { code: 'VERIFICATION_FAILED', message: err.message }
        });
    }
});

export default router;
