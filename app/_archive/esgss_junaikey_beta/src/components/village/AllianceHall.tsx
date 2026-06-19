/**
 * 🏛️ 善向永續村 AI RPG 卡牌遊戲 - 四大支柱大廳組件
 * ============================================================================
 * [來源備註] 源自 DingJun (洪鼎竣) 的善向永續村設計
 * [零幻覺驗證] 透過 Hash Lock 確保 Vibe Coding 過程數據不位移
 * 
 * 液態玻璃效果 UI 組件
 * 遵循 IComponentCore 規範
 * 
 * 四大支柱：
 * - Truth (真) - 山衛科技
 * - Goodness (善) - 墾趣
 * - Transparent (透) - 語言步驟
 * - Trackable (蹤) - 全人評測
 * ============================================================================
 */

import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Heart, 
  Search,
  ChevronRight,
  Zap,
  Users,
  Mic,
  Fingerprint,
  Target
} from 'lucide-react';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';
import { INPCCard, Pillar } from '@/types/npc';
import { getNPCCardsByPillar, NPC_CARDS } from '@/data/npcs';
import '../../styles/liquid-glass.css';

/**
 * 四大支柱大廳 props
 */
export interface AllianceHallProps {
  /** 是否展開 */
  isExpanded?: boolean;
  /** 當前語言 */
  language?: 'zh-TW' | 'en-US';
  /** NPC 點擊處理 */
  onPillarSelect?: (npc: INPCCard, pillar: Pillar) => void;
  /** 類別名稱 */
  className?: string;
}

/**
 * 支柱配置
 */
interface PillarConfig {
  readonly key: Pillar;
  readonly name: string;
  readonly nameZh: string;
  readonly nameEn: string;
  readonly icon: React.ReactNode;
  readonly color: string;
  readonly gradient: string;
  readonly description: string;
  readonly descriptionZh: string;
}

const PILLAR_CONFIGS: PillarConfig[] = [
  {
    key: 'Truth',
    name: 'Truth',
    nameZh: '真',
    nameEn: 'Truth',
    icon: <Target size={20} />,
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-cyan-600/20',
    description: 'Truth (真)',
    descriptionZh: '高頻真理脈衝，追求真相與精確',
  },
  {
    key: 'Goodness',
    name: 'Goodness',
    nameZh: '善',
    nameEn: 'Goodness',
    icon: <Heart size={20} />,
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-green-600/20',
    description: 'Goodness (善)',
    descriptionZh: '野外共鳴路徑，追求善良與和諧',
  },
  {
    key: 'Transparent',
    name: 'Transparent',
    nameZh: '透',
    nameEn: 'Transparent',
    icon: <Eye size={20} />,
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-pink-600/20',
    description: 'Transparent (透)',
    descriptionZh: '清晰共鳴腔，追求透明與清晰',
  },
  {
    key: 'Trackable',
    name: 'Trackable',
    nameZh: '蹤',
    nameEn: 'Trackable',
    icon: <Fingerprint size={20} />,
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-orange-600/20',
    description: 'Trackable (蹤)',
    descriptionZh: '全人靈魂刻印，追求可追蹤與記錄',
  },
];

/**
 * 四大支柱大廳組件
 */
