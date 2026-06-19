'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Info, Activity, Search, HardDrive, Lock, Shield } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';

interface OmniInputGroupProps {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    value: any;
    onChange: (val: any) => void;
    guidance?: string;
    knowedgePoint?: string;
}

/**
 * ⌨️ OmniInputGroup (萬能輸入組組件)
 * 具備「教學提示」與「實時 5T 感測」功能的高級輸入組件。
 */
export const OmniInputGroup: React.FC<OmniInputGroupProps> = ({
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    guidance,
    knowedgePoint,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    // 模擬 5T 感測 (Sensor Feedback)
    const calculate5T = () => {
        const valStr = String(value || '');
        if (valStr.length === 0) return 0;
        if (valStr.length < 10) return 40;
        if (valStr.length < 30) return 75;
        return 100;
    };

    const score = calculate5T();

    return (
        <div className="space-y-3 group" data-uuid={`input-${id}`}>
            <div className="flex justify-between items-end px-1">
                <label className="text-xs font-black text-omni-text-main uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className={isFocused ? 'text-omni-primary' : 'text-omni-text-muted'} />
                    {label}
                </label>
                {guidance && (
                    <button
                        onClick={() => setShowGuide(!showGuide)}
                        className="text-omni-primary hover:text-omni-accent transition-colors"
                    >
                        <HelpCircle size={14} />
                    </button>
                )}
            </div>

            <div className="relative">
                {type === 'textarea' ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        rows={4}
                        className="w-full bg-omni-surface/50 border-2 border-transparent focus:border-omni-primary/50 rounded-2xl p-4 text-sm text-omni-text-main placeholder:text-omni-text-muted/50 outline-none transition-all resize-none shadow-inner"
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className="w-full h-12 bg-omni-surface/50 border-2 border-transparent focus:border-omni-primary/50 rounded-xl px-4 text-sm text-omni-text-main placeholder:text-omni-text-muted/50 outline-none transition-all shadow-inner"
                    />
                )}

                {/* 5T Sensor Progress Bar */}
                <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-omni-surface-2 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        className={`h-full bg-gradient-to-r ${score > 70 ? 'from-omni-primary to-omni-accent' : 'from-amber-400 to-omni-primary'}`}
                    />
                </div>
            </div>

            <AnimatePresence>
                {showGuide && guidance && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-omni-primary/5 border border-omni-primary/20 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-omni-primary">
                                <Info size={14} />
                                <span className="text-[10px] font-black uppercase tracking-wider">引導教學 (Guidance)</span>
                            </div>
                            <p className="text-[11px] text-omni-text-main leading-relaxed">
                                {guidance}
                            </p>
                            {knowedgePoint && (
                                <div className="mt-2 pt-2 border-t border-omni-primary/10">
                                    <p className="text-[9px] text-omni-primary/70 font-bold italic">
                                        知識點：{knowedgePoint}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
