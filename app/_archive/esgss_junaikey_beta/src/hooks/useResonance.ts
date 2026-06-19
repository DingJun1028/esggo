import { useState, useEffect } from 'react';
import { awakeningBroadcaster } from '@/omni/infrastructure/broadcast/AwakeningBroadcaster';

/**
 * useResonance Hook
 * 監聽系統 全域事件，觸發 視覺 共鳴
 */
export const useResonance = () => {
  const [isResonating, setIsResonating] = useState(false);
  const [lastCategory, setLastCategory] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to awakening events
    const unsubscribeEvents = awakeningBroadcaster.subscribe(event => {
      if (event.type === 'service-awakened' || event.type === 'eternal-anchored') {
        setIsResonating(true);
        setLastCategory(event.data?.phase || 'System');

        setTimeout(() => setIsResonating(false), 2000);
      }
    });

    // Also subscribe to insights for resonance
    const unsubscribeInsights = awakeningBroadcaster.subscribeToInsights(insight => {
      setIsResonating(true);
      setLastCategory(insight.category);

      setTimeout(() => setIsResonating(false), 2000);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeInsights();
    };
  }, []);

  return { isResonating, lastCategory };
};
