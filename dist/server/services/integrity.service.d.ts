/**
 * Integrity Service
 * 核心 5T 完整性驗證服務 - 負責雜湊校驗、篡改檢測與誠信狀態維護
 */
import { Evidence, VerificationResult } from '../../shared/types/evidence.types';
export declare class IntegrityService {
    /**
     * 驗證證據內容完整性 (T1/T4)
     */
    verifyEvidence(evidence: Evidence): Promise<VerificationResult>;
    /**
     * 執行 5T 封印刻印 (Seal)
     * 鎖定數據並生成誠信憑證
     */
    sealContent(content: string): Promise<{
        hash: string;
        timestamp: Date;
    }>;
    /**
     * 計算共鳴算力 Rs (Resonance)
     * 用於評估數據結晶的健康度與 5T 合規深度
     */
    calculateRs(verification: VerificationResult): number;
    /**
     * 平衡任督二脈能量流
     * Ren (Internal) <-> Du (External)
     */
    balanceStreams(uuid: string): Promise<void>;
}
export declare const integrityService: IntegrityService;
//# sourceMappingURL=integrity.service.d.ts.map