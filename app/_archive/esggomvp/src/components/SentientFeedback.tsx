'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, MessageSquare, Zap } from 'lucide-react';

interface SentientFeedbackProps {
    message: string;
    agentName?: string;
    type?: 'insight' | 'warning' | 'status';
}

/**
 * 🍃 SentientFeedback: A "whisper" system that provides proactive UI feedback.
 */
export default function SentientFeedback({ message, agentName = "System", type = 'insight' }: SentientFeedbackProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), 8000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const icons = {
        insight: <MessageSquare size={14} className="text-aqua" />,
        warning: <Zap size={14} className="text-amber-500" />,
        status: <Radio size={14} className="text-gray-400" />
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.9 }}
                    className="fixed bottom-12 right-12 z-[100] max-w-sm"
                >
                    <div className="liquid-glass border border-white/20 p-5 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex gap-4">
                        <div className="size-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                            {icons[type]}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black tracking-widest text-aqua uppercase">{agentName} Whisper</span>
                                <div className="size-1 bg-aqua rounded-full animate-pulse" />
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed italic">
                                "{message}"
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
