"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FirstResonancePortal } from '@/components/omni/onboarding/FirstResonancePortal';

/**
 * 🏛️ Onboarding Page (初次共鳴 - First Resonance)
 * 
 * 已經全面升級為 v9.0 Sentient Onboarding。
 * 由 Dr. Thoth 壽司博士 引導新手睜開眼，建立數位主體性。
 */

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-omni-bg flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl">
                <FirstResonancePortal />
            </div>
            
            {/* 🌌 Bottom Philosophy Decoration */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 2, duration: 1 }}
                className="fixed bottom-8 flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-omni-text-muted"
            >
                <span>服務即教學</span>
                <span>知識即資產</span>
                <span>善向永續</span>
            </motion.div>
        </div>
    );
}
