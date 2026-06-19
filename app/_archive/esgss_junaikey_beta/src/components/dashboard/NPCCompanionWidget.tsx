/**
 * @esgss/jun-ai-ceremony
 * NPC 夥伴小組件
 * 
 * 液態玻璃效果 UI 組件
 * 
 * 遵循 IComponentCore 規範
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentCoreFactory, IComponentCore, createAlchemyForge, ResonanceResult } from '@/services/ceremony';
import '../../styles/liquid-glass.css';

/**
 * NPC 類型
 */
export type NPCTYPE = 'guide' | 'mentor' | 'companion' | 'guardian';

/**
 * NPC 數據
 */
export interface NPCData {
  id: string;
  type: NPCTYPE;
  name: string;
  nameZh: string;
  avatar: string;
  role: string;
  roleZh: string;
  greeting: string;
  abilities: string[];
  resonanceLevel: number;
}

/**
 * NPC 夥伴配置
 */
export interface NPCCompanionConfig {
  /** NPC 數據 */
  npc: NPCData;
  /** 是否展開 */
  isExpanded?: boolean;
  /** 互動模式 */
  interactionMode?: 'passive' | 'active';
}

/**
 * NPC 夥伴 props
 */
export interface NPCCompanionWidgetProps {
  /** 配置 */
  config: NPCCompanionConfig;
  /** 點擊處理 */
  onInteract?: () => void;
  /** Rs 共鳴計算 */
  onRsCalculate?: (npcId: string) => ResonanceResult | null;
  /** 類別名稱 */
  className?: string;
}

/**
 * 預設 NPC 數據
 */
export const DEFAULT_NPCS: Record<NPCTYPE, NPCData> = {
  guide: {
    id: 'npc-guide-001',
    type: 'guide',
    name: 'Sage Navigator',
    nameZh: '賢者導航員',
    avatar: '🧙',
    role: 'Quest Guide',
    roleZh: '任務引導者',
    greeting: '歡迎來到永續村！讓我帶你探索這個神奇的世界。',
    abilities: ['任務指引', '地圖導航', '故事解說'],
    resonanceLevel: 0.85
  },
  mentor: {
    id: 'npc-mentor-001',
    type: 'mentor',
    name: 'Thoth Echo',
    nameZh: '托特迴響',
    avatar: '🦉',
    role: 'Wisdom Mentor',
    roleZh: '智慧導師',
    greeting: '知識是通往真理的階梯。讓我傳授你智慧。',
    abilities: ['智慧教導', '策略建議', '知識分享'],
    resonanceLevel: 0.92
  },
  companion: {
    id: 'npc-companion-001',
    type: 'companion',
    name: 'Eco Sprite',
    nameZh: '生態精靈',
    avatar: '🧚',
    role: 'Nature Companion',
    roleZh: '自然夥伴',
    greeting: '嗨！我是 Eco，讓我們一起保護這個美麗的世界！',
    abilities: ['自然溝通', '生態洞察', '綠色魔法'],
    resonanceLevel: 0.78
  },
  guardian: {
    id: 'npc-guardian-001',
    type: 'guardian',
    name: 'Mountain Spirit',
    nameZh: '山靈',
    avatar: '⛰️',
    role: 'Realm Guardian',
    roleZh: '領域守護者',
    greeting: '我是這片土地的守護者。勇於挑戰，方能成長。',
    abilities: ['領域保護', '挑戰設定', '力量測試'],
    resonanceLevel: 0.88
  }
};

/**
 * 創建 NPC 夥伴組件
 */
