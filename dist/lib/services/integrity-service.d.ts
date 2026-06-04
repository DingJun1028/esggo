/**
 * [Best Practice] Integrity Service
 * Centralizes all 5T Sealing, Hashing, and Audit Log generation logic.
 * Adheres to the Semantic Governance Protocol (英標繁博).
 */
import { GateValidationResult } from '@/src/shared/types';
export declare class IntegrityService {
    private static instance;
    private constructor();
    static getInstance(): IntegrityService;
    /**
     * @function validateGates
     * @description 5T 誠信門徑全域驗證：真·善·美·信·通。
     * Processes data through all five sacred gates of integrity.
     */
    validateGates(sourcePath: string, data: Record<string, unknown>, actorId: string): Promise<GateValidationResult[]>;
    /**
     * Performs a 5T Master Seal on a data object.
     * Logic: Hash(Data + Timestamp + Identity) -> Audit Log -> Verified State.
     */
    sealData(resource: string, data: Record<string, unknown>, meta: {
        user: string;
        dept: string;
        gri?: string;
    }): Promise<{
        hash: string;
        timestamp: number;
    }>;
    /**
     * Validates a data object against a provided hash lock.
     */
    verifyIntegrity(data: Record<string, unknown>, expectedHash: string): Promise<boolean>;
}
export declare const integrityService: IntegrityService;
//# sourceMappingURL=integrity-service.d.ts.map