import React, { useState, useEffect } from 'react';
import { IntegratedEsgEcosystem } from './IntegratedEsgEcosystem';
import { MobileEcosystemHub } from '../mobile/MobileEcosystemHub';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🌟 JunAiKey Dashboard Standard (Gold Entry Point)
 * --------------------------------------------------
 * Authoritative entry point for DingJun Hong's ESG ecosystem.
 * Features: Device Detection, Smooth Transitions, Unified Orbital Interface.
 */
export const DashboardStandard = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkViewport = () => {
      // Logic for mobile detection (Standard max-width: 1024px for tablet/mobile)
      setIsMobile(window.innerWidth <= 1024);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  if (isMobile === null) return null; // Prevent flash during detection

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isMobile ? 'mobile' : 'desktop'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen bg-[#051414]"
      >
        {isMobile ? <MobileEcosystemHub /> : <IntegratedEsgEcosystem />}
      </motion.div>
    </AnimatePresence>
  );
};
