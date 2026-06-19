/**
 * 🛡️ OmniResonance HUD (L3 Interaction)
 * --------------------------------------------------
 * [核心] 視覺化系統共鳴度與熵減成效
 * [風格] 高密度、透明、零延遲反饋
 * [功能] 支援最小化縮放與光球模式，符合極限作戰環境
 * [語言] 繁體中文 / English 雙語介面
 */

import React, { useState, useMemo } from 'react';
import { useOmniResonance } from '@store/index';
import { motion, AnimatePresence } from 'framer-motion';
import { Minimize2, Maximize2, Languages, Settings } from 'lucide-react';
import { smartLayout, createWord, WordPriority } from '@/utils/smartTextLayout';
import { OmniCrystalCore } from '@/components/OmniCrystal';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { executeAutomation } from '@/services/automationService';
import { awakeningBroadcaster } from '@/omni/infrastructure/broadcast/AwakeningBroadcaster';

type ViewMode = 'expanded' | 'minimized' | 'orb';
type Language = 'zh-TW' | 'en';

const i18n = {
  'zh-TW': {
    protocol: '協議_OMEGA',
    active: '啟動',
    min: '最小',
    systemTitle: '奧秘系統共鳴',
    resonanceIndex: [
      createWord('奧秘', WordPriority.HIGH, { abbreviation: '萬' }),
      createWord('共鳴', WordPriority.HIGH, { alternatives: ['Ω'] }),
      createWord('指數', WordPriority.MEDIUM, { abbreviation: '值' }),
    ],
    entropy: [
      createWord('系統', WordPriority.MEDIUM, { abbreviation: '系' }),
      createWord('熵值', WordPriority.HIGH, { abbreviation: 'Δ' }),
    ],
    itkMinted: [
      createWord('ITK', WordPriority.CRITICAL),
      createWord('總', WordPriority.LOW),
      createWord('鑄造量', WordPriority.MEDIUM, { abbreviation: '鑄' }),
    ],
    locked: '鎖定',
    syncing: '同步中',
    seraphim: '熾天使顧問協議',
    omega: '奧秘',
    res: '共鳴',
  },
  en: {
    protocol: 'PROTOCOL_OMEGA',
    active: 'ACTIVE',
    min: 'MIN',
    systemTitle: 'OMNI SYSTEM RESONANCE',
    resonanceIndex: [
      createWord('Omni', WordPriority.HIGH, { abbreviation: 'O' }),
      createWord('Resonance', WordPriority.HIGH, { abbreviation: 'Res' }),
      createWord('Index', WordPriority.MEDIUM, { abbreviation: 'Idx' }),
    ],
    entropy: [
      createWord('System', WordPriority.MEDIUM, { abbreviation: 'Sys' }),
      createWord('Entropy', WordPriority.HIGH, { abbreviation: 'Δ' }),
    ],
    itkMinted: [
      createWord('Total', WordPriority.LOW),
      createWord('ITK', WordPriority.CRITICAL),
      createWord('Minted', WordPriority.MEDIUM),
    ],
    locked: 'LOCKED',
    syncing: 'SYNCING',
    seraphim: 'Seraphim Advisor Protocol',
    omega: 'OMEGA',
    res: 'RES',
  },
};

