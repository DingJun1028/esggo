/**
 * UCC Engine (Universal Carbon Chronicle)
 * InfoOne v8.1.0 核心引擎 - 實作 OmniInfoCrystal 三位一體結晶架構
 */
import { OmniInfoCrystal, SealInput } from '../src/shared/types/ucc.types';
export declare class UCCEngine {
    /**
     * 封裝數據並寫入 Evidence Vault
     */
    sealEvidence(input: SealInput): Promise<OmniInfoCrystal>;
    /**
     * 核心度量：Rs 共鳴算力計算
     */
    private calculateResonance;
    /**
     * 計算符合確定性的 Hash Lock
     */
    private computeHashLock;
    /**
     * 批次封裝多筆數據
     */
    batchSeal(inputs: SealInput[]): Promise<OmniInfoCrystal[]>;
    /**
     * 生命週期管理：更新狀態（透過新建記錄實現不可篡改）
     */
    transitionLifecycle(uuid: string, newStage: 'draft' | 'verified' | 'published' | 'archived'): Promise<OmniInfoCrystal>;
    /**
     * 驗證證據完整性 (Verify)
     */
    verifyEvidence(uuid: string): Promise<boolean>;
    /**
     * 溯源 (Trace)：查詢結晶的生命週期與任督二脈能量流
     */
    traceEvidence(uuid: string): Promise<{
        evidence: never;
        isValid: boolean;
        auditTrail: never[];
        stream: {
            ren: string;
            du: string;
        };
    }>;
}
export declare const uccEngine: UCCEngine;
//# sourceMappingURL=ucc-engine.d.ts.map