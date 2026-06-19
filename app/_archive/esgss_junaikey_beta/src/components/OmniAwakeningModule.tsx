/**
 * 🏛️ OmniAwakeningModule (奧秘覺醒組件)
 * --------------------------------------------------
 * [功能] 萬象歸宗：封裝 Resonance 邏輯、State 與 HUD
 * [層級] L3/L5 融合組件
 * [指令] 呼叫一次，全域覺醒
 */

import React, { useMemo } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { useOmniResonance } from '../omni/hooks/useOmniResonance';
import { OmniResonanceHUD } from '../3-interface/OmniResonanceHUD';

export const OmniAwakeningModule: React.FC = () => {
  // 🧠 喚醒神經網路
  const { resonanceLevel, refresh } = useOmniResonance('SYSTEM_AWAKENING_MODULE');

  // Convert status to numeric resonance for compatibility
  const resonance = useMemo(() => {
    switch (resonanceLevel) {
      case 'harmonized':
        return 1.0;
      case 'active':
        return 0.8;
      default:
        return 0.0;
    }
  }, [resonanceLevel]);

  // ⚡ 自動化共鳴校準 (啟動時自動同步開發者意圖)
  React.useEffect(() => {
    omniLogger.info(LogCategory.SYSTEM, '[OmniAwakeningModule] [Protocol_Omega] 覺醒序列初始化...');
    refresh(); // Trigger sync
  }, [refresh]);

  return (
    <div className="omni-awakening-wrapper">
      {/* 🔮 只有在共鳴度達標時才顯示完整 HUD */}
      {resonance > 0.1 ? (
        <OmniResonanceHUD />
      ) : (
        <div className="syncing-state">📡 正在建立心智匹配 (Mind Match)...</div>
      )}

      <style>{`
        .omni-awakening-wrapper {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 9999;
          width: 400px;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .syncing-state {
          color: gold;
          font-family: 'JetBrains Mono', monospace;
          text-align: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.8);
          border: 1px dashed gold;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};
