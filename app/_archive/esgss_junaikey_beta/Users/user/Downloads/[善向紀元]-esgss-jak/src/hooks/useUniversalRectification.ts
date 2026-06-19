// src/hooks/useUniversalRectification.ts

import { useState, useEffect } from 'react';
import { EntropyForge } from '../core/rectification/EntropyForge';
import { PurifiedArtifact } from '../core/rectification/types';

export function useUniversalRectification<T>(
  rawValue: T,
  contextId: string
) {
  const [artifact, setArtifact] = useState<PurifiedArtifact<T> | null>(null);
  const [isHealing, setIsHealing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const executePurification = async () => {
      setIsHealing(true);
      try {
        // 執行煉金過程
        const result = await EntropyForge.purify(rawValue, contextId);

        if (isMounted) {
          // 只有當熵值 > ZERO 時才記錄修復行為
          if (result.entropy !== 'ZERO') {
            console.info(`[AutoHealing] Rectified ${contextId}:`, result);
          }
          setArtifact(result);
        }
      } catch (err) {
        console.error("Entropy Forge Failure:", err);
      } finally {
        if (isMounted) setIsHealing(false);
      }
    };

    executePurification();

    return () => { isMounted = false; };
  }, [rawValue, contextId]);

  return {
    // 如果還在修復中，先返回原始值或 Loading 狀態
    value: artifact ? artifact.data : rawValue,
    metadata: artifact,
    isHealing,
    isRectified: artifact?.entropy !== 'ZERO'
  };
}