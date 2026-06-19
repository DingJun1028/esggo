import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * QuantumPortal Component
 * 提供 高維度 翻轉/縮放 轉場特效
 */
export const QuantumPortal: React.FC<{ children: React.ReactNode; viewKey: string }> = ({
  children,
  viewKey,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full relative"
      >
        {/* Quantum Ripple Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-blue-500/5 to-purple-500/5 z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
