"use strict";
/**
 * useEvidence Hook
 * 為元件提供簡易的證據操作介面，整合 Zustand Store
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEvidence = useEvidence;
const react_1 = require("react");
const evidence_store_1 = require("../stores/evidence.store");
function useEvidence() {
    const { evidences, isLoading, error, fetchEvidences, addEvidence, verifyEvidence } = (0, evidence_store_1.useEvidenceStore)();
    // 初始加載
    (0, react_1.useEffect)(() => {
        if (evidences.length === 0 && !isLoading) {
            fetchEvidences();
        }
    }, [evidences.length, isLoading, fetchEvidences]);
    const handleCreate = async (dto) => {
        return addEvidence(dto);
    };
    const handleVerify = async (id) => {
        return verifyEvidence(id);
    };
    return {
        evidences,
        isLoading,
        error,
        create: handleCreate,
        verify: handleVerify,
        refresh: fetchEvidences
    };
}
//# sourceMappingURL=useEvidence.js.map