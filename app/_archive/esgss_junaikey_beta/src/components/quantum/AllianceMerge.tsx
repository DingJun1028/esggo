/**
 * @esgss/jun-ai-ceremony
 * 四大支柱匯聚聖典動畫組件
 * 
 * 四卡匯聚為聖典的轉場動畫
 * 
 * 遵循 IComponentCore 規範
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';
import { PILLAR_CONFIGS, PillarType } from './AllianceMedal';
import '../../styles/liquid-glass.css';

/**
 * 匯聚動畫配置
 */
export interface AllianceMergeConfig {
  /** 動畫持續時間 */
  duration?: number;
  /** 是否自動開始 */
  autoStart?: boolean;
  /** 匯聚完成回調 */
  onComplete?: () => void;
  /** 聖典標題 */
  scriptureTitle?: string;
}

/**
 * 匯聚動畫 props
 */
export interface AllianceMergeProps {
  /** 配置 */
  config?: AllianceMergeConfig;
  /** 動畫狀態 */
  isActive?: boolean;
  /** 類別名稱 */
  className?: string;
  /** 子元素 (聖典內容) */
  children?: React.ReactNode;
}

/**
 * 創建匯聚動畫組件
 */
export function createAllianceMerge(
  defaultConfig: AllianceMergeConfig = {}
) {
  const AllianceMergeComponent: React.FC<AllianceMergeProps> = ({
    config = {},
    isActive = false,
    children,
    className = ''
  }) => {
    const {
      duration = 3000,
      autoStart = true,
      onComplete,
      scriptureTitle = '聖典'
    } = { ...defaultConfig, ...config };

    const [phase, setPhase] = useState<'idle' | 'converging' | 'merging' | 'complete'>('idle');
    const [selectedPillars, setSelectedPillars] = useState<PillarType[]>([]);
    
    // IComponentCore 元數據
    const [core] = useState<IComponentCore>(() =>
      ComponentCoreFactory.create(
        'quantum/AllianceMerge.tsx',
        '1.0.0',
        ['AllianceMerge', 'Animation', 'Scripture']
      )
    );

    // 初始化選擇的支柱
    useEffect(() => {
      setSelectedPillars(Object.keys(PILLAR_CONFIGS) as PillarType[]);
    }, []);

    // 動畫階段處理
    useEffect(() => {
      if (isActive && phase === 'idle') {
        setPhase('converging');
        
        // 匯聚階段
        setTimeout(() => {
          setPhase('merging');
        }, duration / 2);

        // 完成階段
        setTimeout(() => {
          setPhase('complete');
          onComplete?.();
        }, duration);
      }
    }, [isActive, phase, duration, onComplete]);

    // 計算支柱位置
    const getPillarPosition = (index: number, total: number, radius: number) => {
      const angle = (360 / total) * index - 90;
      const radian = (angle * Math.PI) / 180;
      return {
        x: Math.cos(radian) * radius,
        y: Math.sin(radian) * radius
      };
    };

    // 支柱動畫變體
    const pillarVariants = {
      idle: (i: number) => ({
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        rotate: 0
      }),
      converging: (i: number) => ({
        x: getPillarPosition(i, 4, 200).x,
        y: getPillarPosition(i, 4, 200).y,
        scale: 0.8,
        opacity: 1,
        rotate: [0, 360],
        transition: {
          duration: duration / 1000 / 2,
          ease: "easeInOut"
        }
      }),
      merging: (i: number) => ({
        x: 0,
        y: 0,
        scale: [0.8, 0.5, 0],
        opacity: [1, 0.5, 0],
        rotate: [0, 180, 360],
        transition: {
          duration: duration / 1000 / 2,
          ease: "easeIn"
        }
      }),
      complete: {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0
      }
    };

    // 聖典出現動畫
    const scriptureVariants = {
      hidden: {
        scale: 0,
        opacity: 0,
        rotateY: 180
      },
      visible: {
        scale: 1,
        opacity: 1,
        rotateY: 0,
        transition: {
          duration: 0.8,
          ease: "easeOut"
        }
      }
    };

    // 能量環動畫
    const energyRingVariants = {
      idle: { scale: 0, opacity: 0 },
      converging: {
        scale: [0.5, 1, 0.8],
        opacity: [0, 0.5, 0.3],
        transition: {
          duration: duration / 1000 / 2,
          repeat: Infinity
        }
      },
      merging: {
        scale: [0.8, 1.2, 1],
        opacity: [0.3, 0.8, 1],
        transition: {
          duration: duration / 1000 / 2,
          ease: "easeInOut"
        }
      }
    };

    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* 能量中心 */}
        <motion.div
          className="absolute w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.5) 0%, transparent 70%)',
            filter: 'blur(20px)'
          }}
          animate={phase}
          variants={energyRingVariants}
        />

        {/* 支柱卡片 */}
        <AnimatePresence mode="wait">
          {phase !== 'complete' && (
            <>
              {selectedPillars.map((key, index) => {
                const pillar = PILLAR_CONFIGS[key];
                return (
                  <motion.div
                    key={key}
                    className="absolute w-24 h-32 rounded-lg overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${pillar.color}40 0%, transparent 100%)`,
                      border: `2px solid ${pillar.color}60`,
                      boxShadow: `0 0 30px ${pillar.color}30`
                    }}
                    custom={index}
                    initial="idle"
                    animate={phase}
                    variants={pillarVariants}
                  >
                    {/* 支柱內容 */}
                    <div className="flex flex-col items-center justify-center h-full p-2">
                      <div className="text-2xl mb-1">{pillar.icon}</div>
                      <div className="text-xs font-bold text-gray-200 text-center">
                        {pillar.nameZh}
                      </div>
                    </div>

                    {/* 粒子尾跡 */}
                    {phase === 'converging' && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `linear-gradient(to center, ${pillar.color}20 0%, transparent 100%)`
                        }}
                        animate={{
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </>
          )}
        </AnimatePresence>

        {/* 聖典卡片 */}
        <AnimatePresence>
          {phase === 'complete' && (
            <motion.div
              className="relative z-20"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={scriptureVariants}
            >
              <motion.div
                className="w-64 p-6 rounded-2xl liquid-glass-strong"
                style={{
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(99, 166, 176, 0.1) 100%)',
                  border: '2px solid rgba(212, 175, 55, 0.4)',
                  boxShadow: '0 0 60px rgba(212, 175, 55, 0.3)'
                }}
              >
                {/* 聖典標題 */}
                <div className="text-center mb-4">
                  <motion.div
                    className="text-4xl mb-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📜
                  </motion.div>
                  <h2 className="text-xl font-bold text-[#d4af37]">
                    {scriptureTitle}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    四象合一 · 永續之道
                  </p>
                </div>

                {/* 聖典內容 */}
                {children || (
                  <div className="space-y-3">
                    {selectedPillars.map((key) => {
                      const pillar = PILLAR_CONFIGS[key];
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-2 p-2 rounded-lg bg-black/20"
                        >
                          <span className="text-lg">{pillar.icon}</span>
                          <span className="text-sm text-gray-300">
                            {pillar.nameZh}
                          </span>
                          <div className="flex-1 h-0.5 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full"
                              style={{ backgroundColor: pillar.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pillar.resonanceScore * 100}%` }}
                              transition={{ delay: 0.5, duration: 0.5 }}
                            />
                          </div>
                          <span className="text-xs text-[#d4af37]">
                            {(pillar.resonanceScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 共鳴波效果 */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    border: '2px solid rgba(212, 175, 55, 0.3)'
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 階段指示器 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {(['idle', 'converging', 'merging', 'complete'] as const).map((p, i) => (
            <motion.div
              key={p}
              className={`w-2 h-2 rounded-full ${
                phase === p 
                  ? 'bg-[#d4af37]' 
                  : phaseOrder.indexOf(p) < phaseOrder.indexOf(phase)
                  ? 'bg-gray-500'
                  : 'bg-gray-700'
              }`}
              animate={{
                scale: phase === p ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    );
  };

  // 階段順序
  const phaseOrder = ['idle', 'converging', 'merging', 'complete'];

  AllianceMergeComponent.displayName = 'AllianceMerge';

  return AllianceMergeComponent;
}

/**
 * 預設匯聚動畫組件
 */
export const AllianceMerge: React.FC<AllianceMergeProps> = createAllianceMerge();

/**
 * 完整的聖典創建流程組件
 */
export const ScriptureCreationFlow: React.FC<{
  onComplete?: (data: Record<string, unknown>) => void;
}> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [scriptureData, setScriptureData] = useState<Record<string, unknown>>({});

  const handleStart = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleComplete = useCallback(() => {
    // 收集所有支柱數據
    const data: Record<string, unknown> = {};
    (Object.keys(PILLAR_CONFIGS) as PillarType[]).forEach(key => {
      data[key] = PILLAR_CONFIGS[key];
    });
    data.timestamp = Date.now();
    setScriptureData(data);
    onComplete?.(data);
  }, [onComplete]);

  return (
    <div className="space-y-6">
      <AllianceMerge
        config={{
          duration: 3000,
          onComplete: handleComplete
        }}
        isActive={isActive}
      >
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-2">
            四支柱共鳴融合
          </p>
          <p className="text-xs text-gray-400">
            山衛 · 墾趣 · 語言步驟 · 全人
          </p>
        </div>
      </AllianceMerge>

      {/* 控制按鈕 */}
      {!isActive && (
        <motion.button
          className="block mx-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#63a6b0] text-white font-bold"
          onClick={handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          開始融合聖典
        </motion.button>
      )}
    </div>
  );
};

export default AllianceMerge;
