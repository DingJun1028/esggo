import React from 'react';
import { motion } from 'framer-motion';

/**
 * ✨ 奧秘發光組件 / Omni Glow Component
 * --------------------------------------------------
 * [TC] 為元件添加高品質的「奧秘共鳴」發光效果與呼吸動畫。
 * [EN] Adds high-quality "Omni Resonance" glow effects and breathing animation.
 */
export const OmniGlow: React.FC<{
  children: React.ReactNode;
  intensity?: 'low' | 'normal' | 'high';
  animate?: boolean;
}> = ({ children, intensity = 'normal', animate = true }) => {
  const glowOpacity = {
    low: 0.2,
    normal: 0.4,
    high: 0.7,
  }[intensity];

  return (
    <motion.div
      animate={
        animate
          ? {
              boxShadow: [
                `0 0 10px rgba(13, 242, 238, ${glowOpacity})`,
                `0 0 25px rgba(13, 242, 238, ${glowOpacity + 0.2})`,
                `0 0 10px rgba(13, 242, 238, ${glowOpacity})`,
              ],
            }
          : {}
      }
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="rounded-inherit overflow-hidden"
    >
      {children}
    </motion.div>
  );
};
