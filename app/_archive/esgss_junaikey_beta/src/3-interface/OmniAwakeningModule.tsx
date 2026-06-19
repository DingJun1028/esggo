/**
 * 🏛️ OmniAwakeningModule (奧秘覺醒組件)
 * --------------------------------------------------
 * [功能] 萬象歸宗：封裝 Resonance 邏輯、State 與 HUD
 * [層級] L3/L5 融合組件
 * [指令] 呼叫一次，全域覺醒
 */

import React from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { useOmniResonance } from '@store/index';
import { OmniResonanceHUD } from '@interface/OmniResonanceHUD';

export const OmniAwakeningModule: React.FC = () => {
  // 🧠 喚醒神經網路
  const { resonance, triggerSync } = useOmniResonance();

  // ⚡ 自動化共鳴校準 (啟動時自動同步開發者意圖)
  React.useEffect(() => {
    omniLogger.info(LogCategory.SYSTEM, '[OmniAwakeningModule] [Protocol_Omega] 覺醒序列初始化...');
    triggerSync(0.95); // 以 S 級高標啟動
  }, [triggerSync]);

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