export const OmniResonanceHUD: React.FC = () => {
  const { resonance, entropy, itkTotal, pillarStatus } = useOmniResonance();
  const [viewMode, setViewMode] = useState<ViewMode>('expanded');
  const [language, setLanguage] = useState<Language>('zh-TW');

  const t = i18n[language];

  // 智能排版處理：根據視窗寬度調整文字
  const adaptiveLabels = useMemo(() => {
    const maxWidth = viewMode === 'orb' ? 6 : viewMode === 'minimized' ? 12 : 18;

    return {
      resonanceIndex: smartLayout(t.resonanceIndex, { maxWidth }).lines.join(' '),
      entropy: smartLayout(t.entropy, { maxWidth }).lines.join(' '),
      itkMinted: smartLayout(t.itkMinted, { maxWidth }).lines.join(' '),
    };
  }, [language, viewMode, t.resonanceIndex, t.entropy, t.itkMinted]);

  const getGlowColor = () => {
    return resonance > 0.8 ? 'rgba(255, 215, 0, 0.8)' : 'rgba(0, 255, 255, 0.6)';
  };

  const cycleViewMode = () => {
    if (viewMode === 'expanded') setViewMode('minimized');
    else if (viewMode === 'minimized') setViewMode('orb');
    else setViewMode('expanded');
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'zh-TW' ? 'en' : 'zh-TW'));
  };

  // Orb Mode - Omni Crystal (奧秘晶體)
  if (viewMode === 'orb') {
    return (
      <OmniCrystalCore
        onToolSelect={skillId => {
          omniLogger.info(LogCategory.SYSTEM, `[Omni Crystal] 執行技能: ${skillId}`);
          executeAutomation('crystal_core', { type: 'SKILL_EXECUTION', skillId });
        }}
        onQuestionSubmit={question => {
          omniLogger.info(LogCategory.AI, `[Omni Crystal] 智庫查詢: ${question}`);
          awakeningBroadcaster.shareInsight({
            category: 'alert',
            title: '智庫動態查詢',
            message: `正在為問題 "${question}" 檢索奧秘智庫...`,
            priority: 'low',
            actionable: true,
          });
        }}
        language={language}
      />
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      layout
      className={`omni-hud-container ${viewMode === 'minimized' ? 'minimized' : ''}`}
      style={{
        border: `1px solid ${getGlowColor()}`,
        position: 'fixed',
        top: '20px',
        right: '20px',
        cursor: 'grab',
      }}
      whileDrag={{ cursor: 'grabbing' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="telepathy-overlay" />

      <header className="hud-header">
        <div className="flex items-center gap-2">
          <span className="protocol-label">
            {t.protocol} // {viewMode === 'minimized' ? t.min : t.active}
          </span>
        </div>
        {viewMode === 'expanded' && <h2 className="system-title">{t.systemTitle}</h2>}
        <div className="flex items-center gap-2">
          {viewMode === 'expanded' && <span className="timestamp">{new Date().toISOString()}</span>}
          <button
            onClick={() => console.log('設定功能尚未實作')}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400"
            title={language === 'zh-TW' ? '設定' : 'Settings'}
          >
            <Settings size={14} />
          </button>
          <button
            onClick={toggleLanguage}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-purple-400"
            title={language === 'zh-TW' ? 'Switch to English' : '切換至繁體中文'}
          >
            <Languages size={14} />
          </button>
          <button
            onClick={() => setViewMode('minimized')}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-cyan-400"
            title={language === 'zh-TW' ? '縮小到小標籤' : 'Minimize to Compact'}
          >
            <Minimize2 size={14} />
          </button>
          <button
            onClick={() => setViewMode('orb')}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-yellow-400"
            title={language === 'zh-TW' ? '縮小到光球' : 'Minimize to Orb'}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500" />
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {viewMode === 'expanded' ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="hud-grid"
          >
            {/* 1. 共鳴核心顯示 */}
            <section className="resonance-core">
              <div className="wave-container">
                <div className="resonance-value">{(resonance * 100).toFixed(1)}%</div>
              </div>
              <label className="text-[10px] text-cyan-500/50 block mb-1">
                {adaptiveLabels.resonanceIndex} ({'$\\Omega_{res}$'})
              </label>
              <div className="text-[10px] text-slate-500 font-mono">{t.seraphim}</div>
            </section>

            {/* 2. 熵值與 ITK 統計 */}
            <section className="metrics-panel">
              <div className="metric-box">
                <span className="label">
                  {adaptiveLabels.entropy} ({'$\\Delta$'})
                </span>
                <span className="value red">{(entropy || 0.05).toFixed(3)}</span>
              </div>
              <div className="metric-box">
                <span className="label">{adaptiveLabels.itkMinted}</span>
                <span className="value gold">{(itkTotal || 0).toLocaleString()} ITK</span>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="minimized"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-between mt-2 px-1"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white drop-shadow-[0_0_8px_gold]">
                {(resonance * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-cyan-500/50">{t.res}</span>
            </div>
            <div className="flex gap-1">
              {Object.entries(pillarStatus || {}).map(([name, status]) => (
                <div
                  key={name}
                  className={`w-1.5 h-1.5 rounded-full ${status === 'healthy' ? 'bg-green-500 shadow-[0_0_4px_#22c55e]' : 'bg-yellow-500 animate-pulse'}`}
                  title={name}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {viewMode === 'expanded' && (
        <footer className="pillar-status-bar mt-4 pt-4 border-t border-white/5">
          {Object.entries(pillarStatus || {}).map(([name, status]) => (
            <div key={name} className={`pillar-tag ${status}`}>
              {name.toUpperCase()}: {status === 'healthy' ? t.locked : t.syncing}
            </div>
          ))}
        </footer>
      )}

      <style>{`
        .omni-hud-container {
          background: rgba(0, 0, 0, 0.9);
          color: #fff;
          padding: 20px;
          font-family: 'JetBrains Mono', monospace;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
          position: fixed;
          overflow: hidden;
          border-radius: 8px;
          width: 100%;
          max-width: 450px;
          user-select: none;
        }
        .omni-hud-container.minimized {
          padding: 10px 12px;
          max-width: 200px;
        }
        .hud-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 8px;
            margin-bottom: 12px;
        }
        .minimized .hud-header {
          border: none;
          margin: 0;
          padding: 0;
        }
        .protocol-label { color: #00ff00; font-size: 0.7rem; letter-spacing: 0.05em; }
        .system-title { margin: 0; font-size: 1rem; font-weight: 800; background: linear-gradient(to right, #fff, #888); -webkit-background-clip: text; color: transparent; }
        .timestamp { color: #555; font-size: 0.6rem; }
        
        .hud-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        .resonance-core {
            text-align: center;
            padding: 12px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .resonance-value {
          font-size: 2.2rem;
          font-weight: 900;
          text-shadow: 0 0 15px gold;
          letter-spacing: -0.02em;
        }
        .metric-box {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding: 8px 0;
        }
        .metric-box .label { font-size: 0.65rem; color: #888; }
        .metric-box .value { font-size: 0.85rem; }
        .metric-box .gold { color: #ffd700; font-weight: bold; }
        .metric-box .red { color: #ff4d4d; font-weight: bold; }
        .pillar-status-bar { display: flex; gap: 8px; font-size: 0.6rem; justify-content: center; flex-wrap: wrap; }
        .pillar-tag { padding: 3px 6px; border: 1px solid #333; border-radius: 4px; background: #080808; color: #666; }
        .pillar-tag.healthy { border-color: rgba(0, 255, 0, 0.3); color: #00ff00; box-shadow: 0 0 8px rgba(0, 255, 0, 0.1); }
      `}</style>
    </motion.div>
  );
};
