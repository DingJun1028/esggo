/**
 * useOmniResonance Hook
 * 計算全域系統共鳴算力 Rs 並管理任督二脈流轉狀態
 */

import { useState, useEffect } from 'react';
import { useEvidenceStore } from '../stores/evidence.store';
import { OmniInfoCrystal } from '../types/ucc.types';

export function useOmniResonance() {
  const { evidences } = useEvidenceStore();
  const [rs, setRs] = useState(0.92); // 預設基礎共鳴值
  const [streamStatus, setStreamStatus] = useState<{ ren: number; du: number }>({ ren: 100, du: 100 });
  const [isCrystallizing, setIsCrystallizing] = useState(false);

  useEffect(() => {
    if (evidences.length > 0) {
      // 模擬 Rs 計算邏輯：基於證據的誠信狀態與數量
      const verifiedCount = evidences.filter(e => e.integrity_status === 'valid').length;
      const totalCount = evidences.length;
      const baseRs = (verifiedCount / totalCount) * 0.95 + 0.05;
      
      // 加入隨機微擾模擬「生命感」
      const noise = (Math.random() - 0.5) * 0.02;
      setRs(Math.min(Math.max(baseRs + noise, 0), 1.0));
      
      // 更新任督二脈壓力值
      setStreamStatus({
        ren: 80 + Math.random() * 20, // 任脈：記憶穩固度
        du: 70 + Math.random() * 30   // 督脈：執行活躍度
      });
    }
  }, [evidences]);

  const triggerCrystallization = async () => {
    setIsCrystallizing(true);
    // 模擬 5T 全域共鳴過程
    await new Promise(r => setTimeout(r, 2000));
    setIsCrystallizing(false);
    return true;
  };

  return {
    rs,
    streamStatus,
    isCrystallizing,
    triggerCrystallization,
    status: rs >= 0.9 ? 'Stable Crystal' : rs >= 0.7 ? 'Harmonizing' : 'Entropy Warning'
  };
}
