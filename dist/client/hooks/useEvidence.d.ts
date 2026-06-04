/**
 * useEvidence Hook
 * 為元件提供簡易的證據操作介面，整合 Zustand Store
 */
import { EvidenceID, CreateEvidenceDTO } from '../../shared/types/evidence.types';
export declare function useEvidence(): {
    evidences: import("../../shared/types/evidence.types").Evidence[];
    isLoading: boolean;
    error: string | null;
    create: (dto: CreateEvidenceDTO) => Promise<import("../../shared/types/evidence.types").Evidence | null>;
    verify: (id: EvidenceID) => Promise<import("../../shared/types/evidence.types").VerificationResult | null>;
    refresh: (params?: import("../../shared/types/evidence.types").EvidenceQueryParams) => Promise<void>;
};
//# sourceMappingURL=useEvidence.d.ts.map