export const AllianceHall: React.FC<AllianceHallProps> = memo(({
  isExpanded = false,
  language = 'zh-TW',
  onPillarSelect,
  className = '',
}) => {
  const isZh = language === 'zh-TW';
  const [expanded, setExpanded] = useState(isExpanded);
  const [activePillar, setActivePillar] = useState<Pillar | null>(null);
  const [hoveredPillar, setHoveredPillar] = useState<Pillar | null>(null);

  // IComponentCore 元數據
  const [core] = useState<IComponentCore>(() =>
    ComponentCoreFactory.create(
      'components/village/AllianceHall.tsx',
      '1.0.0',
      ['Alliance', 'Village', 'Pillar', '4Pillars', 'LiquidGlass']
    )
  );

  // 翻譯
  const translations = {
    hallTitle: isZh ? '四大支柱大廳' : 'Four Pillars Hall',
    hallSubtitle: isZh ? '真理·善良·透明·可追蹤' : 'Truth · Goodness · Transparent · Trackable',
    pillarGuardians: isZh ? '支柱守護者' : 'Pillar Guardians',
    selectPillar: isZh ? '選擇支柱' : 'Select Pillar',
    resonanceBonus: isZh ? '共鳴加成' : 'Resonance Bonus',
    availableNPCs: isZh ? '可用 NPC' : 'Available NPCs',
    close: isZh ? '關閉' : 'Close',
  };

  const handlePillarClick = (pillarKey: Pillar) => {
    setActivePillar(pillarKey);
    const npc = getNPCCardsByPillar(pillarKey)[0];
    if (npc) {
      onPillarSelect?.(npc, pillarKey);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      {/* 液態玻璃背景 */}
      <div className="liquid-glass-panel absolute inset-0" />

      {/* 內容容器 */}
      <div className="relative z-10 p-5">
        {/* 標題區 */}
        <div 
          className="flex items-center justify-between mb-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-xl">
              <Shield size={20} className="text-indigo-400" />
            </div>
            <div>
              <h4 className="text-[13px] font-black uppercase tracking-widest text-slate-100">
                {translations.hallTitle}
              </h4>
              <p className="text-[10px] text-slate-400 uppercase">
                {translations.hallSubtitle}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={20} className="text-slate-400" />
          </motion.div>
        </div>

        {/* 展開內容 */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {/* 四大支柱卡片 */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {PILLAR_CONFIGS.map((pillar) => {
                  const npcs = getNPCCardsByPillar(pillar.key);
                  const npc = npcs[0];
                  const isActive = activePillar === pillar.key;
                  const isHovered = hoveredPillar === pillar.key;

                  return (
                    <motion.div
                      key={pillar.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePillarClick(pillar.key)}
                      onMouseEnter={() => setHoveredPillar(pillar.key)}
                      onMouseLeave={() => setHoveredPillar(null)}
                      className={`relative p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-br ${pillar.gradient} border border-${pillar.color.replace('text-', '')}/50`
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {/* 支柱圖標 */}
                      <div className={`mb-2 ${pillar.color}`}>
                        {pillar.icon}
                      </div>

                      {/* 支柱名稱 */}
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-sm font-bold text-slate-200">
                          {isZh ? pillar.nameZh : pillar.nameEn}
                        </span>
                      </div>

                      {/* NPC 簡介 */}
                      {npc && (
                        <div className="text-[9px] text-slate-400 truncate">
                          {npc.village_function}
                        </div>
                      )}

                      {/* 共鳴加成指示 */}
                      <div className="flex items-center gap-1 mt-2">
                        <Zap size={10} className={pillar.color} />
                        <span className={`text-[8px] ${pillar.color}`}>
                          +{(npc?.rs_base || 70) * 0.1} RS
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* 5T 協議提示 */}
              <div className="p-2 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-lg border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Search size={12} className="text-indigo-400" />
                  <span className="text-[9px] font-bold text-indigo-400 uppercase">
                    5T Protocol
                  </span>
                </div>
                <p className="text-[8px] text-slate-400">
                  {isZh ? '選擇支柱可激活對應的 5T 共鳴加成' : 'Select a pillar to activate corresponding 5T resonance bonus'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 已選支柱詳情 */}
        <AnimatePresence>
          {activePillar && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-3 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-xl border border-indigo-500/20"
            >
              {(() => {
                const pillarConfig = PILLAR_CONFIGS.find(p => p.key === activePillar)!;
                const npc = getNPCCardsByPillar(activePillar)[0];

                return (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={pillarConfig.color}>
                          {pillarConfig.icon}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-200">
                            {isZh ? pillarConfig.nameZh : pillarConfig.nameEn}
                          </h5>
                          <p className="text-[9px] text-slate-400">
                            {pillarConfig.descriptionZh}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActivePillar(null)}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        <ChevronRight size={12} className="text-slate-400 rotate-45" />
                      </button>
                    </div>

                    {npc && (
                      <div className="space-y-2">
                        {/* NPC 資訊 */}
                        <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                          <Users size={14} className="text-slate-400" />
                          <div>
                            <p className="text-[9px] text-slate-300">
                              {npc.village_function}
                            </p>
                            <p className="text-[8px] text-slate-500">
                              RS: {npc.rs_base}
                            </p>
                          </div>
                        </div>

                        {/* 技能 */}
                        <div className="space-y-1">
                          {npc.skills.map((skill) => (
                            <div key={skill.id} className="flex items-center gap-2 text-[9px]">
                              <Mic size={10} className={pillarConfig.color} />
                              <span className="text-slate-300">{skill.nameZh}:</span>
                              <span className="text-slate-400">{skill.description}</span>
                            </div>
                          ))}
                        </div>

                        {/* ESG 數據 */}
                        <div className="flex items-center gap-2 text-[9px]">
                          <span className="text-slate-500">ESG:</span>
                          <span className="text-emerald-400">E:{npc.esgStats.E}</span>
                          <span className="text-blue-400">S:{npc.esgStats.S}</span>
                          <span className="text-purple-400">G:{npc.esgStats.G}</span>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

AllianceHall.displayName = 'AllianceHall';
