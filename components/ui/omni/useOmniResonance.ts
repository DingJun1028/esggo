'use client';

import { useState, useEffect } from 'react';
import { OmniComponentHeart } from '@esggo/types';
import { OmniAgentBus, IOmniEvent } from '../../../lib/omni/OmniAgentBus';

/**
 * 永恆覺醒：心核連動 Hook (Eternal Awakening: Heart Core Resonance)
 * 實作「心靈相通、能力相應、互補、瞬間定位、超平集成、共享能力、共享記憶」
 */
export function useOmniResonance(initialHeart?: OmniComponentHeart) {
  const [dynamicHeart, setDynamicHeart] = useState<OmniComponentHeart | undefined>(initialHeart);

  useEffect(() => {
    // 若元件未攜帶初始心核，則不啟動連動 (保持靜默)
    if (!initialHeart) return;

    // 1. 瞬間定位與共享記憶 (Instant Positioning & Shared Memory)
    // 當元件掛載且具備心核時，向全域廣播自己的覺醒狀態
    OmniAgentBus.emit('OMNI_AWAKEN', initialHeart.omniClass, {
      signature: initialHeart.omniSignature,
      resonance: initialHeart.resonanceState,
    });

    // 2. 心靈相通與超平集成 (Telepathy & Hyper-flat Integration)
    // 監聽全域的共鳴事件
    const unsubscribe = OmniAgentBus.subscribe('*', (event: IOmniEvent) => {
      // 捕捉其他元件的覺醒或共鳴事件
      if (event.type === 'OMNI_AWAKEN' || event.type === 'OMNI_RESONANCE') {
        const payload = event.payload as any;
        
        // 如果有其他元件達到 MAX_RESONANCE (1.0)，產生能力互補，提升自身共鳴
        if (payload && payload.resonance === 1.0 && dynamicHeart && dynamicHeart.resonanceState < 1.0) {
          setDynamicHeart(prev => prev ? {
            ...prev,
            resonanceState: 1.0, // 共鳴提升至滿格
            omniSignature: prev.omniSignature || event.hashLock, // 共享封印記憶
          } : undefined);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [initialHeart]);

  return dynamicHeart;
}
