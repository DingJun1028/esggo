import { useState, useEffect, useCallback } from 'react';
import { OmniResonance, ESGDataTag } from '../infrastructure/types/Omni-entity.types.ts';
import { useOmniMemory } from '../infrastructure/memory/OmniMemory.ts';
import { OmniKnowledge } from '../infrastructure/knowledge/OmniKnowledge.ts';

// Omni Heart Core
// The Hook that orchestrates the Resonance between Memory, Knowledge, and UI.

export function useOmniResonance(entityId: string): OmniResonance<ESGDataTag> {
  // 1. Connect to Eternal Memory
  const { esgData, setESGData } = useOmniMemory();

  // 2. Local State for Resonance Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resonanceLevel, setResonanceLevel] = useState<'dormant' | 'active' | 'harmonized'>(
    'dormant'
  );

  // 3. Define the Resonance Logic (The "Heartbeat")
  const refresh = useCallback(async () => {
    setLoading(true);
    setResonanceLevel('active');
    setError(null);

    try {
      // Access Knowledge Base
      const response = await OmniKnowledge.fetchESGData(entityId);

      if (response.success && response.data) {
        // Update Eternal Memory
        setESGData(response.data);
        setResonanceLevel('harmonized');
      } else {
        throw new Error(response.message || 'Unknown resonance error');
      }
    } catch (err: any) {
      setError(err.message);
      setResonanceLevel('dormant');
    } finally {
      setLoading(false);
    }
  }, [entityId, setESGData]);

  // 4. Auto-Resonate on Mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(
    async (newData: Partial<ESGDataTag>) => {
      // Optimistic Update
      if (esgData) {
        setESGData({ ...esgData, ...newData } as ESGDataTag);
      }
      // Sync back to server/knowledge base
      try {
        const response = await OmniKnowledge.updateESGData(entityId, newData);
        if (response.success && response.data) {
          setESGData(response.data);
          setResonanceLevel('harmonized');
        } else {
          throw new Error(response.message || 'Sync failed');
        }
      } catch (err: any) {
        setError(`Sync failed: ${err.message}`);
        setResonanceLevel('active');
      }
    },
    [entityId, esgData, setESGData]
  );

  // 5. Return the Unified Interface
  return {
    data: esgData,
    loading,
    error,
    refresh,
    update,
    resonanceLevel,
  };
}
