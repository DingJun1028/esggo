"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface gap-6">
            {/* 禪意圓環動畫 */}
            <div className="relative w-24 h-24">
                <motion.div
                    className="absolute inset-0 border-4 border-primary/20 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />
                <motion.div
                    className="absolute inset-0 border-t-4 border-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <div className="flex flex-col items-center gap-2">
                <motion.h2
                    className="text-xl font-space-grotesk font-bold tracking-widest text-primary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    OMNI_TERMINAL
                </motion.h2>
                <motion.p
                    className="text-sm font-medium text-primary/60 italic font-newsreader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Intelligence Hub Mode Activating...
                </motion.p>
            </div>

            {/* 進度條 */}
            <div className="w-48 h-1 bg-primary/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
}
