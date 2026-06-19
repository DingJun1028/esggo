import { Router } from 'express';
import { uccEngine, EvidenceInput } from '../../omni/core/UCCEngine.js';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';

const router = Router();

/**
 * POST /api/vault/write
 * 寫入證據到永恆宮殿
 */
router.post('/write', async (req, res) => {
    const startTime = Date.now();
    try {
        const body: EvidenceInput = req.body;

        // 1. 驗證輸入
        if (!body.formula || !body.impactMetric || !body.sourceOrigin) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_INPUT',
                    message: '缺少必要欄位：formula, impactMetric, sourceOrigin',
                }
            });
        }

        // 2. 使用 UCC Engine 封裝
        const evidence = await uccEngine.sealEvidence(body);

        // 🎯 TODO: 實際寫入 Supabase (透過 supabase client)
        // 目前先模擬成功並記錄日誌
        omniLogger.info(LogCategory.SECURITY, `[Vault] Sealed new evidence: ${evidence.uuid}`, { hash: evidence.hash_lock });

        return res.status(201).json({
            success: true,
            data: evidence,
            meta: {
                latency: Date.now() - startTime,
                timestamp: Date.now()
            }
        });

    } catch (err: any) {
        omniLogger.error(LogCategory.SECURITY, 'Evidence Vault Write Error', err);
        return res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: err.message
            }
        });
    }
});

export default router;
