/**
 * LicensingService.ts
 * [💎核心] 授權與權限引擎 - 控制 5T 協議的功能存取
 */

import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';

export type SubscriptionTier = 'BASIC' | 'PRO' | 'MASTER';

export interface IPermission {
    feature: string;
    description: string;
    minTier: SubscriptionTier;
}

const FEATURE_PERMISSIONS: Record<string, IPermission> = {
    'MANUAL_REPORT': { feature: 'MANUAL_REPORT', description: '手動編寫報告', minTier: 'BASIC' },
    'MODULAR_ASSEMBLY': { feature: 'MODULAR_ASSEMBLY', description: '模組化 AI 組裝', minTier: 'PRO' },
    'SENTINEL_AUDIT': { feature: 'SENTINEL_AUDIT', description: 'AI 合規審計', minTier: 'PRO' },
    'FINAL_4T_SEAL': { feature: 'FINAL_4T_SEAL', description: '終極 4T 全域封裝', minTier: 'MASTER' },
    'PQC_ENCRYPTION': { feature: 'PQC_ENCRYPTION', description: '量子安全加密', minTier: 'MASTER' },
    'EVIDENCE_LINKS': { feature: 'EVIDENCE_LINKS', description: '證據鏈追蹤', minTier: 'BASIC' },
};

export class LicensingService {

    /**
     * 檢查使用者是否有權限存取特定功能
     * @param tier 使用者目前的訂閱等級
     * @param featureKey 功能識別碼
     */
    public checkPermission(tier: SubscriptionTier, featureKey: string): boolean {
        const permission = FEATURE_PERMISSIONS[featureKey];
        if (!permission) {
            omniLogger.warn(LogCategory.SEC, `Unknown feature requested for licensing: ${featureKey}`);
            return false;
        }

        const tierWeights: Record<SubscriptionTier, number> = {
            'BASIC': 1,
            'PRO': 2,
            'MASTER': 3
        };

        const hasAccess = tierWeights[tier] >= tierWeights[permission.minTier];

        if (!hasAccess) {
            omniLogger.info(LogCategory.SEC, `[Licensing] Access denied to ${featureKey} for tier ${tier}. Requires ${permission.minTier}.`);
        }

        return hasAccess;
    }

    /**
     * 獲取目前等級的所有可用功能清單
     */
    public getAvailableFeatures(tier: SubscriptionTier): string[] {
        return Object.keys(FEATURE_PERMISSIONS).filter(k => this.checkPermission(tier, k));
    }
}

export const licensingService = new LicensingService();
