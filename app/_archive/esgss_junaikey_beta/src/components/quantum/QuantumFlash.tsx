/**
 * @esgss/jun-ai-ceremony
 * 量子閃頻動畫組件
 * 
 * 用於 W4 刻印儀式 - 觸發全域閃頻效果
 * 
 * 遵循 IComponentCore 規範
 * Tangible, Traceable, Trackable, Transparent, Trustworthy (5T Protocol)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';

/**
 * 量子閃頻配置
 */
export interface QuantumFlashConfig {
  /** 閃頻強度 (0-1) */
  intensity?: number;
  /** 閃頻次數 */
  flashCount?: number;
  /** 閃頻持續時間 (ms) */
  duration?: number;
  /** 閃頻顏色 */
  color?: string;
  /** 是否為全域模式 */
  global?: boolean;
}

/**
 * 量子閃頻組件 props
 */
export interface QuantumFlashProps {
  /** 配置 */
  config?: QuantumFlashConfig;
  /** 閃頻狀態 */
  isActive?: boolean;
  /** 子元素 */
  children?: React.ReactNode;
  /** 類別名稱 */
  className?: string;
}

/**
 * 創建量子閃頻組件
 */
export function createQuantumFlash(
  config: QuantumFlashConfig = {}
): React.FC<QuantumFlashProps> {
  const {
    intensity = 0.8,
    flashCount = 3,
    duration = 2000,
    color = '#63a6b0',
    global = true
  } = config;

  const QuantumFlashComponent: React.FC<QuantumFlashProps> = ({
    isActive = false,
    children,
    className = ''
  }) => {
    const [flashing, setFlashing] = useState(false);
    const [flashIndex, setFlashIndex] = useState(0);

    // IComponentCore 元數據
    const [core] = useState<IComponentCore>(() => 
      ComponentCoreFactory.create(
        'quantum/QuantumFlash.tsx',
        '1.0.0',
        ['QuantumFlash', 'Ceremony', 'W4']
      )
    );

    const triggerFlash = useCallback(() => {
      if (flashing) return;
      
      setFlashing(true);
      setFlashIndex(0);

      let count = 0;
      const interval = duration / (flashCount * 2);

      const flashInterval = setInterval(() => {
        setFlashIndex(prev => {
          if (prev % 2 === 0) {
            count++;
            if (count > flashCount) {
              clearInterval(flashInterval);
              setFlashing(false);
              return prev;
            }
          }
          return prev + 1;
        });
      }, interval);

      return () => clearInterval(flashInterval);
    }, [flashing, flashCount, duration]);

    useEffect(() => {
      if (isActive) {
        triggerFlash();
      }
    }, [isActive, triggerFlash]);

    const overlayOpacity = flashing ? Math.sin((flashIndex / (flashCount * 2)) * Math.PI) * intensity : 0;

    return (
      <div className={`relative ${global ? 'fixed inset-0 z-50' : 'relative'} ${className}`}>
        {/* 閃頻遮罩層 */}
        <AnimatePresence>
          {flashing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: overlayOpacity }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.05 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: color,
                mixBlendMode: global ? 'overlay' : 'screen'
              }}
            />
          )}
        </AnimatePresence>

        {/* 光暈效果 */}
        {flashing && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0, 0.3 * intensity, 0]
            }}
            transition={{ duration: duration / 1000, times: [0, 0.5, 1] }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              opacity: 0.5
            }}
          />
        )}

        {/* 子元素 */}
        {children}
      </div>
    );
  };

  QuantumFlashComponent.displayName = 'QuantumFlash';

  return QuantumFlashComponent;
}

/**
 * 預設量子閃頻組件
 */
export const QuantumFlash: React.FC<QuantumFlashProps> = createQuantumFlash();

/**
 * 量子閃頻上下文
 */
export interface QuantumFlashContextType {
  /** 觸發閃頻 */
  triggerFlash: () => void;
  /** 閃頻中 */
  isFlashing: boolean;
  /** 組件元數據 */
  core: IComponentCore;
}

export const QuantumFlashContext = React.createContext<QuantumFlashContextType | null>(null);

/**
 * 量子閃頻提供者
 */
export const QuantumFlashProvider: React.FC<{
  children: React.ReactNode;
  config?: QuantumFlashConfig;
}> = ({ children, config }) => {
  const [isFlashing, setIsFlashing] = useState(false);
  
  const core = ComponentCoreFactory.create(
    'quantum/QuantumFlashProvider.tsx',
    '1.0.0',
    ['QuantumFlash', 'Provider', 'Ceremony']
  );

  const triggerFlash = useCallback(() => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), (config?.duration || 2000));
  }, [config]);

  return (
    <QuantumFlashContext.Provider value={{ triggerFlash, isFlashing, core }}>
      {children}
      <QuantumFlash isActive={isFlashing} config={config} />
    </QuantumFlashContext.Provider>
  );
};

export default QuantumFlash;
