/**
 * @esgss/jun-ai-ceremony
 * 量子糾纏動畫組件
 * 
 * 用於卡牌抽卡 - 粒子匯聚動畫
 * 
 * 遵循 IComponentCore 規範
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';

/**
 * 粒子配置
 */
export interface Particle {
  id: number;
  angle: number;
  radius: number;
  delay: number;
  color: string;
  size: number;
}

/**
 * 量子糾纏配置
 */
export interface QuantumEntanglementConfig {
  /** 粒子數量 */
  particleCount?: number;
  /** 軌道半徑 */
  orbitRadius?: number;
  /** 動畫持續時間 */
  duration?: number;
  /** 是否自動開始 */
  autoStart?: boolean;
  /** 匯聚後的回調 */
  onComplete?: () => void;
  /** 粒子顏色 */
  colors?: string[];
}

/**
 * 量子糾纏組件 props
 */
export interface QuantumEntanglementProps {
  /** 配置 */
  config?: QuantumEntanglementConfig;
  /** 動畫狀態 */
  isActive?: boolean;
  /** 類別名稱 */
  className?: string;
  /** 子元素 (顯示在中心) */
  children?: React.ReactNode;
}

/**
 * 創建量子糾纏組件
 */
export function createQuantumEntanglement(
  defaultConfig: QuantumEntanglementConfig = {}
) {
  const QuantumEntanglementComponent: React.FC<QuantumEntanglementProps> = ({
    config = {},
    isActive = false,
    children,
    className = ''
  }) => {
    const {
      particleCount = 8,
      orbitRadius = 120,
      duration = 2000,
      autoStart = true,
      onComplete,
      colors = ['#63a6b0', '#d4af37', '#4ade80', '#2dd4bf']
    } = { ...defaultConfig, ...config };

    const [animating, setAnimating] = useState(autoStart);
    const [particles, setParticles] = useState<Particle[]>([]);
    
    // IComponentCore 元數據
    const [core] = useState<IComponentCore>(() =>
      ComponentCoreFactory.create(
        'quantum/QuantumEntanglement.tsx',
        '1.0.0',
        ['QuantumEntanglement', 'Animation', 'Particle']
      )
    );

    // 初始化粒子
    useEffect(() => {
      const newParticles: Particle[] = [];
      const colorCount = colors.length;
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          angle: (360 / particleCount) * i,
          radius: orbitRadius,
          delay: i * (duration / particleCount / 3),
          color: colors[i % colorCount],
          size: Math.random() * 6 + 4
        });
      }
      setParticles(newParticles);
    }, [particleCount, orbitRadius, duration, colors]);

    // 動畫完成處理
    useEffect(() => {
      if (!isActive && animating) {
        const timer = setTimeout(() => {
          setAnimating(false);
          onComplete?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [isActive, animating, duration, onComplete]);

    // 粒子動畫變體
    const particleVariants = {
      initial: (particle: Particle) => ({
        x: Math.cos((particle.angle * Math.PI) / 180) * particle.radius,
        y: Math.sin((particle.angle * Math.PI) / 180) * particle.radius,
        opacity: 1,
        scale: 1
      }),
      converging: (particle: Particle) => ({
        x: 0,
        y: 0,
        opacity: [1, 0.8, 0],
        scale: [1, 0.5, 0],
        transition: {
          duration: duration / 1000,
          delay: particle.delay,
          ease: "easeInOut"
        }
      })
    };

    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* 粒子軌道 */}
        <AnimatePresence mode="wait">
          {animating && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="-150 -150 300 300"
              style={{ width: orbitRadius * 2 + 100, height: orbitRadius * 2 + 100 }}
            >
              {/* 軌道圓圈 */}
              <circle
                cx="0"
                cy="0"
                r={orbitRadius}
                fill="none"
                stroke="rgba(99, 166, 176, 0.2)"
                strokeWidth="1"
                strokeDasharray="5,5"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 0"
                  to="360 0 0"
                  dur="10s"
                  repeatCount="indefinite"
                />
              </circle>
              
              {/* 粒子 */}
              {particles.map((particle) => (
                <motion.circle
                  key={particle.id}
                  cx="0"
                  cy="0"
                  r={particle.size}
                  fill={particle.color}
                  custom={particle}
                  initial="initial"
                  animate="converging"
                  variants={particleVariants}
                  style={{
                    filter: `drop-shadow(0 0 ${particle.size * 2}px ${particle.color})`
                  }}
                />
              ))}
            </svg>
          )}
        </AnimatePresence>

        {/* 中心內容 */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: animating ? [0, 1.2, 1] : 1,
            opacity: animating ? [0, 0.5, 1] : 1
          }}
          transition={{ 
            duration: duration / 1000,
            times: [0, 0.6, 1]
          }}
          className="relative z-10"
        >
          {children || (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#63a6b0] to-[#2dd4bf] flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full border-2 border-white/30"
              />
            </div>
          )}
        </motion.div>

        {/* 共鳴波效果 */}
        {animating && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: duration / 1000, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(99, 166, 176, 0.3) 0%, transparent 70%)'
            }}
          />
        )}
      </div>
    );
  };

  QuantumEntanglementComponent.displayName = 'QuantumEntanglement';

  return QuantumEntanglementComponent;
}

/**
 * 預設量子糾纏組件
 */
export const QuantumEntanglement: React.FC<QuantumEntanglementProps> = createQuantumEntanglement();

/**
 * 卡牌抽卡量子效果
 */
export const CardDrawEntanglement: React.FC<{
  isDrawing: boolean;
  onComplete?: () => void;
  children?: React.ReactNode;
}> = ({ isDrawing, onComplete, children }) => {
  return (
    <QuantumEntanglement
      config={{
        particleCount: 12,
        orbitRadius: 100,
        duration: 1500,
        colors: ['#63a6b0', '#d4af37', '#4ade80', '#ffbf00', '#2dd4bf'],
        onComplete
      }}
      isActive={isDrawing}
    >
      {children}
    </QuantumEntanglement>
  );
};

export default QuantumEntanglement;
