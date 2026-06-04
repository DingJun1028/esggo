import { IComponentCore, IEvidence, T5GateState, EternalMemory, RestorationInput, EternalMemoryType } from '../src/shared/types/index.ts';
import type { ZKPRangeProof } from './crypto-proof.ts';
import type { PolicyValidationResult } from './policy-engine.ts';
/**
 * OmniCore: 系統之核心中樞 (The Sacred Core)
 * v2.5 | #OmniCore #Sovereignty #HardenedSecurity
 */
export declare class OmniCore {
    private static instance;
    private constructor();
    static getInstance(): OmniCore;
    getIdentity(): Promise<{
        user_id: string;
        company_id: string;
    }>;
    validateT5Gate(evidence: IEvidence): T5GateState;
    /**
     * 無上意志：結晶化指令
     * 將節點轉化為不可篡改之晶體。
     */
    crystallize(uuid: string): Promise<void>;
    sealComponent(metric: string, source: string, formula: string, trigger?: string, policyId?: string): Promise<IComponentCore & {
        validation?: PolicyValidationResult;
    }>;
    /**
     * 萬能修復：被動天賦激活
     * 當偵測到數據偏差或亂碼時觸發
     */
    restoreComponent(faultyData: RestorationInput): Promise<IComponentCore>;
    verifyComponent(component: IComponentCore): Promise<boolean>;
    calculateTrustScore(): Promise<number>;
    storeMemory(content: string, type?: EternalMemoryType): Promise<EternalMemory>;
    getMemories(): Promise<EternalMemory[]>;
    consolidateMemories(type: EternalMemoryType): Promise<EternalMemory | null>;
    generatePrivacyProof(metric: string, value: number, min: number, max: number, blindingFactorOverride?: string): Promise<ZKPRangeProof>;
    storeZKPProof(proof: ZKPRangeProof, metricName: string, dataType?: string, source?: string): Promise<any>;
    verifyPrivacyProof(commitments: string[], totalCommitment: string): Promise<boolean>;
}
export declare const omniCore: OmniCore;
//# sourceMappingURL=omni-core.d.ts.map