/**
 * useOmniResonance Hook
 * 計算全域系統共鳴算力 Rs 並管理任督二脈流轉狀態
 */

import { useState, useEffect, useMemo } from 'react';
import { useEvidenceStore } from '../stores/evidence.store';

export function useOmniResonance() {
  const { evidences } = useEvidenceStore();
  const [isCrystallizing, setIsCrystallizing] = useState(false);
  const [noise, setNoise] = useState(0);

  // 1. 使用 useMemo 計算基礎共鳴值（純函數計算）
  const baseResonanceData = useMemo(() => {
    if (evidences.length === 0) {
      return { baseRs: 0.92 };
    }

    const verifiedCount = evidences.filter(e => e.integrity_status === 'valid').length;
    const totalCount = evidences.length;
    const baseRs = (verifiedCount / totalCount) * 0.95 + 0.05;

    return { baseRs };
  }, [evidences]);

  // 2. 使用 State 儲存含有隨機性的數據，並在 Effect 中更新（副作用處理）
  const [streamStatus, setStreamStatus] = useState({ ren: 100, du: 100 });

  // 2. 設定週期性更新（模擬生命感）
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNoise((prev) => {
        const next = (Math.random() - 0.5) * 0.02;
        return Math.abs(prev - next) < 0.001 ? prev : next;
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // 3. 證據變化時初始化壓力狀態
  useEffect(() => {
    if (evidences.length > 0) {
      // 使用 setTimeout 確保不在渲染週期內同步更新
      const t = setTimeout(() => {
        setStreamStatus({
          ren: 80 + Math.random() * 20,
          du: 70 + Math.random() * 30
        });
      }, 0);
      return () => clearTimeout(t);
    }
  }, [evidences.length]);

  const rs = Math.min(Math.max(baseResonanceData.baseRs + noise, 0), 1.0);

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