export function createNPCCompanionWidget(
  defaultConfig?: Partial<NPCCompanionConfig>
) {
  const NPCCompanionWidgetComponent: React.FC<NPCCompanionWidgetProps> = ({
    config,
    onInteract,
    onRsCalculate,
    className = ''
  }) => {
    const {
      npc,
      isExpanded = false,
      interactionMode = 'passive'
    } = { ...defaultConfig, ...config };

    const [expanded, setExpanded] = useState(isExpanded);
    const [hovered, setHovered] = useState(false);
    const [rsResult, setRsResult] = useState<ResonanceResult | null>(null);

    // IComponentCore 元數據
    const [core] = useState<IComponentCore>(() =>
      ComponentCoreFactory.create(
        'dashboard/NPCCompanionWidget.tsx',
        '1.0.0',
        ['NPC', 'Companion', 'Widget']
      )
    );

    // 計算 Rs 共鳴
    useEffect(() => {
      if (onRsCalculate && npc.id) {
        const forge = createAlchemyForge();
        const result = forge.calculateResonance(
          { npcId: npc.id, resonanceLevel: npc.resonanceLevel },
          `NPC-${npc.type}`
        );
        setRsResult(result);
      }
    }, [npc, onRsCalculate]);

    const handleClick = useCallback(() => {
      if (interactionMode === 'active') {
        setExpanded(!expanded);
        onInteract?.();
      }
    }, [interactionMode, expanded, onInteract]);

    return (
      <motion.div
        className={`relative ${className}`}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={expanded ? { scale: 1 } : {}}
        data-uuid={core.uuid}
        data-timestamp={core.timestamp}
        data-5t-protocol="active"
      >
        {/* 液態玻璃容器 */}
        <motion.div
          className={`
            liquid-glass rounded-2xl p-4
            ${interactionMode === 'active' ? 'cursor-pointer' : ''}
          `}
          onClick={handleClick}
          whileHover={interactionMode === 'active' ? { scale: 1.02 } : {}}
          whileTap={interactionMode === 'active' ? { scale: 0.98 } : {}}
          animate={{
            boxShadow: hovered
              ? '0 8px 32px 0 rgba(99, 166, 176, 0.25)'
              : '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
          }}
        >
          {/* 量子流光效果 */}
          {expanded && (
            <motion.div
              className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(99, 166, 176, 0.1), transparent)',
                backgroundSize: '200% 100%'
              }}
              animate={{
                backgroundPosition: ['-200% center', '200% center']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}

          {/* 內容佈局 */}
          <div className="flex items-start gap-4 relative z-10">
            {/* 頭像 */}
            <motion.div
              className="relative"
              animate={expanded ? { scale: 1 } : {}}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{
                  background: `radial-gradient(circle, rgba(99, 166, 176, 0.2) 0%, transparent 70%)`,
                  border: '2px solid rgba(99, 166, 176, 0.3)'
                }}
              >
                {npc.avatar}
              </div>

              {/* 在線指示器 */}
              <motion.div
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#4ade80] border-2 border-[#1e293b]"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* 信息區域 */}
            <div className="flex-1 min-w-0">
              {/* 名稱 */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-gray-100 truncate">
                  {npc.nameZh}
                </h3>
                <span className="text-xs text-gray-400">({npc.name})</span>
              </div>

              {/* 角色 */}
              <p className="text-xs text-[#63a6b0] mb-2">
                {npc.roleZh} · {npc.role}
              </p>

              {/* 共鳴等級 */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: rsResult 
                        ? rsResult.rs_score >= 80 
                            ? 'linear-gradient(90deg, #10b981, #4ade80)'
                            : 'linear-gradient(90deg, #63a6b0, #4ade80)'
                        : 'linear-gradient(90deg, #63a6b0, #4ade80)'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${npc.resonanceLevel * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="text-xs font-mono text-[#d4af37]">
                  {rsResult ? `${rsResult.rs_score} Rs` : `${(npc.resonanceLevel * 100).toFixed(0)}%`}
                </span>
              </div>

              {/* Rs 等級標籤 */}
              {rsResult && (
                <motion.div
                  className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block ${
                    rsResult.tier === 'Pulse' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : rsResult.tier === 'Seed'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-gray-500/20 text-gray-400'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {rsResult.tier === 'Pulse' ? '✨ Pulse 等級' : 
                   rsResult.tier === 'Seed' ? '🌱 Seed 等級' : 'Coal 等級'}
                </motion.div>
              )}
            </div>

            {/* 展開/收合指示器 */}
            {interactionMode === 'active' && (
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                className="text-gray-400"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </motion.div>
            )}
          </div>

          {/* 展開內容 */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-gray-700/50">
                  {/* 問候語 */}
                  <p className="text-sm text-gray-300 mb-4 italic">
                    "{npc.greeting}"
                  </p>

                  {/* 能力列表 */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      能力
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {npc.abilities.map((ability, i) => (
                        <motion.span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-[#63a6b0]/10 text-[#63a6b0] border border-[#63a6b0]/20"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {ability}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* 互動按鈕 */}
                  {interactionMode === 'active' && (
                    <motion.button
                      className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-[#63a6b0] to-[#4ade80] text-white text-sm font-bold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onInteract?.();
                      }}
                    >
                      互動
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 反重力浮動效果 */}
        {interactionMode === 'passive' && (
          <motion.div
            className="anti-gravity-float"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full opacity-60"
              style={{
                background: 'radial-gradient(circle, #63a6b0, transparent)',
                filter: 'blur(4px)'
              }}
            />
          </motion.div>
        )}
      </motion.div>
    );
  };

  NPCCompanionWidgetComponent.displayName = 'NPCCompanionWidget';

  return NPCCompanionWidgetComponent;
}

/**
 * 預設 NPC 夥伴組件
 */
export const NPCCompanionWidget: React.FC<NPCCompanionWidgetProps> = createNPCCompanionWidget();

/**
 * NPC 夥伴選擇器
 */
export const NPCCompanionSelector: React.FC<{
  selected?: NPCTYPE;
  onSelect?: (type: NPCTYPE) => void;
}> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {(Object.keys(DEFAULT_NPCS) as NPCTYPE[]).map((type) => (
        <NPCCompanionWidget
          key={type}
          config={{
            npc: DEFAULT_NPCS[type],
            isExpanded: selected === type,
            interactionMode: 'active'
          }}
          onInteract={() => onSelect?.(type)}
        />
      ))}
    </div>
  );
};

export default NPCCompanionWidget;
