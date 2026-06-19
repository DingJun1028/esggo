'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { IOmniNote, OmniWuzuoNoteService } from "@/core/wuzuo-note";
import {
    ShieldCheck,
    Lock,
    Unlock,
    CloudSync,
    Feather,
    Zap,
    CheckCircle2,
    Tag
} from "lucide-react";

interface Props {
    note: IOmniNote | null;
    onUpdate: (note: IOmniNote) => void;
}

/**
 * 🧘 ZenEditor - 「無作」中心編輯器
 * 核心特性：
 * 1. 自動存檔 (Actionless Saving)
 * 2. 5T 能量感知 (Energy Aura)
 * 3. 完美替代主流產品的極簡美學
 */
export const ZenEditor: React.FC<Props> = ({ note, onUpdate }) => {
    const [localNote, setLocalNote] = useState<IOmniNote | null>(note);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'dirty' | 'saving' | 'saved'>('idle');

    // 當外部 note 改變時同步內部狀態
    useEffect(() => {
        setLocalNote(note);
        setSaveStatus('idle');
    }, [note]);

    // 自動存檔邏輯
    useEffect(() => {
        if (saveStatus !== 'dirty' || !localNote || localNote.status === 'Trustworthy') return;

        const timer = setTimeout(async () => {
            setSaveStatus('saving');
            await OmniWuzuoNoteService.updateNote(localNote.uuid, {
                title: localNote.title,
                content: localNote.content
            });
            setSaveStatus('saved');
            onUpdate(localNote);
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 2000); // 停止輸入 2 秒後觸發

        return () => clearTimeout(timer);
    }, [localNote, saveStatus, onUpdate]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: 'title' | 'content') => {
        if (localNote?.status === 'Trustworthy') return;
        if (localNote) {
            setLocalNote({ ...localNote, [field]: e.target.value });
            setSaveStatus('dirty');
        }
    };

    const handleSeal = async () => {
        if (!localNote || localNote.status === 'Trustworthy') return;
        if (confirm("確定要在「永恆宮殿」中封印此項知識資產嗎？此操作不可逆。")) {
            setSaveStatus('saving');
            await OmniWuzuoNoteService.engraveNote(localNote.uuid);
            const updated = (await OmniWuzuoNoteService.getAllNotes()).find(n => n.uuid === localNote.uuid);
            if (updated) {
                setLocalNote(updated);
                onUpdate(updated);
            }
            setSaveStatus('saved');
        }
    };

    if (!localNote) {
        return (
            <div className="h-full flex flex-col items-center justify-center opacity-20 group">
                <Feather size={48} className="mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-black uppercase tracking-[0.5em]">Enter the Flow</p>
            </div>
        );
    }

    const isSealed = localNote.status === 'Trustworthy';

    return (
        <LiquidGlassContainer
            enablePerspective={!isSealed}
            isSealed={isSealed}
            glowColor={isSealed ? "gold" : "aqua"}
            className="h-full flex flex-col p-8"
        >
            {/* 頂部狀態列 */}
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${isSealed ? 'bg-amber-500/10 text-amber-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
                        {isSealed ? <Lock size={16} /> : <Unlock size={16} />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Asset Status</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isSealed ? 'text-amber-400' : 'text-cyan-400'}`}>
                            {isSealed ? 'Trustworthy / Eternal' : 'Fluid / Evolution'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <AnimatePresence>
                        {saveStatus === 'saving' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-white/40">
                                <CloudSync size={12} className="animate-spin" />
                                <span className="text-[8px] font-mono uppercase tracking-widest">Syncing to Wuzuo...</span>
                            </motion.div>
                        )}
                        {saveStatus === 'saved' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-green-400/60">
                                <CheckCircle2 size={12} />
                                <span className="text-[8px] font-mono uppercase tracking-widest">Achieved</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isSealed && (
                        <button
                            onClick={handleSeal}
                            className="px-6 py-2 rounded-full bg-cyan-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        >
                            Seal 5T
                        </button>
                    )}
                </div>
            </div>

            {/* 標題輸入 */}
            <input
                type="text"
                value={localNote.title}
                onChange={(e) => handleChange(e, 'title')}
                readOnly={isSealed}
                className={`
          bg-transparent text-5xl font-black italic outline-none mb-4 w-full placeholder:text-white/5
          transition-colors uppercase tracking-tighter
          ${isSealed ? 'text-white/40' : 'text-white focus:text-cyan-400'}
        `}
                placeholder="THOUGHT TITLE..."
            />

            <div className="flex items-center gap-6 mb-10 text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]">
                <div className="flex items-center gap-2">
                    <span className="opacity-40">UUID:</span>
                    <span>{localNote.uuid.slice(0, 16)}...</span>
                </div>
                <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                    <span className="opacity-40">Created:</span>
                    <span>{new Date(localNote.timestamp).toLocaleDateString()}</span>
                </div>
                {localNote.tags && localNote.tags.length > 0 && (
                    <div className="flex items-center gap-2 border-l border-white/10 pl-6 text-cyan-500/60 font-black">
                        <Tag size={10} />
                        <span className="tracking-[0.1em]">{localNote.tags[0].semantic} {localNote.tags.length > 1 ? `+${localNote.tags.length - 1}` : ''}</span>
                    </div>
                )}
            </div>

            {/* 內容編輯區 */}
            <div className="flex-1 relative">
                <textarea
                    value={localNote.content}
                    onChange={(e) => handleChange(e, 'content')}
                    readOnly={isSealed}
                    className={`
            w-full h-full bg-transparent outline-none resize-none
            text-xl font-light leading-relaxed custom-scrollbar
            placeholder:text-white/5 selection:bg-cyan-500/20
            ${isSealed ? 'text-white/20 italic' : 'text-white/70'}
          `}
                    placeholder="Flow your sentient data here..."
                />

                {/* 背景 5T 浮水印 (當完成封印時) */}
                {isSealed && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                        <ShieldCheck size={300} className="text-amber-500" />
                    </div>
                )}
            </div>

            {/* 底部 5T 證據摘要 */}
            {isSealed && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center"
                >
                    <div className="flex gap-8">
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-1">Integrity Hash</span>
                            <code className="text-[9px] text-amber-500/60 font-mono">{localNote.evidence?.hash?.slice(0, 32)}...</code>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-1">Block Height</span>
                            <code className="text-[9px] text-white/40 font-mono">0x{localNote.timestamp.toString(16).toUpperCase()}</code>
                        </div>
                    </div>
                    <Zap size={14} className="text-amber-500 animate-pulse" />
                </motion.div>
            )}
        </LiquidGlassContainer>
    );
};
