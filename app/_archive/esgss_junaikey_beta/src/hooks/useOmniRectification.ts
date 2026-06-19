// src/hooks/useOmniRectification.ts
import { useState, useEffect } from 'react';
import { EntropyForge } from '../core/rectification/EntropyForge';
import { PurifiedArtifact } from '../core/rectification/types';
import { useOmniHistory } from '../store/useOmniHistory';

export function useOmniRectification<T>(
  rawValue: T,
  contextId: string
): {
  value: T;
  meta: PurifiedArtifact<T> | null;
  isHealing: boolean;
  isRectified: boolean;
} {
  const [artifact, setArtifact] = useState<PurifiedArtifact<T> | null>(null);
  const [isHealing, setIsHealing] = useState(false);
  const { addLog } = useOmniHistory();

  useEffect(() => {
    const process = async () => {
      setIsHealing(true);
      const result = await EntropyForge.purify(rawValue, contextId);

      // If rectified, log to history (Immune Memory)
      if (result.entropy !== 'ZERO') {
        addLog({
          type: 'IMMUNITY_HEAL',
          sourceId: contextId,
          sourceLabel: `OmniCell [${contextId}]`,
          tags: ['rectification'],
          payload: {
            strategyUsed: result.strategyUsed,
            aiConfidence: 0.9, // Derived value
          },
        });
      }

      setArtifact(result);
      setIsHealing(false);
    };
    process();
  }, [rawValue, contextId, addLog]);

  return {
    value: artifact?.data ?? rawValue, // Return healed value preferentially
    meta: artifact,
    isHealing,
    isRectified: artifact?.entropy !== 'ZERO', // Flag for visual "Amber Glow"
  };
}
