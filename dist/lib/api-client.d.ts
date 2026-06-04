/**
 * ESG GO | Strongly Typed API Client (OmniSync Bridge)
 * Wraps all backend calls with Bi-directional TypeScript safety.
 * Bridges legacy calls to the new 5T / tRPC architecture.
 */
import { ApiResponse, SealRequestPayload, VerifyRequestPayload } from '@/src/shared/types';
export declare const omniApiClient: {
    /**
     * OmniCore Seal (T4/T5)
     * Bridges to /api/vault-omni/engrave
     */
    seal: (payload: SealRequestPayload) => Promise<ApiResponse<any>>;
    /**
     * OmniCore Verify (T4)
     * Bridges to /api/vault-omni/verify
     */
    verify: (payload: VerifyRequestPayload) => Promise<ApiResponse<{
        isValid: boolean;
    }>>;
    /**
     * OmniAgent Vision Scan
     * Bridges to existing vision logic or new Alchemy
     */
    scanVision: (fileId: string, fileType?: string) => Promise<ApiResponse<any>>;
    /**
     * OmniAgent Alchemy Extraction
     * Bridges to the new UCC Engine-backed Alchemy
     */
    extractMetrics: (fileId: string) => Promise<ApiResponse<any>>;
};
//# sourceMappingURL=api-client.d.ts.map