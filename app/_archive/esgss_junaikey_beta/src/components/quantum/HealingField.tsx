/**
 * @esgss/jun-ai-ceremony
 * 自癒補強場域視覺化組件
 * 
 * 結合 HealingAgent 的視覺效果
 * 
 * 遵循 IComponentCore 規範
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';

/**
 * 自癒場域配置
 */
export interface HealingFieldConfig {
  /** 場域半徑 */
  radius?: number;
  /** 脈衝強度 */
  pulseIntensity?: number;
  /** 場域顏色 */
  color?: string;
  /** 粒子數量 */
  particleCount?: number;
  /** 是否顯示數據 */
  showData?: boolean;
  /** 自癒狀態 */
  healingState?: 'idle' | 'healing' | 'complete' | 'error';
}

/**
 * 自癒場域 props
 */
export interface HealingFieldProps {
  /** 配置 */
  config?: HealingFieldConfig;
  /** 場域狀態 */
  isActive?: boolean;
  /** 增益數值 */
  gainValue?: number;
  /** 類別名稱 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
  /** 狀態變化回調 */
  onStateChange?: (state: HealingFieldConfig['healingState']) => void;
}

/**
 * 創建自癒場域組件
 */
export function createHealingField(
  defaultConfig: HealingFieldConfig = {}
) {
  const HealingFieldComponent: React.FC<HealingFieldProps> = ({
    config = {},
    isActive = false,
    gainValue = 0,
    children,
    className = '',
    onStateChange
  }) => {
    const {
      radius = 150,
      pulseIntensity = 0.5,
      color = '#4ade80',
      particleCount = 6,
      showData = true,
      healingState = 'idle'
    } = { ...defaultConfig, ...config };

    const [currentState, setCurrentState] = useState(healingState);
    const [particles, setParticles] = useState<Array<{ id: number; angle: number; delay: number }>>([]);
    
    // IComponentCore 元數據
    const [core] = useState<IComponentCore>(() =>
      ComponentCoreFactory.create(
        'quantum/HealingField.tsx',
        '1.0.0',
        ['HealingField', 'Visualization', 'Ceremony']
      )
    );

    // 初始化粒子
    useEffect(() => {
      const newParticles = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          angle: (360 / particleCount) * i,
          delay: i * 0.5
        });
      }
      setParticles(newParticles);
    }, [particleCount]);

    // 狀態變化處理
    useEffect(() => {
      if (isActive) {
        setCurrentState('healing');
        onStateChange?.('healing');
      } else if (gainValue > 0 && currentState === 'healing') {
        setCurrentState('complete');
        onStateChange?.('complete');
      }
    }, [isActive, gainValue, currentState, onStateChange]);

    // 粒子動畫變體
    const particleVariants = {
      idle: { scale: 1, opacity: 0.3 },
      healing: (i: number) => ({
        scale: [1, 1.5, 1],
        opacity: [0.3, 0.8, 0.3],
        transition: {
          duration: 2,
          delay: i * 0.3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }),
      complete: {
        scale: 1,
        opacity: 1
      }
    };

    // 場域圓環變體
    const ringVariants = {
      idle: { scale: 1, opacity: 0.2 },
      healing: {
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.4, 0.2],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      },
      complete: {
        scale: 1,
        opacity: 0.5
      }
    };

    const getRingColor = () => {
      switch (currentState) {
        case 'healing': return color;
        case 'complete': return '#4ade80';
        case 'error': return '#ef4444';
        default: return color;
      }
    };

    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* 外圈場域 */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: radius * 2,
            height: radius * 2,
            border: `2px solid ${getRingColor()}`,
            background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`
          }}
          animate={currentState}
          variants={ringVariants}
        />

        {/* 中圈場域 */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: radius * 1.6,
            height: radius * 1.6,
            border: `1px dashed ${getRingColor()}`,
            opacity: 0.4
          }}
          animate={{
            rotate: 360,
            transition: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />

        {/* 內圈場域 */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: radius * 1.2,
            height: radius * 1.2,
            border: `1px solid ${getRingColor()}`,
            opacity: 0.3
          }}
          animate={{
            rotate: -360,
            transition: {
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />

        {/* 粒子效果 */}
        {particles.map((particle, i) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 8,
              height: 8,
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`
            }}
            custom={i}
            initial="idle"
            animate={currentState}
            variants={particleVariants}
          />
        ))}

        {/* 中心內容 */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          animate={{
            scale: currentState === 'healing' ? [1, 1.05, 1] : 1
          }}
          transition={{
            duration: 1,
            repeat: currentState === 'healing' ? Infinity : 0
          }}
        >
          {children || (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4ade80]/20 to-[#2dd4bf]/20 backdrop-blur-sm border border-[#4ade80]/30 flex items-center justify-center">
              <motion.div
                animate={{ 
                  rotate: currentState === 'healing' ? 360 : 0
                }}
                transition={{
                  duration: currentState === 'healing' ? 3 : 0,
                  repeat: currentState === 'healing' ? Infinity : 0,
                  ease: "linear"
                }}
                className="w-16 h-16 rounded-full border border-[#4ade80]/50"
              />
            </div>
          )}

          {/* 數據顯示 */}
          {showData && (
            <motion.div
              className="absolute -bottom-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-[10px] text-[#4ade80] font-mono tracking-widest">
                {currentState === 'healing' && 'HEALING...'}
                {currentState === 'complete' && 'COMPLETE'}
                {currentState === 'idle' && 'IDLE'}
                {currentState === 'error' && 'ERROR'}
              </div>
              {gainValue > 0 && (
                <div className="text-lg font-bold text-[#4ade80]">
                  +{gainValue.toFixed(2)} RS
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* 共鳴波效果 */}
        {currentState === 'complete' && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: radius * 1.5,
              height: radius * 1.5,
              border: `2px solid ${color}`
            }}
          />
        )}
      </div>
    );
  };

  HealingFieldComponent.displayName = 'HealingField';

  return HealingFieldComponent;
}

/**
 * 預設自癒場域組件
 */
export const HealingField: React.FC<HealingFieldProps> = createHealingField();

/**
 * 自癒補強數據展示組件
 */
export const HealingDataDisplay: React.FC<{
  gainValue: number;
  entropyReduction: number;
  resonanceScore: number;
}> = ({ gainValue, entropyReduction, resonanceScore }) => {
  return (
    <div className="liquid-glass p-4 rounded-xl">
      <div className="text-xs text-[#4ade80] font-mono mb-2">HEALING METRICS</div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Gain Value</span>
          <span className="text-sm font-bold text-[#4ade80]">+{gainValue.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Entropy Reduction</span>
          <span className="text-sm font-bold text-[#4ade80]">-{entropyReduction.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Resonance</span>
          <span className="text-sm font-bold text-[#d4af37]">{(resonanceScore * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default HealingField;
