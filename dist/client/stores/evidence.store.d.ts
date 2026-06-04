/**
 * Evidence Store (Zustand)
 * 前端狀態管理層 - 封裝對 tRPC 的調用與 5T 狀態維護
 */
import { Evidence, EvidenceID, EvidenceQueryParams, CreateEvidenceDTO, VerificationResult } from '../../shared/types/evidence.types';
interface EvidenceState {
    evidences: Evidence[];
    isLoading: boolean;
    error: string | null;
    fetchEvidences: (params?: EvidenceQueryParams) => Promise<void>;
    addEvidence: (dto: CreateEvidenceDTO) => Promise<Evidence | null>;
    verifyEvidence: (id: EvidenceID) => Promise<VerificationResult | null>;
}
export declare const useEvidenceStore: import("zustand").UseBoundStore<import("zustand").StoreApi<EvidenceState>>;
export {};
//# sourceMappingURL=evidence.store.d.ts.map