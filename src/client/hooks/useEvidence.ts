/**
 * useEvidence Hook
 * 為元件提供簡易的證據操作介面，整合 Zustand Store
 */

import { useEffect } from 'react';
import { useEvidenceStore } from '../stores/evidence.store';
import { EvidenceID, CreateEvidenceDTO } from '../../shared/types/evidence.types';

export function useEvidence() {
  const { 
    evidences, 
    isLoading, 
    error, 
    fetchEvidences, 
    addEvidence, 
    verifyEvidence 
  } = useEvidenceStore();

  // 初始加載
  useEffect(() => {
    if (evidences.length === 0 && !isLoading) {
      fetchEvidences();
    }
  }, [evidences.length, isLoading, fetchEvidences]);

  const handleCreate = async (dto: CreateEvidenceDTO) => {
    return addEvidence(dto);
  };

  const handleVerify = async (id: EvidenceID) => {
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
