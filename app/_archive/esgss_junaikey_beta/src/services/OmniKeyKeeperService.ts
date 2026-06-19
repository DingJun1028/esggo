import { IOmniKey, ITrinityState } from '@/types/omni/trinity';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { EvidenceVault } from '@/services/EvidenceVault';
import { OmniUUIDGenerator, OmniEntityPrefix } from '@/utils/OmniUUIDGenerator.js';
import { EventEmitter } from '@/utils/EventEmitter';
import { trinityResonance } from './omni/TrinityResonanceService';

/**
 * 🔑 奧秘元鑰擁有者 (OmniKey Keeper) - 安全、授權與誠信的中樞
 * 
 * 核心哲學：守護知識資產的門徑 (Guardian of the Gate)
 * 負責 JunAiKey 的生命週期管理與 5T 誠信鎖定。
 */
export class OmniKeyKeeperService {
    private static instance: OmniKeyKeeperService;
    private currentKey: IOmniKey | null = null;
    public events: EventEmitter = new EventEmitter();

    private constructor() {
        this.initializeKey();
    }

    public static getInstance(): OmniKeyKeeperService {
        if (!OmniKeyKeeperService.instance) {
            OmniKeyKeeperService.instance = new OmniKeyKeeperService();
        }
        return OmniKeyKeeperService.instance;
    }

    private initializeKey() {
        this.currentKey = {
            id: OmniUUIDGenerator.generate(OmniEntityPrefix.AVATAR),
            guardian: 'Sovereign Administrator',
            level: 10,
            permissions: ['ALL_ACCESS', 'TRINITY_RESONANCE', 'EVIDENCE_SEAL'],
            isLocked: false
        };
        omniLogger.info(LogCategory.SYSTEM as any, `OmniKey Keeper Initialized. Guardian: ${this.currentKey.guardian}`);
    }

    /**
     * 驗證元鑰雜湊 (Verify Key Hash)
     */
    public async verifyKey(keyHash: string): Promise<boolean> {
        // 模擬雜湊驗證邏輯
        const isValid = keyHash.startsWith('OMNI-KEY-');
        if (isValid) {
            omniLogger.info(LogCategory.SYSTEM as any, `Key Hash Verified: ${keyHash.substring(0, 8)}...`);
            return true;
        }
        omniLogger.warn(LogCategory.SYSTEM as any, `Invalid Key Hash detected.`);
        return false;
    }

    /**
     * 封印知識資產 (Seal Knowledge Asset)
     * 使用 JunAiKey 進行最終誠信鎖定。
     */
    public async sealAsset(assetId: string, metadata: any): Promise<string> {
        const sealId = `SEAL-${OmniUUIDGenerator.generate(OmniEntityPrefix.TRANSACTION)}`;

        await EvidenceVault.deposit(
            { assetId, metadata, sealId },
            `seal-${sealId}.json`,
            'application/json',
            'OmniKey Keeper',
            sealId
        );

        omniLogger.info(LogCategory.SYSTEM as any, `Asset ${assetId} sealed with JunAiKey. Seal ID: ${sealId}`);
        this.events.emit('asset_sealed', { assetId, sealId });

        return sealId;
    }

    /**
     * 獲取三元一體安全指標
     */
    public getIntegrityMetrics(): number {
        const base = this.currentKey?.isLocked ? 0.5 : 1.0;
        const resonance = trinityResonance.getCurrentResonance();
        return (base + resonance) / 2;
    }

    public getCurrentKey(): IOmniKey | null {
        return this.currentKey;
    }
}

export const omniKeyKeeper = OmniKeyKeeperService.getInstance();
