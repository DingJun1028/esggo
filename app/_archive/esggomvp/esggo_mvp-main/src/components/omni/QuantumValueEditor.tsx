import React, { useState, useEffect } from 'react';
import { OmniIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';

interface QuantumValueEditorProps {
    value: string | number;
    label: string;
    unit?: string;
    onSave?: (newValue: string) => void;
    isEditable?: boolean;
    className?: string;
}

/**
 * 💎 QuantumValueEditor
 * An inline editor for ESG metrics with Liquid Glass aesthetics and validation.
 */
export const QuantumValueEditor: React.FC<QuantumValueEditorProps> = ({
    value,
    label,
    unit,
    onSave,
    isEditable = true,
    className = ''
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value.toString());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setTempValue(value.toString());
    }, [value]);

    const handleSave = async () => {
        if (tempValue === value.toString()) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            // Simulate network delay or async saving
            await new Promise(resolve => setTimeout(resolve, 600));
            onSave?.(tempValue);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save value:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setTempValue(value.toString());
            setIsEditing(false);
        }
    };

    return (
        <div className={`group relative ${className}`}>
            <div className="flex flex-col">
                <span className="text-[10px] text-omni-text-muted font-black uppercase tracking-widest mb-1 opacity-70">
                    {label}
                </span>

                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            key="editing"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isSaving}
                                className="bg-omni-surface-2 border border-omni-primary/30 rounded-lg px-2 py-1 text-sm text-omni-text-main focus:outline-none focus:ring-1 focus:ring-omni-primary/50 w-24 font-bold"
                                autoFocus
                            />
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors"
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                                    ) : (
                                        <OmniIcon name="Success" size={16} />
                                    )}
                                </button>
                                <button
                                    onClick={() => { setTempValue(value.toString()); setIsEditing(false); }}
                                    disabled={isSaving}
                                    className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors"
                                >
                                    <OmniIcon name="Error" size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="viewing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-baseline gap-1"
                        >
                            <span className="text-3xl font-black text-omni-text-main tracking-tighter leading-none group-hover:text-omni-primary transition-colors">
                                {value}
                            </span>
                            {unit && (
                                <span className="text-xs font-bold text-omni-text-muted uppercase opacity-60">
                                    {unit}
                                </span>
                            )}
                            {isEditable && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="opacity-0 group-hover:opacity-100 transition-all ml-3 p-1 text-omni-text-muted hover:text-omni-primary hover:bg-omni-primary/5 rounded-md"
                                >
                                    <OmniIcon name="Edit" size={14} />
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Liquid Glass Highlight */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover:h-8 bg-omni-primary/40 rounded-full transition-all duration-500" />
        </div>
    );
};
