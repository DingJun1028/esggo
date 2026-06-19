/**
 * @esgss/jun-ai-ceremony
 * 四大支柱勛章卡組件
 * 
 * 可配置的勛章卡 (山衛、墾趣、語言步驟、全人)
 * 
 * 遵循 IComponentCore 規範
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';
import '../../styles/liquid-glass.css';

/**
 * 支柱類型
 */
export type PillarType = 'mountain' | 'fun' | 'language' | 'whole';

/**
 * 支柱配置
 */
export interface PillarConfig {
  type: PillarType;
  name: string;
  nameZh: string;
  description: string;
  color: string;
  icon: string;
  traits: string[];
  resonanceScore: number;
}

/**
 * 四大支柱配置
 */
export const PILLAR_CONFIGS: Record<PillarType, PillarConfig> = {
  mountain: {
    type: 'mountain',
    name: 'Mountain Guard',
    nameZh: '山衛',
    description: '守護自然環境與生態系統',
    color: '#4ade80',
    icon: '🏔️',
    traits: ['Eco Protection', 'Nature Harmony', 'Sustainability'],
    resonanceScore: 0.85
  },
  fun: {
    type: 'fun',
    name: 'Fun垦趣',
    nameZh: '墾趣',
    description: '結合趣味與永續發展',
    color: '#f97316',
    icon: '🌱',
    traits: ['Engagement', 'Innovation', 'Joyful Learning'],
    resonanceScore: 0.78
  },
  language: {
    type: 'language',
    name: 'Language Steps',
    nameZh: '語言步驟',
    description: '語言學習與文化交流',
    color: '#63a6b0',
    icon: '🗣️',
    traits: ['Communication', 'Cultural Exchange', 'Knowledge Sharing'],
    resonanceScore: 0.82
  },
  whole: {
    type: 'whole',
    name: 'Whole Person',
    nameZh: '全人',
    description: '身心靈全面發展',
    color: '#d4af37',
    icon: '✨',
    traits: ['Holistic Growth', 'Balance', 'Wellness'],
    resonanceScore: 0.89
  }
};

/**
 * 勛章卡配置
 */
export interface AllianceMedalConfig {
  /** 支柱類型 */
  pillar: PillarType | PillarConfig;
  /** 是否為選擇狀態 */
  isSelected?: boolean;
  /** 是否可互動 */
  interactive?: boolean;
  /** RS 分數 */
  rsScore?: number;
  /** 展示模式 */
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * 勛章卡 props
 */
export interface AllianceMedalProps {
  /** 配置 */
  config: AllianceMedalConfig;
  /** 點擊處理 */
  onClick?: () => void;
  /** 類別名稱 */
  className?: string;
}

/**
 * 創建勛章卡組件
 */
export function createAllianceMedal(
  defaultConfig?: Partial<AllianceMedalConfig>
) {
  const AllianceMedalComponent: React.FC<AllianceMedalProps> = ({
    config,
    onClick,
    className = ''
  }) => {
    const pillar = typeof config.pillar === 'string' 
      ? PILLAR_CONFIGS[config.pillar] 
      : config.pillar;
    
    const {
      isSelected = false,
      interactive = true,
      rsScore = pillar.resonanceScore,
      variant = 'default'
    } = { ...defaultConfig, ...config };

    // IComponentCore 元數據
    const [core] = useState<IComponentCore>(() =>
      ComponentCoreFactory.create(
        'quantum/AllianceMedal.tsx',
        '1.0.0',
        ['AllianceMedal', 'Pillar', 'Card']
      )
    );

    // 根據變體渲染不同內容
    const renderContent = () => {
      if (variant === 'compact') {
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: `${pillar.color}20` }}
            >
              {pillar.icon}
            </div>
            <div>
              <div className="text-sm font-bold text-gray-200">{pillar.nameZh}</div>
              <div className="text-[10px] text-gray-400">{pillar.name}</div>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center p-4">
          {/* 勛章圖標 */}
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3"
            style={{ 
              background: `radial-gradient(circle, ${pillar.color}30 0%, transparent 70%)`,
              border: `2px solid ${pillar.color}40`
            }}
            animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {pillar.icon}
          </motion.div>

          {/* 標題 */}
          <div className="text-center mb-2">
            <h3 className="text-lg font-bold text-gray-100">{pillar.nameZh}</h3>
            <p className="text-xs text-gray-400">{pillar.name}</p>
          </div>

          {/* 描述 */}
          <p className="text-xs text-gray-300 text-center mb-3">
            {pillar.description}
          </p>

          {/* 特質標籤 */}
          <div className="flex flex-wrap gap-1 justify-center mb-3">
            {pillar.traits.map((trait, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[9px] rounded-full bg-gray-800 text-gray-300 border border-gray-700"
              >
                {trait}
              </span>
            ))}
          </div>

          {/* RS 分數 */}
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: pillar.color }}
                initial={{ width: 0 }}
                animate={{ width: `${rsScore * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-xs font-mono text-[#d4af37]">
              {(rsScore * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      );
    };

    return (
      <motion.div
        className={`
          relative overflow-hidden
          liquid-glass rounded-xl
          ${interactive ? 'cursor-pointer' : ''}
          ${isSelected ? 'ring-2 ring-[#d4af37]' : ''}
          ${className}
        `}
        onClick={interactive ? onClick : undefined}
        whileHover={interactive ? { scale: 1.02 } : {}}
        whileTap={interactive ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          borderColor: isSelected ? pillar.color : undefined
        }}
      >
        {/* 背景漸層 */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(135deg, ${pillar.color} 0%, transparent 100%)`
          }}
        />

        {/* 選擇指示器 */}
        {isSelected && (
          <motion.div
            className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#d4af37]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}

        {/* 選擇狀態邊框光效 */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              border: `2px solid ${pillar.color}`,
              boxShadow: `0 0 20px ${pillar.color}40`
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* 主要內容 */}
        <div className="relative z-10">
          {renderContent()}
        </div>
      </motion.div>
    );
  };

  AllianceMedalComponent.displayName = 'AllianceMedal';

  return AllianceMedalComponent;
}

/**
 * 預設勛章卡組件
 */
export const AllianceMedal: React.FC<AllianceMedalProps> = createAllianceMedal();

/**
 * 四合一勛章展示組件
 */
export const AllianceMedalSet: React.FC<{
  selected?: PillarType[];
  onSelect?: (pillar: PillarType) => void;
  variant?: 'default' | 'compact' | 'detailed';
}> = ({ selected = [], onSelect, variant = 'default' }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {(Object.keys(PILLAR_CONFIGS) as PillarType[]).map((key) => (
        <AllianceMedal
          key={key}
          config={{
            pillar: PILLAR_CONFIGS[key],
            isSelected: selected.includes(key),
            variant
          }}
          onClick={() => onSelect?.(key)}
        />
      ))}
    </div>
  );
};

export default AllianceMedal;
