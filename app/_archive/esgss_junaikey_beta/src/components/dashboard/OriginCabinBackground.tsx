/**
 * @esgss/jun-ai-ceremony
 * 原點小屋背景組件
 * 
 * 量子流光動畫效果
 * 
 * 遵循 IComponentCore 規範
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';
import '../../styles/liquid-glass.css';

/**
 * 背景配置
 */
export interface OriginCabinBackgroundConfig {
  /** 背景主題 */
  theme?: 'default' | 'forest' | 'ocean' | 'mountain' | 'cosmic';
  /** 是否顯示流光 */
  showStreamers?: boolean;
  /** 流光強度 */
  streamerIntensity?: number;
  /** 粒子數量 */
  particleCount?: number;
  /** 互動模式 */
  interactive?: boolean;
}

/**
 * 背景 props
 */
export interface OriginCabinBackgroundProps {
  /** 配置 */
  config?: OriginCabinBackgroundConfig;
  /** 類別名稱 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 主題顏色配置
 */
export const THEME_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  default: {
    primary: '#63a6b0',
    secondary: '#2dd4bf',
    accent: '#d4af37'
  },
  forest: {
    primary: '#4ade80',
    secondary: '#22c55e',
    accent: '#84cc16'
  },
  ocean: {
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#14b8a6'
  },
  mountain: {
    primary: '#64748b',
    secondary: '#475569',
    accent: '#94a3b8'
  },
  cosmic: {
    primary: '#8b5cf6',
    secondary: '#a855f7',
    accent: '#d4af37'
  }
};

/**
 * 創建原點小屋背景組件
 */
export function createOriginCabinBackground(
  defaultConfig?: Partial<OriginCabinBackgroundConfig>
) {
  const OriginCabinBackgroundComponent: React.FC<OriginCabinBackgroundProps> = ({
    config = {},
    className = '',
    children
  }) => {
    const {
      theme = 'default',
      showStreamers = true,
      streamerIntensity = 0.6,
      particleCount = 8,
      interactive = false
    } = { ...defaultConfig, ...config };

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; color: string }>>([]);
    const colors = THEME_COLORS[theme] || THEME_COLORS.default!;

    // IComponentCore 元數據
    const [core] = useState<IComponentCore>(() =>
      ComponentCoreFactory.create(
        'dashboard/OriginCabinBackground.tsx',
        '1.0.0',
        ['OriginCabin', 'Background', 'Quantum']
      )
    );

    // 初始化粒子
    useEffect(() => {
      const newParticles = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 5,
          color: i % 2 === 0 ? colors.primary : colors.secondary
        });
      }
      setParticles(newParticles);
    }, [particleCount, colors]);

    // 滑鼠互動處理
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (!interactive) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      });
    }, [interactive]);

    return (
      <motion.div
        className={`relative overflow-hidden ${className}`}
        onMouseMove={handleMouseMove}
        data-uuid={core.uuid}
        data-timestamp={core.timestamp}
        data-5t-protocol="active"
        style={{
          background: interactive
            ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${colors.primary}10 0%, transparent 50%)`
            : undefined
        }}
      >
        {/* 背景漸層 */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}08 0%, ${colors.secondary}05 50%, ${colors.accent}08 100%)`
          }}
        />

        {/* 量子流光效果 */}
        <AnimatePresence>
          {showStreamers && (
            <>
              {/* 流光 1 */}
              <motion.div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${colors.primary}40, transparent)`,
                  backgroundSize: '200% 100%'
                }}
                animate={{
                  backgroundPosition: ['-200% center', '200% center']
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* 流光 2 - 交錯 */}
              <motion.div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: `linear-gradient(180deg, transparent, ${colors.secondary}30, transparent)`,
                  backgroundSize: '100% 200%'
                }}
                animate={{
                  backgroundPosition: ['center -200%', 'center 200%']
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* 粒子效果 */}
        {particles.map((particle, i) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: 4,
              height: 4,
              backgroundColor: particle.color,
              boxShadow: `0 0 10px ${particle.color}, 0 0 20px ${particle.color}`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.8, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 5,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* 共鳴波紋 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 60%)`
          }}
        />

        {/* 量子網格效果 */}
        <svg
          className="absolute inset-0 pointer-events-none opacity-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="quantum-grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke={colors.primary}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#quantum-grid)" />
        </svg>

        {/* 中心光暈 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: `radial-gradient(circle, ${colors.accent}30 0%, transparent 40%)`
          }}
        />

        {/* 內容層 */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  };

  OriginCabinBackgroundComponent.displayName = 'OriginCabinBackground';

  return OriginCabinBackgroundComponent;
}

/**
 * 預設原點小屋背景組件
 */
export const OriginCabinBackground: React.FC<OriginCabinBackgroundProps> = createOriginCabinBackground();

/**
 * 互動式小屋背景
 */
export const InteractiveCabinBackground: React.FC<{
  children?: React.ReactNode;
  onInteract?: (position: { x: number; y: number }) => void;
}> = ({ children, onInteract }) => {
  return (
    <OriginCabinBackground
      config={{
        theme: 'default',
        showStreamers: true,
        streamerIntensity: 0.8,
        particleCount: 12,
        interactive: true
      }}
    >
      {children}
    </OriginCabinBackground>
  );
};

/**
 * 完整的小屋場景組件
 */
export const CabinScene: React.FC<{
  variant?: 'full' | 'compact';
}> = ({ variant = 'full' }) => {
  return (
    <OriginCabinBackground
      config={{
        theme: 'forest',
        showStreamers: true,
        particleCount: variant === 'full' ? 12 : 6
      }}
      className={variant === 'full' ? 'min-h-[400px]' : 'min-h-[200px]'}
    >
      <div className="flex flex-col items-center justify-center h-full p-8">
        {/* 小屋圖標 */}
        <motion.div
          className="text-8xl mb-4"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🏠
        </motion.div>

        {/* 標題 */}
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          原點小屋
        </h2>
        <p className="text-sm text-gray-400 text-center max-w-md">
          在此靜心冥想，感受永續村的寧靜與智慧
        </p>

        {/* 互動按鈕 */}
        <motion.button
          className="mt-6 px-6 py-2 rounded-full bg-[#63a6b0]/20 border border-[#63a6b0]/40 text-[#63a6b0]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          進入小屋
        </motion.button>
      </div>
    </OriginCabinBackground>
  );
};

export default OriginCabinBackground;
