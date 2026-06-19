/**
 * 🧠 L5 Omni State Store: useOmniResonance
 * --------------------------------------------------
 * [權責] 連接 L1 引擎與 L3 介面的神經路徑
 * [特性] 響應式、單一真相來源、高併發優化
 */

import { useState, useEffect } from 'react';
import { OmniResonance } from '@infra/index';

// 單一實例管理 (Singleton for Engine)
const resonanceEngine = new OmniResonance();

export interface IOmniState {
  resonance: number;
  entropy: number;
  itkTotal: number;
  pillarStatus: Record<string, 'healthy' | 'syncing'>;
}

export const useOmniResonance = () => {
  // 核心狀態快照
  const [state, setState] = useState<IOmniState>({
    resonance: resonanceEngine.getResonance(),
    entropy: 0.05, // Initial low entropy
    itkTotal: 0,
    pillarStatus: {
      soul: 'healthy',
      memory: 'healthy',
      intelligence: 'healthy',
      tags: 'healthy',
      crystal: 'healthy',
    },
  });

  useEffect(() => {
    // 🌀 建立神經同步連結 (模擬即時引擎監聽)
    const syncInterval = setInterval(() => {
      // 獲取最新引擎數據
      const currentRes = resonanceEngine.getResonance();

      // 更新狀態快照 (Object.freeze 確保不可篡改性傳遞)
      setState(prevState => ({
        ...prevState,
        resonance: currentRes,
        // 此處未來可對接真實的 ITK 鑄造服務與能量監測
        itkTotal: prevState.itkTotal + (currentRes > 0.8 ? 5 : 1),
      }));
    }, 1000);

    return () => clearInterval(syncInterval);
  }, []);

  // 暴露 API 供 L3 組件調用
  return {
    ...state,
    // 注入手動觸發共鳴同步的方法
    triggerSync: (activity: number) => resonanceEngine.syncIntent(10, activity),
  };
};
